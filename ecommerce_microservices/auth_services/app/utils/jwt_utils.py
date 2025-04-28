from flask_jwt_extended import create_access_token

def generate_token(user):
    additional_claims = {'role':user.role}
    return create_access_token(identity=user.username,
                               additional_claims= additional_claims)
