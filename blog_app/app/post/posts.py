from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Post, Tag, User
from slugify import slugify

posts_bp = Blueprint('posts', __name__, url_prefix='/posts')

@posts_bp.route('/create', methods=['POST'])
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


@posts_bp.route('/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    post.views += 1
    db.session.commit()

    return jsonify(
        {
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "content": post.content,
            "author": post.author.username,
            "tags": [tag.name for tag in post.tags],
            "views": post.views,
            "likes": len(post.likes),
            "comments": len(post.comments),
            "created_at": post.created_at,
            "updated_at": post.updated_at
        }
    ), 200


@posts_bp.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    user_mail = get_jwt_identity()
    user = User.query.filter_by(email=user_mail).first()
    post = Post.query.get_or_404(post_id)

    if post.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    post.title = data.get('title', post.title)
    post.slug = slugify(post.title)
    post.content = data.get('content', post.content)
    post.status = data.get('status', post.status)
    post.image_url = data.get('image_url', post.image_url)

    # Handle tags
    tags = data.get('tags')  # Expecting list of tag names
    if tags is not None:
        post.tags.clear()
        for tag_name in tags:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            post.tags.append(tag)

    db.session.commit()
    return jsonify({'message': 'Post updated'}), 200


@posts_bp.route('/delete/<int:id>',methods=['DELETE'])
@jwt_required()
def delete_post(id):
    user_mail = get_jwt_identity()
    user = User.query.filter_by(email=user_mail).first()
    post = Post.query.filter_by(id=id).first()

    if not post:
        return jsonify({'error': 'Post not found'}), 404

    if post.user_id != user.id:
        return jsonify({'error':'Unauthorized'}), 403
    
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message':'Post Deleted'}), 200


@posts_bp.route('/', methods=['GET'])
def get_posts():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    tag = request.args.get('tag')
    author = request.args.get('author')
    status = request.args.get('status', 'published')

    query = Post.query.filter_by(status=status)

    if tag:
        query = query.join(Post.tags).filter(Tag.name == tag)

    if author:
        query = query.join(User).filter(User.username == author)

    posts_paginated = query.order_by(Post.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    posts = posts_paginated.items

    data = []
    for post in posts:
        data.append({
            'id': post.id,
            'title': post.title,
            'slug': post.slug,
            'author': post.author.username,
            'tags': [tag.name for tag in post.tags],
            'created_at': post.created_at.isoformat(),
            'status': post.status
        })

    return jsonify({
        'posts': data,
        'total': posts_paginated.total,
        'pages': posts_paginated.pages,
        'current_page': posts_paginated.page
    }), 200

