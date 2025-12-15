import React, { useState, useEffect } from 'react';
import Table1D from './components/Table1D';
import Map2D from './components/Map2D';
import Globe3D from './components/Globe3D';
import './App.css';
import 'leaflet/dist/leaflet.css';

const DATASETS = {
  all: { name: 'All Events', endpoint: '/api/events/all' },
  wildfires: { name: 'Wildfires', endpoint: '/api/events/wildfires' },
  volcanoes: { name: 'Volcanoes', endpoint: '/api/events/volcanoes' },
  severeStorms: { name: 'Severe Storms', endpoint: '/api/events/severeStorms' },
};

function App() {
  const [appData, setAppData] = useState([]);
<<<<<<< HEAD
  const [viewMode, setViewMode] = useState('2D');
  const [activeDataset, setActiveDataset] = useState('all');
  const [clickedInfo, setClickedInfo] = useState(null); // State for weather/location
  const [isLoading, setIsLoading] = useState(false);   // State for loading indicator

  useEffect(() => {
=======
  const [viewMode, setViewMode] = useState('2D'); // Default to Map view
  const [activeDataset, setActiveDataset] = useState('all');
  const [clickedInfo, setClickedInfo] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true); // For loading datasets
  const [isWeatherLoading, setIsWeatherLoading] = useState(false); // For loading weather
  const [fetchError, setFetchError] = useState(null); // For API errors
  const [selectedEvent, setSelectedEvent] = useState(null); // For syncing views

  useEffect(() => {
    setIsDataLoading(true); // Show loading indicator when dataset changes
    setFetchError(null); // Clear previous errors
>>>>>>> efe0b2c (web design)
    const endpoint = DATASETS[activeDataset].endpoint;
    const url = `http://localhost:5000${endpoint}`;
    
    fetch(url)
<<<<<<< HEAD
      .then(response => response.json())
=======
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
>>>>>>> efe0b2c (web design)
      .then(data => {
        if (!Array.isArray(data)) {
          setAppData([]);
          return;
        }
<<<<<<< HEAD
=======
        // Filter out items with invalid coordinates to prevent crashes
>>>>>>> efe0b2c (web design)
        const formattedData = data.map(item => ({
          id: item.id,
          name: item.title,
          reclat: item.geometry?.[0]?.coordinates?.[1],
          reclong: item.geometry?.[0]?.coordinates?.[0],
          category: item.categories?.[0]?.title,
          date: item.geometry?.[0]?.date,
<<<<<<< HEAD
        }));
=======
        })).filter(item => item.reclat != null && item.reclong != null);
        
>>>>>>> efe0b2c (web design)
        setAppData(formattedData);
      })
      .catch(error => {
        console.error(`Error fetching ${activeDataset}:`, error);
<<<<<<< HEAD
        setAppData([]);
      });
  }, [activeDataset]);

  // Function to handle clicks on the map or globe
  const handleLocationClick = async ({ lat, lng }) => {
    setIsLoading(true);
=======
        setFetchError(`Failed to load ${DATASETS[activeDataset].name}. Please try again.`);
        setAppData([]);
      })
      .finally(() => {
        setIsDataLoading(false); // Hide loading indicator
      });
  }, [activeDataset]);

  const handleLocationClick = async ({ lat, lng }) => {
    setIsWeatherLoading(true);
>>>>>>> efe0b2c (web design)
    setClickedInfo(null);
    try {
      const weatherUrl = `http://localhost:5000/api/weather?lat=${lat}&lon=${lng}`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      setClickedInfo({ lat, lng, weather: weatherData.current_weather });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
<<<<<<< HEAD
      setIsLoading(false);
=======
      setIsWeatherLoading(false);
    }
  };

  const renderContent = () => {
    if (isDataLoading) return <div className="loading-indicator">Loading {DATASETS[activeDataset].name}...</div>;
    if (fetchError) return <div className="error-message">{fetchError}</div>;

    const commonProps = {
        data: appData,
        selectedEvent,
        setSelectedEvent
    };

    switch(viewMode) {
        case '1D': return <Table1D {...commonProps} />;
        case '2D': return <Map2D {...commonProps} onMapClick={handleLocationClick} />;
        case '3D': return <Globe3D {...commonProps} onGlobeClick={handleLocationClick} />;
        default: return null;
>>>>>>> efe0b2c (web design)
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>NASA Data Visualization</h1>
        <div className="controls-container">
          <div className="view-selector">
            {Object.keys(DATASETS).map(key => (
              <button key={key} onClick={() => setActiveDataset(key)} className={activeDataset === key ? 'active' : ''}>
                {DATASETS[key].name}
              </button>
            ))}
          </div>
          <div className="view-selector">
            <button onClick={() => setViewMode('1D')} className={viewMode === '1D' ? 'active' : ''}>1D Table</button>
            <button onClick={() => setViewMode('2D')} className={viewMode === '2D' ? 'active' : ''}>2D Map</button>
            <button onClick={() => setViewMode('3D')} className={viewMode === '3D' ? 'active' : ''}>3D Globe</button>
          </div>
        </div>
      </header>

<<<<<<< HEAD
      {/* Info Box for Weather */}
      {(isLoading || clickedInfo) && (
        <div className="location-info-box">
          {isLoading ? (
=======
      {(isWeatherLoading || clickedInfo) && (
        <div className="location-info-box">
          {isWeatherLoading ? (
>>>>>>> efe0b2c (web design)
            <p>Loading weather...</p>
          ) : (
            clickedInfo && (
              <>
                <button className="close-button" onClick={() => setClickedInfo(null)}>×</button>
                <h3>Weather Conditions</h3>
                <p>Lat: {clickedInfo.lat.toFixed(4)}, Lng: {clickedInfo.lng.toFixed(4)}</p>
                {clickedInfo.weather ? (
                  <div>
                    <p>Temperature: {clickedInfo.weather.temperature}°C</p>
                    <p>Wind Speed: {clickedInfo.weather.windspeed} km/h</p>
                  </div>
                ) : (
                  <p>Could not retrieve weather data.</p>
                )}
              </>
            )
          )}
        </div>
      )}

      <main>
<<<<<<< HEAD
        {viewMode === '1D' && <Table1D data={appData} />}
        {viewMode === '2D' && <Map2D data={appData} onMapClick={handleLocationClick} />}
        {viewMode === '3D' && <Globe3D data={appData} onGlobeClick={handleLocationClick} />}
=======
        {renderContent()}
>>>>>>> efe0b2c (web design)
      </main>
    </div>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> efe0b2c (web design)
