from flask_jwt_extended import get_jwt_identity
from functools import wraps
from flask import jsonify

def role_required(required_role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user = get_jwt_identity()
            if user.get('role') != required_role:
                return jsonify({"msg": "Access forbidden: Insufficient role"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator