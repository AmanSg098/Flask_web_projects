from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps
from flask import jsonify

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get('role') != 'admin':
                return jsonify({"msg": "Access forbidden: Insufficient role"}), 403
        except Exception as e:
            return jsonify({'message':str(e)}), 401
        return fn(*args, **kwargs)
    return wrapper

