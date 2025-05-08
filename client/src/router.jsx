// src/router.jsx
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import BasemapPage from './pages/BasemapPage';
import EditMapPage from './pages/EditMapPage';
import AdminDashboard from './pages/AdminDashboard';
import MapViewer from './pages/MapViewer';
import MainLayout from './layouts/MainLayout';

const createAppRouter = () =>
  createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        { path: '/', element: <Navigate to="/map/default" replace /> }, // ⬅️ redirect mặc định đến Viewer Page
        { path: '/map/:id', element: <MapViewer /> }, // ⬅️ public
        { path: '/admin', element: <AdminDashboard /> }, // ⬅️ private
        { path: '/basemap', element: <BasemapPage /> }, // ⬅️ private
        { path: '/edit/:id', element: <EditMapPage /> }, // ⬅️ private
      ],
    },
  ]);

export default createAppRouter;
