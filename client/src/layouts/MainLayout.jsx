// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SidebarInfoPanel from '../components/SidebarInfoPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top navigation bar */}
      <Navbar />

      {/* Main content + sidebar */}
      <div className="flex flex-1">
        {/* Render the current page */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* Sidebar for polygon & marker details */}
        <aside className="w-72 bg-white shadow-lg p-4 overflow-y-auto border-l border-gray-200">
          <SidebarInfoPanel />
        </aside>
      </div>

      {/* Global toast messages */}
      <ToastContainer position="bottom-right" />
    </div>
  );
}
