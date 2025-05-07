from flask import request, Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models import User, Post, Tag, Comment
from app import db

comment_bp = Blueprint('comment',__name__, url_prefix='/comment')

@comment_bp.route('/create/<int:post_id>', methods=['POST'])
@jwt_required()
def create_comment(post_id):
    user_mail = get_jwt_identity()
    user = User.query.filter_by(email=user_mail).first()
    post = Post.query.get_or_404(post_id)
    data = request.get_json()
    content = data.get('content')
    
    if not content:
        return jsonify({'error':'Content is required'}), 400
    
    comment = Comment(content=content,
                      user_id=user.id,
                      post_id=post.id)
    db.session.add(comment)
    db.session.commit()
    return jsonify({'message':'Comment created',
                    'comment_id':comment.id}), 201



