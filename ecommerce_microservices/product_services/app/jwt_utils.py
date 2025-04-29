from flask_jwt_extended import verify_jwt_in_request
from functools import wraps
from flask import jsonify

def token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception as e:
            return jsonify({"message": str(e)}), 401
        return fn(*args, **kwargs)
    return wrapper
