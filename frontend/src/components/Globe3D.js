import React from 'react';
import axios from 'axios';
import Globe from 'react-globe.gl';
import '../App.css';

function App() {
  const [meteoriteData, setMeteoriteData] = React.useState([]);
  const [clickedLocation, setClickedLocation] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showRiskInfo, setShowRiskInfo] = React.useState(false);
  const globeEl = React.useRef();

  React.useEffect(() => {
    // Fetch meteorite data from the backend API
    axios.get('http://localhost:5000/api/meteorites')
      .then(response => {
        const processedData = response.data.map(m => ({
          lat: m.reclat,
          lng: m.reclong,
          // Use Math.max to prevent errors from very small or negative masses
          size: Math.max(0.1, Math.log(m['mass (g)']) / 10),
          color: 'orange',
          name: m.name,
          mass: m['mass (g)'],
          // Ensure year is valid before creating a Date object
          year: m.year ? new Date(m.year).getFullYear() : 'Unknown',
        }));
        setMeteoriteData(processedData);
      })
      .catch(error => {
        console.error("There was an error fetching the meteorite data:", error);
      });
  }, []);

  React.useEffect(() => {
    // Auto-rotate the globe
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.2;
    }
  }, []);

  // Function to handle clicking on the globe
  const handleGlobeClick = async ({ lat, lng }) => {
    // Stop auto-rotation on click
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = false;
    }

    setIsLoading(true);
    setClickedLocation(null);
    setShowRiskInfo(false);

    // Fetch location data from OpenStreetMap's Nominatim API
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      setClickedLocation(response.data);
    } catch (error) {
      console.error("Error fetching location data:", error);
      setClickedLocation({ display_name: "Could not retrieve location information." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meteorite Landings on Earth</h1>
        <p>Visualizing NASA's Open Data of recorded meteorite landings. Click anywhere on the globe for location details.</p>
      </header>

      {/* Location Info Box */}
      {(isLoading || clickedLocation) && (
        <div className="location-info-box">
          {isLoading ? (
            <p>Loading location...</p>
          ) : (
            <>
              <button className="close-button" onClick={() => setClickedLocation(null)}>×</button>
              <h3>Location Information</h3>
              <p>{clickedLocation?.display_name || "No data available."}</p>
              
              <div className="risk-info">
                <p><strong>Meteorite Impact Risk:</strong> Low</p>
                <button className="learn-more-button" onClick={() => setShowRiskInfo(!showRiskInfo)}>
                  {showRiskInfo ? 'Hide Details' : 'Learn More'}
                </button>
              </div>

              {showRiskInfo && (
                <div className="risk-explanation">
                  <p>The immediate risk to any specific location is extremely low. Earth's atmosphere acts as a powerful shield, burning up most incoming objects. While a meteorite impact is technically possible anywhere, large, damaging events are incredibly rare.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="globe-container">
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          // This section ensures dots are displayed, not lines
          pointsData={meteoriteData}
          pointAltitude="size"
          pointColor="color"
          pointLabel={d => `
            <div><b>${d.name}</b></div>
            <div>Mass: ${d.mass ? d.mass.toLocaleString() : 'N/A'} g</div>
            <div>Year: ${d.year}</div>
          `}
          pointRadius={0.25}
          // Click event handler
          onGlobeClick={handleGlobeClick}
        />
      </div>

      <footer className="App-footer">
        <p>Data Source: <a href="https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh" target="_blank" rel="noopener noreferrer">NASA Open Data Portal</a></p>
      </footer>
    </div>
  );
}

export default App;
