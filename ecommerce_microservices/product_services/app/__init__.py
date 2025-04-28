from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import Config
from flask_migrate import Migrate 

db = SQLAlchemy()
migrate = Migrate()

def create_app(config=Config):
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    migrate.init_app(app, db)

    from .routes.products import product_bp
    app.register_blueprint(product_bp, url_prefix='/api/products')

    return app

