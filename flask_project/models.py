from datetime import datetime
from itsdangerous import TimestampSigner, URLSafeSerializer, BadSignature, SignatureExpired
from flask_project import db, login_manager
from flask import current_app
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

class User(db.Model, UserMixin ):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpeg')
    password = db.Column(db.String(60), nullable=False)
    posts = db.relationship('Post',backref='author', lazy=True)
    
    def __repr__(self):
        return f"User('{self.username}','{self.email}','{self.image_file}')"
    
    def get_reset_token(self):
        secret_key = current_app.config['SECRET_KEY']
        t = TimestampSigner(secret_key)
        s = URLSafeSerializer(secret_key)
        payload = {'user_id': self.id}
        token = s.dumps(payload)
        timed_sign_token = t.sign(token)
        return timed_sign_token.decode('utf-8')
    
    @staticmethod
    def verify_reset_token(token, max_age=900):
        secret_key = current_app.config['SECRET_KEY']
        t = TimestampSigner(secret_key)
        s = URLSafeSerializer(secret_key)
        try:
            timed_unsign_token = t.unsign(token, max_age=max_age)
            data = s.loads(timed_unsign_token)
            user_id = data['user_id']
            return User.query.get(user_id)
        except SignatureExpired:
            print("Token expired")
            return None
        except BadSignature:
            print("Token tampered or invalid")
            return None


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Post('{self.title}','{self.date_posted}')"