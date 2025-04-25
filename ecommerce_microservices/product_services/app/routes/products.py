from flask import Blueprint, request, jsonify
from app.models import Product, db
from app.decorators import role_required
from flask_jwt_extended import jwt_required


product_bp = Blueprint('product_bp', __name__)

# Create product
@product_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('admin')  
def create_product():
    data = request.get_json()

    new_product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        stock=data['stock']
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify(new_product.to_dict()), 201

# Get all products
@product_bp.route('/', methods=['GET'])
@jwt_required()
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])

# Get product by ID
@product_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

# Update product
@product_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
@role_required('admin')
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()

    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.stock = data.get('stock', product.stock)

    db.session.commit()
    return jsonify(product.to_dict())

# Delete product
@product_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"msg": "Product deleted"}), 200
