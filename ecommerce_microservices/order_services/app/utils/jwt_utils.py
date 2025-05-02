from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps
from flask import jsonify
from auth_services.app.models import User   # Adjust import path as needed

def token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            username = get_jwt_identity()
            user = User.query.filter_by(username=username).first()
            if not user:
                return jsonify({"message": "User not found"}), 404
            current_user_id = user.id
        except Exception as e:
            return jsonify({"message": str(e)}), 401
        return fn(current_user_id, *args, **kwargs)
    return wrapper
