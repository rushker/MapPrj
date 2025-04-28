// src/App.js
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadModal from './components/UploadModal';
import HomePage from './pages/HomePage';


function App() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [mapImageUrl, setMapImageUrl] = useState('');

  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-50">
        <Navbar onUploadClick={() => setIsUploadModalOpen(true)} />
        
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<HomePage mapImageUrl={mapImageUrl} />} />
          
          </Routes>
        </main>

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={(url) => setMapImageUrl(url)}
        />
      </div>
    </Router>
  );
}

export default App;