import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

function EconomicData() {
  // Cameroon's coordinates
  const MAP_CENTER = [5.96, 12.35];
  const MAP_ZOOM = 6;

  // State management
  const [regions, setRegions] = useState([]);
  const [geoJson, setGeoJson] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Load GeoJSON data (replace with your actual file)
  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        const response = await fetch('/data/cameroon-regions.geojson');
        const data = await response.json();
        setGeoJson(data);
      } catch (err) {
        console.error('Error loading GeoJSON:', err);
        setError('Failed to load map regions');
      }
    };
    loadGeoJson();
  }, []);

  // Fetch economic data with exponential backoff
  const fetchEconomicData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(' ', {
        timeout: 10000
      });

      if (response.data && Array.isArray(response.data)) {
        setRegions(response.data);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
        setRetryCount(0); // Reset retry counter on success
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Data fetch error:', err);

      // Exponential backoff for retries
      const nextRetry = Math.min(30, Math.pow(2, retryCount)) * 1000;
      setError(`Failed to load data. Retrying in ${nextRetry/1000} seconds...`);

      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        fetchEconomicData();
      }, nextRetry);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchEconomicData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchEconomicData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Style regions based on GDP
  const getRegionStyle = (feature) => {
    const region = regions.find(r => r.id === feature.properties.region_id);
    if (!region) return { fillColor: '#ccc' };

    // Extract numeric GDP value
    const gdpValue = parseFloat(region.gdp.replace(/[^\d.]/g, '')) || 0;

    // Color gradient based on GDP
    const color = gdpValue > 15 ? '#006837' :  // Dark green - high GDP
                 gdpValue > 10 ? '#31a354' :  // Green
                 gdpValue > 5  ? '#78c679' :  // Light green
                 gdpValue > 2  ? '#c2e699' :  // Pale green
                 '#ffffcc';                   // Yellow - low GDP

    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  // Highlight region on hover
  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 3,
      color: '#ff0000',
      fillOpacity: 0.9
    });

    const regionId = layer.feature.properties.region_id;
    const region = regions.find(r => r.id === regionId);
    if (region) setActiveRegion(region);
  };

  // Reset style on mouseout
  const resetHighlight = (e) => {
    e.target.setStyle(getRegionStyle(e.target.feature));
    setActiveRegion(null);
  };

  // Add event listeners to each feature
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight
    });
  };

  if (!geoJson) return <div className="loading">Loading map regions...</div>;

  return (
    <div className="app-container">
      <header>
        <h1>Cameroon Regional Economic Dashboard</h1>
        <div className="controls">
          <button onClick={fetchEconomicData} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <span className="update-time">
            Last updated: {lastUpdated || 'Never'}
          </span>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="map-container">
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          style={{ height: '75vh', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <GeoJSON
            data={geoJson}
            style={getRegionStyle}
            onEachFeature={onEachFeature}
          />

          {activeRegion && (
            <Tooltip direction="top" className="custom-tooltip" permanent>
              <div>
                <h3>{activeRegion.name}</h3>
                <p><strong>GDP:</strong> {activeRegion.gdp}</p>
                <p><strong>Growth Rate:</strong> {activeRegion.growth}</p>
                <p><strong>Last Updated:</strong> {new Date(activeRegion.last_updated).toLocaleString()}</p>
              </div>
            </Tooltip>
          )}
        </MapContainer>
      </div>

      <div className="data-table">
        <h3>Regional Economic Data</h3>
        <table>
          <thead>
            <tr>
              <th>Region</th>
              <th>GDP</th>
              <th>Growth</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {regions.map(region => (
              <tr key={region.id}
                  className={activeRegion?.id === region.id ? 'highlighted' : ''}
                  onMouseEnter={() => setActiveRegion(region)}
                  onMouseLeave={() => setActiveRegion(null)}>
                <td>{region.name}</td>
                <td>{region.gdp}</td>
                <td>{region.growth}</td>
                <td>{new Date(region.last_updated).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EconomicData;