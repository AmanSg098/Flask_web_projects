from flask import request, jsonify
from sqlite_rest_api import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from .models import User, Quote
from functools import wraps
from flask import Blueprint
import logging

# setting blueprint for the routes of api
api = Blueprint('api', __name__)

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
        password = data.get('password')

        if not username or not email or not password:
            logging.warning('User creation failed: Missing required fields.')
            return jsonify({'message': 'Missing required fields', 'code': 400}), 400
        
        user = User(username=username, email=email)
        user.hash_password(password)
        db.session.add(user)
        db.session.commit()
        
        logging.info(f'User - {username} created successfully')
        return jsonify({'message':'User created successfully', 'code':201}), 201
    
    except IntegrityError as e:
        db.session.rollback()
        logging.error(f'Duplicate entryor integrity constraint voilation for user:{user}')
        return jsonify({'error': 'Integrity Error', 'message': 'Username or Email already exists'}), 409

    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f'Database error while adding user: {str(e)}')
        return jsonify({'error':'Database Error','message':str(e)}), 500
    except Exception as e:
        logging.error(f'Unexpected error {str(e)}')
        return jsonify({'message':'Unexpected error occured', 'error':str(e)}), 500
        

@api.route('/add', methods=['POST'])
@basic_auth_required
def add_quote():
    try:
        data = request.json
        author = request.authorization.username
        if not data or 'quote' not in data:
            logging.error(f'No quote to add!')
            return jsonify({'message':'No quote to add', 'code':400}), 400
        
        user = User.query.filter_by(username=author).first()
        if not user:
            logging.error(f'No such user found {author}')
            return jsonify({'message':f'User {author} not found', 'code':400}), 400
        
        new_quote = Quote(quote=data['quote'], user_id=user.id)
        db.session.add(new_quote)
        db.session.commit()
        
        logging.info(f'Quote added by {user}')
        return jsonify({'message':'Quote added successfully', 'code':201}), 201
    
    except Exception as e:
        logging.error(f'An error occured while adding quote. {e}')
        return jsonify({'error':f'Error occurred {e}', 'code':500}), 500




    
    
    