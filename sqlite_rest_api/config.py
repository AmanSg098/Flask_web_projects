from dotenv import load_dotenv
import os
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')    # a secret key
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')  # path to database file
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # not to track any changes or updation in database
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')