//src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import PublicMapPage from './pages/PublicMapPage';
import AdminRedirect from './components/AdminRedirect';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicMapPage />} />
      <Route path="/map" element={<PublicMapPage />} />
      <Route path="/admin" element={<AdminRedirect><AdminDashboard /></AdminRedirect>} />
      <Route path="/admin-login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
