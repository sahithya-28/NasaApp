import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Control from 'react-leaflet-custom-control';
import Legend from './Legend';
import './Map2D.css';

// This component will contain our weather popup logic
function WeatherPopup() {
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latLng, setLatLng] = useState(null);

  useMapEvents({
    click(e) {
      setLatLng(e.latlng);
      setIsLoading(true);
      setWeatherInfo(null); // Clear old data

      // Fetch weather data from our backend
      axios.get(`http://localhost:5000/api/weather?lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(response => {
          setWeatherInfo(response.data.current_weather);
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
          setWeatherInfo({ error: true }); // Set an error state
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  if (!latLng) {
    return null; // Don't show anything if the map hasn't been clicked
  }

  return (
    <Popup position={latLng}>
      {isLoading ? (
        <p>Loading weather...</p>
      ) : (
        weatherInfo && (
          <div>
            <h4>Current Weather</h4>
            {weatherInfo.error ? (
              <p>Could not retrieve weather data.</p>
            ) : (
              <>
                <p>Temp: {weatherInfo.temperature}°C</p>
                <p>Wind: {weatherInfo.windspeed} km/h</p>
              </>
            )}
          </div>
        )
      )}
    </Popup>
  );
}

// This small component forces the map to resize correctly
const ResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
};

// This function returns a specific SVG icon for an individual disaster
const getDisasterIcon = (category) => {
  let iconHtml = '';
  const color = '#d9534f'; // Red color for all disaster icons

  switch (category) {
    case 'Wildfires':
      iconHtml = `<svg viewBox="0 0 24 24"><path fill="${color}" d="M11.5,22.5c-3.87,0-7-3.13-7-7c0-3.44,2.45-6.3,5.7-6.87C10.2,4.8,11.5,2,13,2c1.93,0,3.5,1.57,3.5,3.5c0,1.38-0.81,2.57-1.97,3.16C17.76,9.36,20,12.42,20,16c0,3.87-3.13,7-7,7C12.55,23,12,22.78,11.5,22.5z M13,4c-0.83,0-1.5,0.67-1.5,1.5S12.17,7,13,7s1.5-0.67,1.5-1.5S13.83,4,13,4z"/></svg>`;
      break;
    case 'Volcanoes':
      iconHtml = `<svg viewBox="0 0 24 24"><path fill="${color}" d="M21,13.18H18.82L16,3.61L12,13.18H3L12,22L21,13.18M12,17.43L9.18,13.18H14.82L12,17.43Z"/></svg>`;
      break;
    case 'Severe Storms':
      iconHtml = `<svg viewBox="0 0 24 24"><path fill="${color}" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12H18A6,6 0 0,0 12,6V4M12,8A4,4 0 0,1 16,12H14A2,2 0 0,0 12,10V8M5,13V11H7V13H5M9,13V11H11V13H9M13,13V11H15V13H13M17,13V11H19V13H17Z"/></svg>`;
      break;
    default:
      iconHtml = `<div style="background-color: #808080; width: 100%; height: 100%; border-radius: 50%;"></div>`;
  }

  return L.divIcon({
    className: 'disaster-icon',
    html: iconHtml,
    iconSize: [24, 24],
  });
};

// This function creates the solid-colored cluster circles
const createClusterCustomIcon = function (cluster) {
  const count = cluster.getChildCount();
  let size = 20;
  let clusterColor = '#92d400'; // Green

  if (count >= 10) {
    clusterColor = '#f5d423'; // Yellow
    size = 20;
  }
  if (count >= 100) {
    clusterColor = '#f0962d'; // Orange
    size = 20;
  }

  return L.divIcon({
    html: `<div style="background-color: ${clusterColor}; width: 100%; height: 100%; border-radius: 50%; border: 2px solid rgba(0,0,0,0.5);"></div>`,
    className: 'custom-marker-cluster-solid',
    iconSize: L.point(size, size, true),
  });
};

function Map2D({ data }) {
  const position = [20, 0];

  return (
    <MapContainer center={position} zoom={2} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
        {data.map(item => {
          if (!item || !item.reclat || !item.reclong) {
            return null;
          }

          return (
            <Marker
              key={item.id}
              position={[item.reclat, item.reclong]}
              icon={getDisasterIcon(item.category)}
            >
              <Popup>
                <b>{item.name}</b>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      <Control position='bottomright'>
        <Legend />
      </Control>
      
      <WeatherPopup />
      <ResizeHandler />
    </MapContainer>
  );
}

export default Map2D;
