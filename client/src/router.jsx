// src/router.jsx
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import MapViewer      from './pages/MapViewer';
import BasemapPage    from './pages/BasemapPage';
import EditMapPage    from './pages/EditMapPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage   from './pages/NotFoundPage';

function RouteErrorBoundary({ error }) {
  console.error(error);
  return (
    <div className="p-6 text-red-600">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <pre className="mt-4">{error.message}</pre>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Viewer Routes */}
        <Route
          path="/map/:id"
          element={<MapViewer />}
          errorElement={<RouteErrorBoundary />}
        />

        {/* Private/Admin Routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route
            path="/basemap"
            element={<BasemapPage />}
            errorElement={<RouteErrorBoundary />}
          />
          <Route
            path="/edit/:id"
            element={<EditMapPage />}
            errorElement={<RouteErrorBoundary />}
          />
          <Route
            path="/admin"
            element={<AdminDashboard />}
            errorElement={<RouteErrorBoundary />}
          />
        </Route>

        {/* Root: redirect to public viewer or admin as needed */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
