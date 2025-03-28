from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

# Initialize Flask app
app = Flask(__name__)

# Setup configurations
app.config['SECRET_KEY'] = 'c79f0253bccc2592689a322cea09095d'
app.config['JWT_SECRET_KEY'] = 'c79f0253bqcc25920989a322cea09095d'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost/businesscompass'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(),'static/uploads/')
app.config['DEFAULT_LOGO'] = 'static/logo/companyLogo.jpeg'
AlLOWED_EXTENSION = {'pdf', 'csv', 'xlsx', 'xls', 'doc', 'docx', 'txt'}
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024
JWT_ACCESS_TOKEN_EXPIRES = 3600 # 1 hour in seconds
JWT_REFRESH_TOKEN_EXPIRES = 86400 * 7 # 7 days in seconds

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)


login_manager.login_view = 'login'

# Import routes
from .routes import *
from .models import Company, User, Risk, Operation, UploadedFile, LegalCompliance, Alerts, EmployeeData,EmployeePerformance,Report, Inventory, FinancialData, CustomerFeedback, MarketingCampaign, SalesData