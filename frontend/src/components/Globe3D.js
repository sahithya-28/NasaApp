import React, { useRef, useState, useEffect } from 'react';
import Globe from 'react-globe.gl';
import axios from 'axios';

// --- Search Bar Component (No changes) ---
const GlobeSearchControl = ({ onLocationFound }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        onLocationFound({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert('Location not found.');
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
      alert('Error finding location.');
    }
  };

  return (
    <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 1px 5px rgba(0,0,0,0.65)' }}>
        <input
          type="text"
          placeholder="Search location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ border: 'none', padding: '8px 12px', outline: 'none', fontSize: '14px', borderRadius: '4px 0 0 4px' }}
        />
        <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '0 4px 4px 0' }}>
          Search
        </button>
      </form>
    </div>
  );
};

// --- InfoPopup Component (No changes) ---
const InfoPopup = ({ data, onClose }) => {
  if (!data) return null;
  return (
    <div style={{ position: 'absolute', top: '80px', right: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', fontSize: '14px', zIndex: 20, maxWidth: '300px' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', lineHeight: '1' }}>&times;</button>
      {data.isLoading ? (<p>Loading weather data...</p>) : (
        <>
          <h4 style={{ color: 'black', margin: '0 0 10px 0' }}>{data.location || 'Current Weather'}</h4>
          {data.error ? (<p>Could not retrieve weather data.</p>) : (
            <>
              <p style={{ color: 'black' }}>🌡 Temp: <strong>{data.temperature}°C</strong></p>
              <p style={{ color: 'black' }}>💨 Wind: <strong>{data.windspeed} km/h</strong></p>
            </>
          )}
        </>
      )}
    </div>
  );
};

// --- Legend Component (No changes) ---
const Legend = () => {
  const legendItems = [
    { color: "orangered", label: "Meteorite" },
    { color: "gold", label: "Wildfire" },
    { color: "red", label: "Volcano" },
    { color: "dodgerblue", label: "Severe Storm" },
  ];
  return (
    <div style={{ position: 'absolute', bottom: '20px', left: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '10px', color:"black",borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.3)', fontSize: '14px', zIndex: 10 }}>
      <h4 style={{ margin: '0 0 5px 0' }}>Legend</h4>
      {legendItems.map(item => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ backgroundColor: item.color, width: '18px', height: '18px', borderRadius: '50%', marginRight: '8px', border: '1px solid #ccc' }}></span>
          {item.label}
        </div>
      ))}
    </div>
  );
};

// --- Color Function (No changes) ---
const getPointColor = (d) => {
  const pointType = d.category || d.type;
  switch (pointType) {
    case "meteor": return "orangered";
    case "Wildfires": return "gold";
    case "Volcanoes": return "red";
    case "Severe Storms": return "dodgerblue";
    default: return "lightgrey";
  }
};

// --- Main Globe3D Component ---
export default function Globe3D({ data, selectedEvent, setSelectedEvent }) {
  const globeRef = useRef();
  const [weatherPopup, setWeatherPopup] = useState(null);
  const [searchPointer, setSearchPointer] = useState(null);
  // --- NEW STATE for the arcs layer ---
  const [arcsData, setArcsData] = useState([]);

  // Your current location (Hyderabad)
  const myLocation = { lat: 17.3850, lng: 78.4867 };

  const zoomToLocation = (lat, lng) => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat, lng, altitude: 0.5 }, 1500);
    }
  };

  const handleSearch = ({ lat, lng }) => {
    setSearchPointer({ lat, lng });
    zoomToLocation(lat, lng);
    setTimeout(() => { setSearchPointer(null); }, 4000);
  };

  const handleGlobeClick = ({ lat, lng }) => {
    zoomToLocation(lat, lng);
    setSearchPointer(null);
    setArcsData([]); // Clear arcs when clicking on an empty space
    
    setWeatherPopup({ isLoading: true });
    Promise.all([
      axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`),
      axios.get(`http://localhost:5000/api/weather?lat=${lat}&lon=${lng}`)
    ])
    .then(([locationRes, weatherRes]) => {
      const locationName = locationRes.data.display_name || 'Unknown Location';
      const weatherData = weatherRes.data.current_weather;
      setWeatherPopup({
        isLoading: false,
        location: locationName,
        temperature: weatherData.temperature,
        windspeed: weatherData.windspeed,
      });
    })
    .catch(error => {
      console.error("Error fetching data on click:", error);
      setWeatherPopup({ isLoading: false, error: true });
    });
  };

  const handlePointClick = (point) => {
    // --- NEW: Create an arc from your location to the clicked point ---
    setArcsData([{
        startLat: myLocation.lat,
        startLng: myLocation.lng,
        endLat: point.reclat,
        endLng: point.reclong,
        color: getPointColor(point)
    }]);

    if (setSelectedEvent) {
      setSelectedEvent(point);
    } else {
      zoomToLocation(point.reclat, point.reclong);
    }
  };
  
  useEffect(() => {
    if (selectedEvent) {
      zoomToLocation(selectedEvent.reclat, selectedEvent.reclong);
      setSearchPointer(null);
    }
  }, [selectedEvent]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // --- NEW: ARCS LAYER ---
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.1}
        arcDashAnimateTime={1500}
        
        // Disaster/event data
        pointsData={data}
        pointLat="reclat"
        pointLng="reclong"
        pointColor={getPointColor}
        pointAltitude={0}
        pointRadius={0.5}
        
        // Search pointer
        htmlElementsData={searchPointer ? [searchPointer] : []}
        htmlElement={d => {
          const el = document.createElement('div');
          el.innerHTML = '📍';
          el.style.color = 'yellow';
          el.style.fontSize = '2rem';
          el.style.pointerEvents = 'none';
          el.style.transform = 'translate(-50%, -100%)';
          return el;
        }}
        htmlLat="lat"
        htmlLng="lng"

        onPointClick={handlePointClick}
        onGlobeClick={handleGlobeClick}
      />

      <GlobeSearchControl onLocationFound={handleSearch} />
      {weatherPopup && <InfoPopup data={weatherPopup} onClose={() => setWeatherPopup(null)} />}
      <Legend />
    </div>
  );
}