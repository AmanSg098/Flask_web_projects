from flask import request, jsonify
from sqlite_rest_api import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from models import User
from flask import Blueprint
import logging

api = Blueprint('api', __name__)

logging.basicConfig(filename='api.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

@api.before_request
def log_requests_info():
    if request.method in ['POST','PUT','PATCH']:
        logging.info(f'Request: {request.method} {request.url} - Payload {request.json}')
    else:
        logging.info(f'Request: {request.method} {request.url}')


@api.route('register', methods=['POST'])
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
        

