//src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import PublicMapPage from './pages/PublicMapPage';
import AdminRedirect from './components/AdminRedirect';

export default function App() {
  return (
    <Routes>
      {/* Redirect root to /map for clarity */}
      <Route path="/" element={<Navigate to="/map" replace />} />
      
      {/* Public map page */}
      <Route path="/map" element={<PublicMapPage />} />

      {/* Admin login and dashboard */}
      <Route path="/admin-login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminRedirect><AdminDashboard /></AdminRedirect>} />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/map" replace />} />
    </Routes>
  );
}

