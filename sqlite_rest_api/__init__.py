from flask import Flask
from .database import db
from .config import Config
from flask_cors import CORS
from flask_migrate import Migrate
from routes import api

migrate = Migrate()

def create_app(config = Config):
    # creating application instance
    app = Flask(__name__)

    # setting configuration
    app.config.from_object(config)
    db.init_app(app)    # initializing the database instance with app
    CORS(app)
    migrate.init_app(app, db)

    app.register_blueprint(api, url_prefix='api')

    return app