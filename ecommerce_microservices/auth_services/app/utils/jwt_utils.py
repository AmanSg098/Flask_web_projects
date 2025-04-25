from flask_jwt_extended import create_access_token

def generate_token(user):
    identity = {
        "username": user.username,
        "role": user.role
    }
    return create_access_token(identity=identity)
