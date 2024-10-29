
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../Logo/Logo';

export const Navbar1 = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-lg z-50 py-4 transition duration-300 ease-in-out">
      <div className="flex items-center justify-between px-6 max-w-7xl mx-auto">
        
        
        <Link to="/" className="flex items-center transition-transform transform hover:scale-105 duration-300 ease-in-out">
          <div className="w-12 h-12"> 
            <Logo size={12} />
          </div>
        </Link>

        
        <div className="flex-grow flex justify-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `text-white uppercase text-lg font-medium hover:text-blue-400 transition duration-300 ${isActive ? 'border-b-2 border-blue-400' : ''}`
            }
            aria-label="Home"
          >
            Home
          </NavLink>
          <NavLink
            to="/features"
            className={({ isActive }) => 
              `text-white uppercase text-lg font-medium hover:text-blue-400 transition duration-300 ${isActive ? 'border-b-2 border-blue-400' : ''}`
            }
            aria-label="Features"
          >
            Features
          </NavLink>
          <NavLink
            to="/reviews"
            className={({ isActive }) => 
              `text-white uppercase text-lg font-medium hover:text-blue-400 transition duration-300 ${isActive ? 'border-b-2 border-blue-400' : ''}`
            }
            aria-label="Reviews"
          >
            Reviews
          </NavLink>
        </div>

 
        <div className="flex items-center">
          <Link 
            to="/logout"
            className="bg-blue-500 text-white uppercase text-lg font-medium px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
            aria-label="Logout"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar1;
