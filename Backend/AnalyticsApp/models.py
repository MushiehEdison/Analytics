from . import db, login_manager
from flask_login import UserMixin
from datetime import datetime, timezone

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    role = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.Integer, nullable=False, unique=True)
    companies = db.relationship('Company', backref='owner', lazy=True)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.fullname}')"

class Company(db.Model):
    __tablename__ = 'company'
    id = db.Column(db.Integer, primary_key=True)
    companyName = db.Column(db.String(60), nullable=False)
    companyLogo = db.Column(db.String(120), nullable=True, unique=True)
    industry = db.Column(db.String(60), nullable=False)
    numberOfEmployee = db.Column(db.Integer, nullable=True)
    annualRevenue = db.Column(db.Integer, nullable=True)
    legalStructure = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(20), nullable=False)
    companyContact = db.Column(db.Integer, nullable=False, unique=True)
    website = db.Column(db.String(20), nullable=True)
    DateOfCreation = db.Column(db.DateTime, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f"Company('{self.companyName}')"
