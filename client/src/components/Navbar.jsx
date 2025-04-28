// src/components/Navbar.jsx
import { FiMenu, FiMap, FiUpload } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = ({ onUploadClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <FiMap className="h-6 w-6 text-primary-500" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              MapPrj
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onUploadClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none"
            >
              <FiUpload className="mr-2" />
              Upload Map
            </button>
          </div>

          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => {
                onUploadClick();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
            >
              <FiUpload className="mr-2" />
              Upload Map
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;