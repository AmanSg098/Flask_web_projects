from .database import db
from flask_bcrypt import Bcrypt

# bcrypt class for hashing passwords of registering users
bcrypt = Bcrypt()

# user model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)

    def hash_password(self, user_pass):
        self.password = bcrypt.generate_password_hash(user_pass).decode('utf-8')
    
    def check_password(self, auth_pass):
        return bcrypt.check_password_hash(self.password, auth_pass)

class Quote(db.Model):
    quote_id = db.Column(db.Integer, primary_key=True)
    quote = db.Column(db.Text, unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    author = db.relationship('User', backref='quotes')