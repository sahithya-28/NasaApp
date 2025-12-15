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
    const endpoint = DATASETS[activeDataset].endpoint;
    const url = `http://localhost:5000${endpoint}`;
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          setAppData([]);
          return;
        }
        // Filter out items with invalid coordinates to prevent crashes
        const formattedData = data.map(item => ({
          id: item.id,
          name: item.title,
          reclat: item.geometry?.[0]?.coordinates?.[1],
          reclong: item.geometry?.[0]?.coordinates?.[0],
          category: item.categories?.[0]?.title,
          date: item.geometry?.[0]?.date,
        })).filter(item => item.reclat != null && item.reclong != null);
        
        setAppData(formattedData);
      })
      .catch(error => {
        console.error(`Error fetching ${activeDataset}:`, error);
        setFetchError(`Failed to load ${DATASETS[activeDataset].name}. Please try again.`);
        setAppData([]);
      })
      .finally(() => {
        setIsDataLoading(false); // Hide loading indicator
      });
  }, [activeDataset]);

  const handleLocationClick = async ({ lat, lng }) => {
    setIsWeatherLoading(true);
    setClickedInfo(null);
    try {
      const weatherUrl = `http://localhost:5000/api/weather?lat=${lat}&lon=${lng}`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      setClickedInfo({ lat, lng, weather: weatherData.current_weather });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
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

      {(isWeatherLoading || clickedInfo) && (
        <div className="location-info-box">
          {isWeatherLoading ? (
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
        {renderContent()}
      </main>
    </div>
  );
}

export default App;