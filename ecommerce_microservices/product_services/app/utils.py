from functools import wraps
from flask import request, jsonify
import jwt  # Ensure you have the PyJWT package installed

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing!"}), 403
        try:
            decoded_token = jwt.decode(token, 'your_secret_key', algorithms=["HS256"])
            user_role = decoded_token.get('role')
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired!"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token!"}), 403
        
        # Add the user role to the request for later use
        request.user_role = user_role
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.user_role != 'admin':
            return jsonify({"error": "You do not have permission to perform this action"}), 403
        return f(*args, **kwargs)
    return decorated_function
