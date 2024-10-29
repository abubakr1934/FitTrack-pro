import React from 'react';
import logo from '../../assets/logo.png';

const Logo = () => {
  return (
    <div className="fixed top-0 left-0 h-24 w-24 p-2 z-50">
      <img 
        src={logo} 
        alt="Logo" 
        className="object-contain rounded-full border-4 border-gray-800 shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
      />
    </div>
  );
};

export default Logo;
