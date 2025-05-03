from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Post, Tag, User
from slugify import slugify

posts_bp = Blueprint('posts', __name__, url_prefix='/api/posts')

@posts_bp.route('/', methods=['POST'])
@jwt_required()
def create_post():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    tags = data.get('tags', [])  # expects list of tag names
    image_url = data.get('image_url')

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    slug = slugify(title)
    user_mail = get_jwt_identity()
    user = User.query.filter_by(email=user_mail).first()

    # Create or get tags
    tag_objs = []
    for tag_name in tags:
        tag = Tag.query.filter_by(name=tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.session.add(tag)
        tag_objs.append(tag)

    post = Post(
        title=title,
        slug=slug,
        content=content,
        image_url=image_url,
        user_id=user.id,
        tags=tag_objs
    )

    db.session.add(post)
    db.session.commit()

    return jsonify({"message": "Post created", "post_id": post.id}), 201
