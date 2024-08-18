import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';

export const Navbar = () => {
  return (
    <nav className="p-4 bg-transparent shadow-md">
      <div className="container mx-auto flex items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <Link to="/" className="transition-transform transform hover:scale-105 duration-300 ease-in-out">
            <div className="w-20 h-20 flex items-center justify-center">
              <Logo />
            </div>
          </Link>
          <Link to="/" className="text-white font-bold text-xl uppercase transition-colors duration-300 ease-in-out hover:text-gray-400">
            {/* Brand Name Here */}
          </Link>
        </div>
        
        {/* Centered Navigation Links */}
        <div className="flex-grow flex justify-center space-x-8">
          <Link
            to="/"
            className="text-black uppercase text-base hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-300 ease-in-out"
          >
            Home
          </Link>
          <Link
            to="/features"
            className="text-black uppercase text-base hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-300 ease-in-out"
          >
            Features
          </Link>
          <Link
            to="/reviews"
            className="text-black uppercase text-base hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-300 ease-in-out"
          >
            Reviews
          </Link>
        </div>

        {/* Right-aligned Links */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <Link 
            to="/login"
            className="bg-black text-white uppercase text-base hover:bg-gray-700 px-4 py-2 rounded-md font-medium transition-colors duration-300 ease-in-out"
          >
            Login
          </Link>
          <Link 
            to="/signup"
            className="bg-white text-black uppercase text-base hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-300 ease-in-out"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
