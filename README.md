NASA Data Visualization - Earth & Space Explorer

This web application allows users to explore Earth from orbit and visualize scientific data about our planet and beyond. It provides an interactive way to view live natural events (like wildfires, volcanoes, and severe storms) and meteorite landings using data from NASA's Open Data Portal.

🚀 Features

Dynamic Data Selection: Switch between different datasets:

Meteorites: View recorded meteorite landings.

Wildfires: Live tracking of active wildfires globally.

Volcanoes: Monitoring of active volcanic eruptions.

Severe Storms: Tracking of hurricanes, typhoons, and other severe weather.

Multiple Viewing Modes:

1D Table: A sortable and scrollable list view of the raw data.

2D Map: An interactive world map with clustering and custom markers.

3D Globe: An immersive, rotating 3D globe visualization.

Live Weather Integration: Click on any location on the 2D Map or 3D Globe to retrieve real-time weather conditions (temperature, wind speed, humidity) for that specific spot.

Interactive Elements:

Custom icons for different disaster types.

Popups with detailed information on hover/click.

"Nearby Events" feature to find other natural events close to a selected location.

🛠️ Technologies Used

Frontend (Client-Side)

React: The core library for building the user interface.

Leaflet & React-Leaflet: For the interactive 2D map visualization.

React-Globe.GL: For the high-performance 3D globe visualization (based on Three.js).

React-Window: For efficiently rendering large lists (virtualization) in the table view.

Styled-Components: For modular and component-level CSS styling (optionally used).

CSS3: For general layout and attractive, dark-themed styling.

Backend (Server-Side)

Python: The programming language used for the backend logic.

Flask: A lightweight web framework to serve the API endpoints.

Flask-CORS: To handle Cross-Origin Resource Sharing, allowing the frontend to communicate with the backend.

Requests: For making HTTP requests to external APIs (NASA, Open-Meteo).

Pandas: For data manipulation and processing (initially used for CSV handling).

APIs & Data Sources

NASA EONET (Earth Observatory Natural Event Tracker): Provides live data on natural events.

NASA Open Data Portal (Socrata API): Source for the Meteorite Landings dataset.

Open-Meteo API: Provides free, non-commercial weather data without an API key.

NASA APOD API: (Optional) For fetching the Astronomy Picture of the Day.

📂 Project Structure

nasa-1d2d3d-go/
├── backend/                # Flask Backend
│   ├── __pycache__/        # Compiled Python files
│   ├── datasets/           # Local datasets directory
│   │   └── Meteorite_Landings.csv
│   ├── venv/               # Python virtual environment
│   ├── app.py              # Main application file with API routes
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── DatasetSelector.js
│   │   │   ├── Globe3D.js
│   │   │   ├── Legend.css
│   │   │   ├── Legend.js
│   │   │   ├── Map2D.css
│   │   │   ├── Map2D.js
│   │   │   ├── Table1D.css
│   │   │   └── Table1D.js
│   │   ├── services/       # Service layer
│   │   ├── App.css         # Global styles and theming
│   │   ├── App.js          # Main component managing state and layout
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js        # Entry point
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   └── package.json        # Node.js configuration
└── README.md               # Project documentation


⚙️ Setup & Installation

Prerequisites

Node.js and npm (for the frontend)

Python 3 (for the backend)

1. Backend Setup

Navigate to the backend directory:

cd backend



Install the required Python packages:

pip install flask flask-cors requests pandas



Start the Flask server:

python app.py



The backend will run on http://localhost:5000

2. Frontend Setup

Open a new terminal and navigate to the frontend directory:

cd frontend



Install the required Node packages:

npm install



Start the React development server:

npm start



The application will open in your browser at http://localhost:3000

🌟 How to Use

Select a Dataset: Use the top row of buttons to choose what you want to see (e.g., "Wildfires").

Choose a View: Use the second row of buttons to switch between Table, 2D Map, or 3D Globe views.

Explore Data:

Table: Scroll through the list.

2D Map: Zoom in to see individual markers. Click on a marker to see the event name. Click anywhere else on the map to see the current weather at that spot.

3D Globe: Rotate the earth. Click on a point to see weather
