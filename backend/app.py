from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# --- Live Natural Events Endpoint ---
@app.route("/api/events/<category>")
def get_live_events(category):
    try:
        if category == 'all':
            url = "https://eonet.gsfc.nasa.gov/api/v3/events?status=open"
        else:
            url = f"https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category={category}"
            
        response = requests.get(url)
        response.raise_for_status()
        events = response.json()['events']
        return jsonify(events)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

# --- Astronomy Picture of the Day (APOD) API Endpoint ---
@app.route("/api/apod")
def get_apod():
    try:
        api_key = "Q05A3Ni3ecYNMAfVELRIXOodlhvOT4VfLT8xzsW7"
        apod_api_url = "https://api.nasa.gov/planetary/apod"
        full_url = f"{apod_api_url}?api_key={api_key}"
        
        response = requests.get(full_url)
        response.raise_for_status()
        
        return response.json()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

# --- Weather Data Endpoint ---
@app.route("/api/weather")
def get_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    try:
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        response = requests.get(weather_url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

# --- Root Endpoint ---
@app.route("/")
def home():
<<<<<<< HEAD
    return "Backend server is running!!"
=======
    return "Backend server is running!"
>>>>>>> efe0b2c (web design)

if __name__ == "__main__":
    app.run(debug=True)