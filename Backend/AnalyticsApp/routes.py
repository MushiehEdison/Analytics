from flask import request, jsonify
from . import app, db, bcrypt
from .models import User, Company

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
        socialMedia = data.get('socialMedia')

        if password != confirmPassword:
            return jsonify({"error": "Passwords do not match"}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({"error": "User with this username already exists"}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "User with this email already exists"}), 400

        hashedPassword = bcrypt.generate_password_hash(password).decode("utf-8")
        user = User(fullname=fullname, username=username, password=hashedPassword, email=email, role=role, phone=phone)
        db.session.add(user)
        db.session.commit()
        print(f"User created with ID: {user.id}")

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
            user_id=user.id
        )
        db.session.add(company)
        db.session.commit()
        print(f"Company created with ID: {company.id}")

        return jsonify({"message": "Registration successful"}), 201

    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while saving to the database", "details": str(e)}), 500
