from flask import request, jsonify, current_app
import random
import requests
import time
from pytrends.request import TrendReq
import pytrends
from .google_trends import fetch_google_trends
from . import app, db, bcrypt
from .models import User, Company, Inventory, UploadedFile, EmployeeData, FinancialData, CustomerFeedback, MarketingCampaign, SalesData, EmployeePerformance
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import os
import json
import yfinance as yf
from concurrent.futures import ThreadPoolExecutor
from werkzeug.utils import secure_filename
import numpy as np
from datetime import datetime, timedelta
import pandas as pd


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

INDUSTRY_STOCKS = {
    'tech': ['MSFT', 'AAPL', 'NVDA', 'GOOGL', 'META', 'TSM', 'AVGO', 'ORCL', 'ADBE', 'CSCO'],
    'retail': ['WMT', 'AMZN', 'TGT', 'COST', 'HD', 'LOW', 'BABA', 'JD', 'PDD', 'F'],
    'logistics': ['UPS', 'FDX', 'DHL', 'EXPD', 'CHRW', 'ZTO', 'KNX', 'SAIA', 'ODFL', 'XPO']
}

def get_stock_data(ticker):
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period='1d')
        if not data.empty:
            open_price = data['Open'].iloc[0]
            current_price = data['Close'].iloc[-1]
            change_pct = ((current_price - open_price) / open_price) * 100
            return {
                'symbol': ticker,
                'name': stock.info.get('shortName', ticker),
                'price': round(current_price, 2),
                'change_pct': round(change_pct, 2)
            }
    except Exception as e:
        print(f"Error fetching {ticker}: {str(e)}")
    return None

@app.route('/api/industry-rankings/<industry>', methods=['GET'])
@jwt_required()
def get_industry_rankings(industry):
    try:
        # Get tickers for the requested industry
        tickers = INDUSTRY_STOCKS.get(industry.lower(), [])
        if not tickers:
            return jsonify({"error": "Industry not supported"}), 400

        # Fetch all stock data in parallel
        with ThreadPoolExecutor(max_workers=5) as executor:
            results = list(filter(None, executor.map(get_stock_data, tickers)))

        # Sort by performance (descending)
        rankings = sorted(results, key=lambda x: x['change_pct'], reverse=True)

        return jsonify({
            "industry": industry,
            "rankings": [{
                "rank": idx + 1,
                "symbol": item['symbol'],
                "name": item['name'],
                "price": item['price'],
                "performance": item['change_pct']
            } for idx, item in enumerate(rankings)]
        })

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Failed to fetch rankings"}), 500

NEWSDATA_API_KEY = "pub_770266b4c32ba028962fc04302bd135876ca5"


@app.route('/api/market-news/<market>')
def get_market_news(market):
    try:
        query_map = {
            'tech': 'technology',
            'finance': 'finance',
            'energy': 'energy',
            'healthcare': 'healthcare',
            'retail': 'retail'
        }

        query = query_map.get(market.lower(), 'business')

        url = f"https://newsdata.io/api/1/news?apikey={NEWSDATA_API_KEY}&q={query}&language=en"

        response = requests.get(url)
        response.raise_for_status()

        articles = response.json().get('results', [])

        processed_articles = []
        for article in articles[:10]:  # limit to 10 articles
            processed_articles.append({
                'id': hash(article['link']),
                'title': article['title'],
                'source': article['source_id'],
                'date': article['pubDate'][:10],
                'type': 'news',
                'summary': article['description'] or article['content'][:200] + '...',
                'impact': 'medium',
                'url': article['link']
            })

        return jsonify(processed_articles)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def fetch_cameroon_data():
    """Fetch Cameroon-specific indicators from World Bank"""
    indicators = {
        "agriculture_growth": "NV.AGR.TOTL.KD.ZG",  # Agriculture value added (% of GDP)
        "industry_growth": "NV.IND.TOTL.KD.ZG",  # Industry growth (%)
        "services_growth": "NV.SRV.TOTL.KD.ZG",  # Services growth (%)
        "gdp_growth": "NY.GDP.MKTP.KD.ZG"  # GDP growth (%)
    }

    data = {}
    for key, indicator in indicators.items():
        url = f"https://api.worldbank.org/v2/country/CM/indicator/{indicator}?format=json&date=2022"
        response = requests.get(url).json()
        latest_value = next((item for item in response[1] if item["value"] is not None), None)
        data[key] = latest_value["value"] if latest_value else None

    return data


@app.route('/api/cameroon-opportunities')
def cameroon_opportunities():
    try:
        indicators = fetch_cameroon_data()

        # Analyze opportunities based on growth rates
        opportunities = []
        if indicators["agriculture_growth"] and indicators["agriculture_growth"] > 3:
            opportunities.append({
                "sector": "Agriculture",
                "growth": indicators["agriculture_growth"],
                "reason": "High growth in agri-value addition",
                "subsectors": ["Agro-processing", "Organic farming", "Export crops"]
            })

        if indicators["services_growth"] and indicators["services_growth"] > 5:
            opportunities.append({
                "sector": "Services",
                "growth": indicators["services_growth"],
                "reason": "Booming digital and financial services",
                "subsectors": ["FinTech", "E-commerce", "ICT Outsourcing"]
            })

        return jsonify({
            "indicators": indicators,
            "opportunities": opportunities,
            "last_updated": "2022"  # World Bank data lags by 1-2 years
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/user-uploaded-files', methods=['GET'])
@jwt_required()
def get_user_uploaded_files():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first_or_404()

        files = UploadedFile.query.filter_by(company_id=user.company_id) \
            .filter(UploadedFile.file_type.in_([
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ])) \
            .order_by(UploadedFile.upload_date.desc()) \
            .all()

        return jsonify({
            'files': [{
                'id': file.id,
                'filename': file.filename,
                'uploadDate': file.upload_date.isoformat(),
                'fileType': file.file_type
            } for file in files]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_file_path(file_id):
    """Get the actual file path from database"""
    file_record = UploadedFile.query.get(file_id)
    if not file_record:
        raise FileNotFoundError(f"File record {file_id} not found in database")
    if not os.path.exists(file_record.file_path):
        raise FileNotFoundError(f"File not found at {file_record.file_path}")
    return file_record.file_path


def downsample_data(df, max_points, time_column=None):
    """Downsample data using appropriate method"""
    if len(df) <= max_points:
        return df

    if time_column and pd.api.types.is_datetime64_any_dtype(df[time_column]):
        return downsample_time_series(df, max_points, time_column)
    return df.sample(n=max_points, random_state=42)


@app.route('/api/excel-chart-data/<int:file_id>', methods=['GET'])
@jwt_required()
def get_excel_chart_data(file_id):
    try:
        # Get the file path from database
        file_record = UploadedFile.query.get_or_404(file_id)
        if not os.path.exists(file_record.file_path):
            raise FileNotFoundError(f"File not found at {file_record.file_path}")

        # Get range parameter
        range_type = request.args.get('range', 'Monthly')

        # Read the Excel file
        try:
            df = pd.read_excel(file_record.file_path, engine='openpyxl')
        except Exception as e:
            raise ValueError(f"Failed to read Excel file: {str(e)}")

        # Process the data - handle non-numeric columns properly
        date_col = next((col for col in df.columns if 'date' in col.lower()), None)

        if date_col:
            try:
                df[date_col] = pd.to_datetime(df[date_col])

                # Apply time range aggregation with updated frequency strings
                freq_map = {
                    'Daily': 'D',
                    'Weekly': 'W-MON',
                    'Monthly': 'ME',  # Updated from 'M' to 'ME'
                    'Quarterly': 'QE'  # Updated from 'Q' to 'QE'
                }

                if range_type in freq_map:
                    # First convert all numeric columns to float, ignore errors
                    numeric_cols = df.select_dtypes(include=[np.number]).columns
                    for col in numeric_cols:
                        df[col] = pd.to_numeric(df[col], errors='coerce')

                    # Then group by date and take mean of numeric columns only
                    grouped = df.groupby(pd.Grouper(key=date_col, freq=freq_map[range_type]))
                    df = grouped[numeric_cols].mean().reset_index()

                    # Fill any NA values that might have appeared
                    df[numeric_cols] = df[numeric_cols].fillna(0)
            except Exception as e:
                raise ValueError(f"Failed to process date aggregation: {str(e)}")

        # Downsample if still too large (max 1000 points)
        if len(df) > 1000:
            df = downsample_data(df, 1000, date_col)

        # Prepare response - only include numeric columns
        labels = []
        if date_col:
            format_map = {
                'Daily': '%Y-%m-%d',
                'Weekly': '%Y W%U',
                'Monthly': '%Y-%m',
                'Quarterly': '%Y Q%q'
            }
            date_format = format_map.get(range_type, '%Y-%m-%d')
            labels = df[date_col].dt.strftime(date_format).tolist()
        else:
            labels = df.index.astype(str).tolist()

        # Only include numeric columns in datasets
        numeric_cols = [col for col in df.columns if
                        pd.api.types.is_numeric_dtype(df[col]) and (not date_col or col != date_col)]

        datasets = []
        for col in numeric_cols:
            datasets.append({
                'label': col,
                'data': df[col].fillna(0).astype(float).tolist()
            })

        if not datasets:
            raise ValueError("No numeric data columns found in the Excel file")

        return jsonify({
            'filename': file_record.filename,
            'labels': labels,
            'datasets': datasets,
            'message': 'Data processed successfully'
        })

    except FileNotFoundError as e:
        return jsonify({'error': str(e)}), 404
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Error processing file {file_id}: {str(e)}")
        return jsonify({'error': 'Internal server error processing data'}), 500


# File upload endpoint
@app.route('/api/upload-excel', methods=['POST'])
def upload_excel():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Save file
        file.save(filepath)

        # Create database record
        new_file = UploadedFile(
            filename=filename,
            file_path=filepath,
            file_type=file.content_type,
            upload_date=datetime.utcnow()
        )
        db.session.add(new_file)
        db.session.commit()

        return jsonify({
            'id': new_file.id,
            'filename': new_file.filename,
            'message': 'File uploaded successfully'
        }), 201

    return jsonify({'error': 'File type not allowed'}), 400


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in {'xlsx', 'xls'}
