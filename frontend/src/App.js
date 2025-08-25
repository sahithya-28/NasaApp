import React, { useState, useEffect } from 'react';
import Table1D from './components/Table1D';
import Map2D from './components/Map2D';
import Globe3D from './components/Globe3D';
import './App.css';
import 'leaflet/dist/leaflet.css';

function App() {
  const [liveData, setLiveData] = useState([]);
  const [viewMode, setViewMode] = useState('2D');

  useEffect(() => {
    const fetchData = () => {
      console.log("Fetching latest live events...");
      fetch('http://localhost:5000/api/live-events')
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            const formattedData = data.map(event => ({
              id: event.id,
              name: event.title,
              reclat: event.geometry[0].coordinates[1],
              reclong: event.geometry[0].coordinates[0],
              category: event.categories[0].title,
              date: event.geometry[0].date,
            }));
            setLiveData(formattedData);
          }
        })
        .catch(error => console.error("Error fetching live data:", error));
    };

    fetchData(); 

    const intervalId = setInterval(fetchData, 300000); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <header>
        <h1>NASA Data Explorer</h1>
        <label>Select Dataset: </label>
        <select>
          <option>Live Natural Events</option>
        </select>
      </header>

      <div className="view-selector">
        <button onClick={() => setViewMode('1D')} className={viewMode === '1D' ? 'active' : ''}>
          1D Table
        </button>
        <button onClick={() => setViewMode('2D')} className={viewMode === '2D' ? 'active' : ''}>
          2D Map
        </button>
        <button onClick={() => setViewMode('3D')} className={viewMode === '3D' ? 'active' : ''}>
          3D Globe
        </button>
      </div>

      <main>
        {viewMode === '1D' && <Table1D data={liveData} />}
        {viewMode === '2D' && <Map2D data={liveData} />}
        {viewMode === '3D' && <Globe3D data={liveData} />}
      </main>
    </div>
  );
}

export default App;