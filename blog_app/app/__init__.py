from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config=Config):
    app = Flask(__name__)

    app.config.from_object(config)
    db.init_app(app)
    migrate.init_app(app=app, db=db)
    jwt.init_app(app)

    from .routes.auth import auth_bp
    from .routes.user import user_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)

    return app