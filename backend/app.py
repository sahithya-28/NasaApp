from flask import Flask, jsonify
from flask_cors import CORS
import requests

# 1. Create the Flask app instance first
app = Flask(__name__)
CORS(app)

# --- Live Events API Endpoint ---
EONET_API_URL = "https://eonet.gsfc.nasa.gov/api/v3/events?status=open"

@app.route("/api/live-events")
def get_live_events():
    try:
        response = requests.get(EONET_API_URL)
        response.raise_for_status()
        events = response.json()['events']
        return jsonify(events)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

# --- Astronomy Picture of the Day (APOD) API Endpoint ---
@app.route("/api/apod")
def get_apod():
    try:
        # Remember to replace this with your actual key
        api_key = "api key here"
        apod_api_url = "https://api.nasa.gov/planetary/apod"
        full_url = f"{apod_api_url}?api_key={api_key}"
        
        response = requests.get(full_url)
        response.raise_for_status()
        
        return response.json()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/")
def home():
    return "Backend server is running!"

# 2. Run the app at the end of the file
if __name__ == "__main__":
    app.run(debug=True)