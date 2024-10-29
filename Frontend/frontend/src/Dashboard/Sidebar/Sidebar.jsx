
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-6 shadow-lg z-50 transition duration-300 ease-in-out">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="space-y-4">
        <Link to="/" className="block py-3 px-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300 ease-in-out">
          Home
        </Link>
        <Link to="/features" className="block py-3 px-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300 ease-in-out">
          Features
        </Link>
        <Link to="/reviews" className="block py-3 px-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300 ease-in-out">
          Reviews
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
