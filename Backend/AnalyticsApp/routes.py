from flask import request, jsonify
from flask_login import login_required, current_user
from . import app, db, bcrypt
from .models import User, Company
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Extract and validate form data
        fullname = data.get('fullName')
        username = data.get('username')
        phone = data.get('phone')
        email = data.get('email')
        password = data.get('password')
        confirmPassword = data.get('confirmPassword')
        role = data.get('role')
        companyName = data.get('companyName')
        businessAddress = data.get('businessAddress')
        companyContact = data.get('companyContact')
        industry = data.get('industry')
        companyLogo = data.get('companyLogo')
        numberOfEmployee = data.get('numberOfEmployee')
        annualRevenue = data.get('annualRevenue')
        legalStructure = data.get('legalStructure')
        companyWebsite = data.get('companyWebsite')
        creationDate = data.get('creationDate')

        if password != confirmPassword:
            return jsonify({"error": "Passwords do not match"}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({"error": "User with this username already exists"}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "User with this email already exists"}), 400

        hashedPassword = bcrypt.generate_password_hash(password).decode("utf-8")
        company = Company(
            companyName=companyName,
            industry=industry,
            companyLogo=companyLogo,
            numberOfEmployee=numberOfEmployee,
            annualRevenue=annualRevenue,
            legalStructure=legalStructure,
            address=businessAddress,
            companyContact=companyContact,
            website=companyWebsite,
            DateOfCreation=creationDate,
        )
        db.session.add(company)
        db.session.commit()
        print(f"Company created with ID: {company.id}")


        user = User(fullname=fullname, username=username, password=hashedPassword, email=email, role=role, phone=phone, company_id=company.id)
        db.session.add(user)
        db.session.commit()
        print(f"User created with ID: {user.id}")



        return jsonify({"message": "Registration successful"}), 201

    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while saving to the database", "details": str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()  # Get JSON data from request
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"msg": "Missing email or password"}), 400

    email = data['email']  # Extract email from the request data
    password = data['password']  # Extract password from the request data

    # Check if user exists and password is correct
    user = User.query.filter_by(email=email).first()  # Use the email variable here
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=email)  # Create token with user email
        print(f"Generated token: {access_token}")  # Print token to console
        return jsonify(access_token=access_token), 200
    return jsonify({'msg': 'Invalid Credentials'}), 401

@app.route('/api/validate', methods=['GET'])
@jwt_required()
def validate_token():
    return jsonify({"message":"Valid Form"}),200


@app.route('/api/navigation', methods=['GET'])
@jwt_required()
def get_navigation():
    # Get the current user from the JWT
    current_user_email = get_jwt_identity()

    # Fetch the user and company from the database
    user = db.session.query(User).filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    company = db.session.query(Company).filter_by(id=user.company_id).first()
    if not company:
        return jsonify({"error": "Company not found"}), 404

    # Return the user’s company name
    return jsonify({
        "companyId": user.company_id,
        "companyName": company.companyName
    })


