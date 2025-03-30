from flask_wtf import FlaskForm
from wtforms import TextAreaField, StringField, SubmitField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from notesapp.models import User

class NoteForm(FlaskForm):
    title = StringField('Note Title', validators=[DataRequired(), Length(min=2,max=50)])
    content = TextAreaField('Write your content...', validators=[DataRequired()])
    submit = SubmitField('Add Note')

class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=40)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(),
                            Length(min=6, max=20, message="Password must be between 6 to 20 characters long.")])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), 
                                    EqualTo('password', message='Passwords must match')])
    submit = SubmitField('Register')
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('This username is taken please try a different one!!')
    
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('This username is taken please try a different one!!')
        

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')
