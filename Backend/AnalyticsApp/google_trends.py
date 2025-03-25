import time
from pytrends.request import TrendReq
from flask import jsonify

# Initialize pytrends with a longer timeout
pytrends = TrendReq(hl='en-US', tz=360, timeout=(10, 30))  # 10 seconds for connection, 30 seconds for reading

def fetch_google_trends(query, retries=3, delay=5):
    try:
        if not query:
            return jsonify({"error": "Query parameter is required."}), 400

        for attempt in range(retries):
            try:
                # Fetch Google Trends data
                pytrends.build_payload(kw_list=[query], timeframe='today 12-m')
                interest_over_time_df = pytrends.interest_over_time()

                # Format the data for the frontend
                trends_data = {
                    "dates": interest_over_time_df.index.strftime('%Y-%m-%d').tolist(),
                    "values": interest_over_time_df[query].tolist(),
                }

                return trends_data

            except Exception as e:
                print(f"Attempt {attempt + 1} failed: {e}")
                if attempt < retries - 1:  # Don't sleep on the last attempt
                    time.sleep(delay)  # Wait before retrying
                else:
                    raise  # Re-raise the exception if all retries fail

    except Exception as e:
        print(f"Error fetching Google Trends: {e}")
        return {"error": "Failed to fetch Google Trends data."}