from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

# Load dataset
df = pd.read_csv("datasets/Meteorite_Landings.csv")

# Default route (to test the server)
@app.route("/")
def home():
    return "Backend is running!"

# API route to get data
@app.route("/data")
def get_data():
    return jsonify(df.head(10).to_dict(orient="records"))  # send first 10 rows as JSON

if __name__ == "__main__":
    app.run(debug=True)
