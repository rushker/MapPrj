// src/App.jsx
// src/App.jsx (đã sửa)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostMapPage from './pages/PostMapPage';
import ViewMapPage from './pages/ViewMapPage';
import ManagerPage from './pages/ManagerPage'; // Thêm import này

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/projects" element={<ManagerPage />} />
        <Route path="/projects/:projectId/areas/:areaId/edit" element={<PostMapPage />} />
        <Route path="/projects/:projectId/areas/:areaId/view" element={<ViewMapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
