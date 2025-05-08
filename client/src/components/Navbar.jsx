//src/components.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-lg font-bold">MapProject</Link>
        <div className="space-x-4">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/basemap" className="hover:underline">Create Map</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
