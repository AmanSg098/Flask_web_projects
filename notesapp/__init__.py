from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
import os

app = Flask(__name__)

app.config['SECRET_KEY'] = 'SECRET_KEY'
basedir = os.path.abspath(os.path.dirname(__file__))  # Get project directory
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'notesapp.db')
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

from notesapp import routes