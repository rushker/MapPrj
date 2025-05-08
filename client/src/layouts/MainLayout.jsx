// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SidebarInfoPanel from '../components/SidebarInfoPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ({ polygon, markers, onDeleteMarker }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <Outlet />
        <SidebarInfoPanel polygon={polygon} markers={markers} onDeleteMarker={onDeleteMarker} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
