from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Setup configurations
app.config['SECRET_KEY'] = 'c79f0253bccc2592689a322cea09095d'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost/businesscompass'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads/'
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5174"}})

login_manager.login_view = 'login'

# Import routes
from .routes import *

