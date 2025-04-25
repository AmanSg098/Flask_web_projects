from flask import Blueprint, request, jsonify
from app.models import User, db
from app.utils.jwt_utils import generate_token
from app.utils.decorators import role_required
from flask_jwt_extended import jwt_required, get_jwt_identity


auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if User.query.filter((User.username == data['username']) | (User.email == data['email'])).first():
        return jsonify({"msg": "User already exists"}), 400

    new_user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'user')  # default to user
    )
    new_user.set_password(data['password'])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = generate_token(user)
    return jsonify(access_token=access_token), 200


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify({"logged_in_as": current_user}), 200


@auth_bp.route('/admin-only', methods=['GET'])
@jwt_required()
@role_required('admin')
def admin_only():
    user = get_jwt_identity()
    return jsonify({"msg": f"Welcome admin {user['username']}"}), 200

