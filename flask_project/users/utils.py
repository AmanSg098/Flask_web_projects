from flask import url_for
from flask_project import mail
from flask import current_app
from flask_mail import Message
from PIL import Image
import secrets
import os


def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(current_app.root_path, 'static', picture_fn)
    
    output_size = (125,125)
    img = Image.open(form_picture)
    img.thumbnail(output_size)
    img.save(picture_path)
    
    return picture_fn


def send_reset_email(user):
    token = user.get_reset_token()
    msg = Message('Password Reset Request',
                  sender=current_app.config['MAIL_USERNAME'],
                  recipients=[user.email])
    msg.body = f'''To reset your password visit the following link:
{url_for('users.reset_token',token=token, _external=True)}

If it wans't your request, simply ignore the mail.
'''
    mail.send(msg)