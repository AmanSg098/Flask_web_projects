from flask import Blueprint, request, jsonify
from ..jwt_utils import token_required
from ..models import Product, db

product_bp = Blueprint('products', __name__)

@product_bp.route('/', methods=['GET'])
def get_all_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products]), 200

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict()), 200

@product_bp.route('/', methods=['POST'])
@token_required
def create_product():
    data = request.get_json()
    new_product = Product(
        name=data['name'],
        description=data.get('description'),
        price=data['price'],
        stock=data['stock'],
        quantity=data.get('quantity', 0)
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201

@product_bp.route('/<int:product_id>', methods=['PUT'])
@token_required
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.stock = data.get('stock', product.stock)
    product.quantity = data.get('quantity', product.quantity)
    db.session.commit()
    return jsonify(product.to_dict()), 200

@product_bp.route('/<int:product_id>', methods=['DELETE'])
@token_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'}), 200
