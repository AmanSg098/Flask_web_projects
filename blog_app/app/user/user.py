from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User

user_bp = Blueprint('user', __name__, url_prefix='/user')

@user_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_mail = get_jwt_identity()
    user = User.query.filter_by(email=user_mail).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    })
