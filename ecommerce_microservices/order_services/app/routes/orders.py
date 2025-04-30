from flask import Blueprint, request, jsonify
from ..models import Order, db
from ..utils.jwt_utils import token_required

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
@token_required
def get_all_orders():
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders]), 200

@orders_bp.route('/<int:order_id>', methods=['GET'])
@token_required
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    return jsonify(order.to_dict()), 200

@orders_bp.route('/', methods=['POST'])
@token_required
def create_order():
    data = request.get_json()
    try:
        new_order = Order(
            user_id=data['user_id'],
            product_id=data['product_id'],
            quantity=data['quantity'],
            total_price=data['total_price']
        )
        db.session.add(new_order)
        db.session.commit()
        return jsonify(new_order.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@orders_bp.route('/<int:order_id>', methods=['PUT'])
@token_required
def update_order(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.get_json()
    order.quantity = data.get('quantity', order.quantity)
    order.status = data.get('status', order.status)
    db.session.commit()
    return jsonify(order.to_dict()), 200

@orders_bp.route('/<int:order_id>', methods=['DELETE'])
@token_required
def delete_order(order_id):
    order = Order.query.get_or_404(order_id)
    db.session.delete(order)
    db.session.commit()
    return jsonify({'message': 'Order deleted successfully'}), 200
