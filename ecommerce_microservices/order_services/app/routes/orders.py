from flask import Blueprint, request, jsonify
from ..models import Order, db
from ..utils.jwt_utils import token_required
from ..utils.decorators import admin_required
import requests

PRODUCT_SERVICE_URL = 'http://localhost:5001/api/products'

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
@token_required
def get_user_orders(current_user_id):
    orders = Order.query.filter_by(user_id=current_user_id).all()
    return jsonify([order.to_dict() for order in orders]), 200


@orders_bp.route('/<int:order_id>', methods=['GET'])
@token_required
def get_user_order(current_user_id, order_id):
    order = Order.query.get_or_404(order_id)
    if order.user_id != current_user_id:
        return jsonify({'message': 'Access denied'}), 403
    return jsonify(order.to_dict()), 200


@orders_bp.route('/all', methods=['GET'])
@token_required
@admin_required
def get_all_orders(current_user_id):
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders]), 200


@orders_bp.route('/', methods=['POST'])
@token_required
def create_order(current_user_id):
    data = request.get_json()

    # 1. Fetch product info
    try:
        response = requests.get(f"{PRODUCT_SERVICE_URL}/{data['product_id']}")
        if response.status_code != 200:
            return jsonify({'error': 'Product not found'}), 404
        product_data = response.json()
    except Exception as e:
        return jsonify({'error': f"Product service error: {str(e)}"}), 500

    # 2. Calculate total price
    quantity = data['quantity']
    product_price = product_data['price']
    total_price = product_price * quantity

    # 3. Create order
    new_order = Order(
        user_id=current_user_id,
        product_id=data['product_id'],
        quantity=quantity,
        total_price=total_price
    )
    db.session.add(new_order)
    db.session.commit()
    return jsonify(new_order.to_dict()), 201


@orders_bp.route('/<int:order_id>', methods=['PUT'])
@token_required
def update_order(order_id, current_user_id):
    order = Order.query.get_or_404(order_id)
    if order.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access'}), 403
    data = request.get_json()
    order.quantity = data.get('quantity', order.quantity)
    order.status = data.get('status', order.status)
    db.session.commit()
    return jsonify(order.to_dict()), 200


@orders_bp.route('/<int:order_id>', methods=['DELETE'])
@token_required
def delete_order(order_id, current_user_id):
    order = Order.query.get_or_404(order_id)
    if order.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized access'}), 403
    db.session.delete(order)
    db.session.commit()
    return jsonify({'message': 'Order deleted successfully'}), 200
