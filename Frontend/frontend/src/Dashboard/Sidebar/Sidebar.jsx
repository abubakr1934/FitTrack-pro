import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-4">
      <div className="space-y-4">
        <Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded transition-colors duration-300 ease-in-out">
          Home
        </Link>
        <Link to="/features" className="block py-2 px-4 hover:bg-gray-700 rounded transition-colors duration-300 ease-in-out">
          Features
        </Link>
        <Link to="/reviews" className="block py-2 px-4 hover:bg-gray-700 rounded transition-colors duration-300 ease-in-out">
          Reviews
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;