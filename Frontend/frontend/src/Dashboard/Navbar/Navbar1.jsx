import React from 'react';

import Logo from '../Logo/Logo';

export const Navbar1 = () => {
  return (
    <nav className="p-4 bg-transparent shadow-md">
      <div className="container mx-auto flex items-center">
        {/* Logo Section */}
        <div className="flex items-center  flex-shrink-0">
          <a href="/" className="transition-transform transform hover:scale-105 duration-300 ease-in-out">
            <div className="w-20 h-10 mt-10 flex items-center justify-center">
              <Logo size={10} />
            </div>
          </a>
          <a href="/" className="text-white font-bold text-xl uppercase transition-colors duration-300 ease-in-out hover:text-gray-400">
            {/* Brand Name Here */}
          </a>
        </div>
        
        {/* Centered Navigation as */}
        <div className="flex-grow flex justify-center space-x-8">
          <a
            href="/"
            className="text-black uppercase text-base hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-300 ease-in-out"
          >
            Home
          </a>
          <a
            href="/features"
            className="text-black uppercase text-base hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-300 ease-in-out"
          >
            Features
          </a>
          <a
            href="/reviews"
            className="text-black uppercase text-base hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-300 ease-in-out"
          >
            Reviews
          </a>
        </div>

        {/* Right-aligned as */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          
          <a 
            href=""
            className="bg-white text-black uppercase text-base hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-300 ease-in-out"
          >
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar1;
