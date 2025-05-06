//src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import AdminDashboard from './pages/AdminDashboard';
import EditMapPage from './pages/EditMapPage';
import PublicMapPage from './pages/PublicMapPage';
import PrivateMapPage from './pages/PrivateMapPage';
import Navbar from './components/Navbar';
import SidebarInfoPanel from './components/SidebarInfoPanel';
import { getMapById } from './services/api';

function App() {
  const [mapData, setMapData] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [polygon, setPolygon] = useState(null);

  useEffect(() => {
    // Example to fetch a map (you can adjust the logic here to load based on params or any other context)
    getMapById('someMapId') // Replace with actual map ID or handle dynamic fetching
      .then((data) => {
        setMapData(data);
        setMarkers(data.markers || []);
        setPolygon(data.polygon || null);
      })
      .catch((err) => console.error('Failed to fetch map:', err));
  }, []);

  const handleDeleteMarker = (idx) => {
    setMarkers((prevMarkers) => prevMarkers.filter((_, index) => index !== idx));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex flex-1">
          <Routes>
            <Route path="/" element={<PublicMapPage />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/edit/:id" element={<EditMapPage />} />
            <Route path="/basemap" element={<PrivateMapPage />} />
          </Routes>

          <SidebarInfoPanel polygon={polygon} markers={markers} onDeleteMarker={handleDeleteMarker} />
        </div>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
