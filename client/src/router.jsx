// src/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import MapViewer from './pages/MapViewer';
import AdminDashboard from './pages/AdminDashboard';
import BasemapPage from './pages/BasemapPage';
import EditMapPage from './pages/EditMapPage';

const router = createBrowserRouter([
  {
    path: '/',             // default root
    element: <MapViewer /> // Viewer page is the public landing page
  },
  {
    path: '/admin',
    element: <AdminDashboard /> // Only accessible manually
  },
  {
    path: '/basemap',
    element: <BasemapPage /> // Only accessible manually
  },
  {
    path: '/edit/:id',
    element: <EditMapPage /> // Only accessible after cutting
  },
]);

export default router;
