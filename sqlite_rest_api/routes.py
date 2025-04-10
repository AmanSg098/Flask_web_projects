from flask import request, jsonify, url_for, abort
from .extension import db, limiter
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity, verify_jwt_in_request
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from .models import User, Quote
from functools import wraps
from flask import Blueprint
import logging
from datetime import timedelta


# setting blueprint for the routes of api
api = Blueprint('api', __name__)

from sqlite_rest_api import limiter

valid_roles = ['admin','user']

# configuring loggin mechanism
logging.basicConfig(filename='api.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')


# before each request, log request and data/payload if provided
@api.before_request
def log_requests_info():
    if request.method in ['POST','PUT','PATCH']:
        logging.info(f'Request: {request.method} {request.url} - Payload {request.json}')
    else:
        logging.info(f'Request: {request.method} {request.url}')

# implementing role_required with jwt identity checker
def role_required(required_role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user = get_jwt_identity()
            if user['role'] != required_role:
                abort(403, description="Access denied")
            return fn(*args, **kwargs)
        return decorator
    return wrapper


# implementing a decorator for basic authentication method
def basic_auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if not auth or not auth.username or not auth.password:
            return jsonify({'message': 'Authentication required'}), 401
        
        user = User.query.filter_by(username=auth.username).first()
        if not user or not user.check_password(auth.password):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        logging.info(f'User authorized')
        return f(*args, **kwargs)  # Proceed with the actual function

    return decorated_function


# register route for registering user for implementing basic auth or jwt auth
@api.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        if not data:
            logging.error('Request body is empty or invalid.')
            return jsonify({'message': 'Invalid or missing data', 'code': 400}), 400

        username = data.get('username')
        email = data.get('email')
        role = data.get('role')
        password = data.get('password')

        if not username or not email or not password or role not in valid_roles:
            logging.warning('User creation failed: Missing required fields.')
            return jsonify({'message': 'Missing required fields', 'code': 400}), 400
        
        user = User(username=username, email=email, role=role)
        user.hash_password(password)
        db.session.add(user)
        db.session.commit()
        
        logging.info(f'User - {username} created successfully')
        return jsonify({'message':'User created successfully', 'code':201}), 201
    
    except IntegrityError as e:
        db.session.rollback()
        logging.error(f'Duplicate entry or integrity constraint voilation for user:{user}')
        return jsonify({'error': 'Integrity Error', 'message': 'Username or Email already exists'}), 409

    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f'Database error while adding user: {str(e)}')
        return jsonify({'error':'Database Error','message':str(e)}), 500
    except Exception as e:
        logging.error(f'Unexpected error {str(e)}')
        return jsonify({'message':'Unexpected error occured', 'error':str(e)}), 500

@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        if not data:
            return jsonify({'message':'Unauthorized access', 'code':401}), 401
        username = data.get('username')
        password = data.get('password')
        if not username or not password:
            return jsonify({'message':'Credentials Required', 'code':400}), 400
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return jsonify({'message': 'Invalid credentials', 'code': 401}), 401
        if user.check_password(password):
            access_token = create_access_token(identity={'user_mail':user.email,
                                                         'role':user.role},
                                                         expires_delta=timedelta(minutes=60))
            logging.info(f"User {username} logged in successfully")
            return jsonify({'message':'Login successful and Token generted',
                            'Token':access_token,
                            'code':200}), 200
        
    except Exception as e:
        return jsonify({'message':f'Unexpected error {str(e)}',
                        'code':500}), 500


@api.route('/add', methods=['POST'])
@jwt_required()
@role_required('user')
def add_quote():
    try:
        data = request.json
        identity = get_jwt_identity()
        author_mail = identity['user_mail']
        if not data or 'quote' not in data:
            logging.error(f'Bad request - No quote to add!')
            return jsonify({'message':'No quote to add', 'code':400}), 400
        
        user = User.query.filter_by(email=author_mail).first()
        if not user:
            logging.error(f'No such user found {author_mail}')
            return jsonify({'message':f'User {author_mail} not found', 'code':400}), 400
        
        new_quote = Quote(quote=data['quote'], user_id=user.id)
        db.session.add(new_quote)
        db.session.commit()
        
        logging.info(f'Quote added by {user}')
        return jsonify({'message':'Quote added successfully', 'code':201}), 201
    
    except Exception as e:
        logging.error(f'An error occured while adding quote. {e}')
        return jsonify({'error':f'Error occurred {e}', 'code':500}), 500


@api.route('/quotes',methods=['GET'])
@jwt_required()
@limiter.limit('3 per minute')
def get_quotes():
    try:
        user_mail = get_jwt_identity()
        user = User.query.filter_by(email=user_mail).first()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        paginate_qoutes = Quote.query.paginate(page=page, per_page=per_page, error_out=False)
        logging.info(f'Quotes Fetched for user - {user.username}')
        return jsonify({
            'previous page': url_for('api.get_quotes', page=paginate_qoutes.page-1, per_page=per_page)\
            if paginate_qoutes.page>1 else None,
            'current page': paginate_qoutes.page,
            'next page': url_for('api.get_quotes', page=paginate_qoutes.page+1, per_page=per_page)\
            if paginate_qoutes.page<paginate_qoutes.pages else None,
            'total pages': paginate_qoutes.pages,
            'total quotes': paginate_qoutes.total,
            'data':[{'quote': quote.quote,
            'author':quote.author.username} for quote in paginate_qoutes.items]}), 200
    
    except Exception as e:
        logging.error(F'Error occured while fetching quotes.{e}')
        return jsonify({
            'message':f'Error occured while fetching quotes - {e}',
            'code':500}), 500


@api.route('/edit/<int:quote_id>', methods=['PUT'])
@jwt_required()
def edit_quote(quote_id):
    try:
        data = request.json
        quote = Quote.query.get_or_404(quote_id)
        if not 'quote' in data:
            logging.error(f'Bad request - No data provided to edit')
            return jsonify({'message':'No data provided to edit quote',
                            'code':400}), 400
        user_mail = get_jwt_identity()
        user = User.query.filter_by(email=user_mail).first()
        if not quote.author or quote.author.username != user.username:
            logging.error(f'Forbidden to edit for user - {user}')
            return jsonify({'message':'Unauthorized attempt', 'code':403}), 403
        quote.quote = data['quote']
        db.session.commit()
        logging.info(f'Quote successfully edited by {user}')
        return jsonify({'message':'Quote update successfully',
                        'code':200}), 200
    except Exception as e:
        logging.error(f'Error occured while editing quote.')
        return jsonify({
            'message':f'Error occured while editing quotes - {e}',
            'code':500}), 500


@api.route('/delete/<int:quote_id>', methods=['DELETE'])
@jwt_required()
def delete(quote_id):
    try:
        quote = Quote.query.get_or_404(quote_id)
        user_mail = get_jwt_identity()
        user = User.query.filter_by(email=user_mail).first()
        if not quote.author or quote.author.username != user.username:
            logging.error(f'Forbidden to delete for user - {user}')
            return jsonify({'message':'Unauthorized attempt', 'code':403}), 403
        db.session.delete(quote)
        db.session.commit()
        logging.info(f'Quote successfully deleted by {user}')
        return jsonify({'message':'Quote deleted successfully',
                        'code':200}), 200
    except Exception as e:
        logging.error(f'Error occured while deleting quote.')
        return jsonify({
            'message':f'Error occured while deleting quote - {e}',
            'code':500}), 500

