// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ManagerPage from './pages/ManagerPage';
import PostMapPage from './pages/PostMapPage';
import ViewMapPage from './pages/ViewMapPage';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<ManagerPage />} />
        <Route path="/areas/edit" element={<PostMapPage />} />
        <Route path="/areas/:areaId/edit" element={<PostMapPage />} />
        <Route path="/areas/:areaId/view" element={<ViewMapPage />} />
        {/* Optional: fallback route for 404 */}
        <Route path="*" element={<div className="p-6 text-red-600">404 - Không tìm thấy trang</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

