from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager
from flask_caching import Cache

db = SQLAlchemy()
migrate = Migrate()
limiter = Limiter(key_func=get_remote_address)
jwtmanager = JWTManager()
cache = Cache(config={'CACHE_TYPE':'SimpleCache'})