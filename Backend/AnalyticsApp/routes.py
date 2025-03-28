from flask import request, jsonify, current_app
import random
import requests
from datetime import datetime
import time
import openai
from pytrends.request import TrendReq
import pytrends
from .google_trends import fetch_google_trends
from . import app, db, bcrypt
from .models import User, Company, Inventory, UploadedFile, EmployeeData, FinancialData, CustomerFeedback, MarketingCampaign, SalesData, EmployeePerformance
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import os
import json
from werkzeug.utils import secure_filename
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


#Market Trends ===================================================================================
pytrends = TrendReq(hl='en-US', tz=360, timeout=(10, 30))
def generate_trend_explanation(query, values):
    try:
        API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
        headers = {"Authorization": "Bearer sk-0eb381dab88749ab9eacb179f3239b03"}  # Free at huggingface.co

        prompt = f"""Analyze this trend data for '{query}':
        - Peak: {max(values)}
        - Low: {min(values)} 
        - Avg: {sum(values) / len(values):.2f}
        Explain in simple terms for non-experts. Include:
        1) Trend summary
        2) Possible reasons for peaks/drops
        3) Market growth insights
        4) Future predictions
        5) Real-world meaning of numbers"""

        response = requests.post(API_URL, headers=headers, json={"inputs": prompt})

        if response.status_code == 200:
            return response.json()[0]['generated_text']
        else:
            return f"Interest in {query} ranged from {min(values)} to {max(values)} (avg: {sum(values) / len(values):.2f})"

    except Exception as e:
        print(f"AI Error Details: {str(e)}")
        return f"Trend analysis unavailable. Technical details: {str(e)}"


# Function to fetch Google Trends data with retries
def fetch_google_trends(query, retries=3, delay=5):
    for attempt in range(retries):
        try:
            pytrends.build_payload(kw_list=[query], timeframe='today 12-m')
            interest_over_time_df = pytrends.interest_over_time()

            # Format dates to a more readable format (e.g., "Jan 2023")
            dates = [datetime.strptime(date, "%Y-%m-%d").strftime("%b %Y") for date in interest_over_time_df.index.strftime('%Y-%m-%d').tolist()]

            # Format the data for the frontend
            trends_data = {
                "query": query,
                "dates": dates,  # Use formatted dates
                "values": interest_over_time_df[query].tolist(),
            }
            return trends_data

        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:  # Don't sleep on the last attempt
                time.sleep(delay)  # Wait before retrying
            else:
                raise  # Re-raise the exception if all retries fail

@app.route('/api/google-trends', methods=['GET'])
def get_google_trends():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required."}), 400

    try:
        trends_data = fetch_google_trends(query)
        explanation = generate_trend_explanation(query, trends_data["values"])
        trends_data["explanation"] = explanation
        return jsonify(trends_data), 200
    except Exception as e:
        print(f"Error fetching Google Trends: {e}")
        return jsonify({"error": "Failed to fetch Google Trends data."}), 500

@app.route('/api/random-trends', methods=['GET'])
def get_random_trends():
    random_trends = ["Bitcoin", "Tesla", "AI", "Ethereum", "NFT", "Meta", "Apple", "Amazon"]
    random_query = random_trends[random.randint(0, len(random_trends) - 1)]

    try:
        trends_data = fetch_google_trends(random_query)
        explanation = generate_trend_explanation(random_query, trends_data["values"])
        trends_data["explanation"] = explanation
        return jsonify(trends_data), 200
    except Exception as e:
        print(f"Error fetching random trends: {e}")
        return jsonify({"error": "Failed to fetch random trends."}), 500




UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'xlsx', 'csv', 'docx', 'xls', 'doc'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/dataentry', methods=['POST'])
@jwt_required()
def data_entry():
    try:
        # Get authenticated user
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Process form data
        strategy_data = json.loads(request.form['strategyData'])
        section = strategy_data.get('activeSection')

        uploaded_files = []
        file_path = None  # Initialize file_path variable

        if 'files' in request.files:
            for file in request.files.getlist('files'):
                if file and file.filename and allowed_file(file.filename):
                    try:
                        # Secure filename and create unique path
                        filename = secure_filename(file.filename)
                        unique_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
                        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)

                        # Save file to disk
                        file.save(file_path)

                        # Create database record
                        new_file = UploadedFile(
                            company_id=user.company_id,
                            filename=filename,
                            file_path=file_path,
                            file_type=file.content_type,
                            section=section
                        )
                        db.session.add(new_file)
                        uploaded_files.append({
                            'filename': filename,
                            'section': section,
                            'path': file_path
                        })

                    except Exception as file_error:
                        # Clean up file if it was partially saved
                        if file_path and os.path.exists(file_path):
                            os.remove(file_path)
                        db.session.rollback()
                        return jsonify({
                            'error': f'File upload failed: {str(file_error)}',
                            'file': filename
                        }), 500

        db.session.commit()
        return jsonify({
            'success': True,
            'company_id': user.company_id,
            'files_uploaded': uploaded_files,
            'section': section
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500



