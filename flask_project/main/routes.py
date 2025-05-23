from flask import render_template, request, Blueprint
from flask_project.models import Post

main = Blueprint('main',__name__)

# @main.route("/")
# @main.route("/home")
# def home():
#     # shows all posts together
#     posts = Post.query.all()
#     return render_template("home.html", posts=posts)


@main.route("/")
@main.route("/home")
def home():
    # paginated home page
    page = request.args.get('page', 1, type=int)
    posts = Post.query.order_by(Post.date_posted.desc()).paginate(page=page, per_page=3)
    return render_template("home.html", posts=posts)


@main.route("/about")
def about():
    return render_template("about.html", title='About')