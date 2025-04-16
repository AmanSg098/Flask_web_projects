from flask import Flask
from .extension import db, limiter, migrate, jwtmanager, cache
from .config import Config
from flask_cors import CORS
from .routes import api

def create_app(config = Config):
    # creating application instance
    app = Flask(__name__)

    # setting configuration
    app.config.from_object(config)
    db.init_app(app)    # initializing the database instance with app
    limiter.init_app(app)
    jwtmanager.init_app(app)
    cache.init_app(app)
    CORS(app)
    migrate.init_app(app, db)

    app.register_blueprint(api, url_prefix='/api')

    return app          