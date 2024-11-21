
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../Logo/Logo';

export const Navbar1 = () => {
  const solve=()=>{
    localStorage.removeItem("accessToken")
    console.log("access token removed from localStorage")
  }
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 shadow-lg z-50 py-4 transition duration-300 ease-in-out">
      <div className="flex items-center justify-between px-6 mx-auto">
        
        
        <div>
        <Link to="/" className="">
          <div className="w-12 h-12"> 
            <Logo />
          </div>
        </Link>

        </div>
        
        <div className="flex-grow flex justify-center ">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `text-white uppercase text-lg font-medium hover:text-blue-400 transition duration-300 ${isActive ? 'border-b-2 border-blue-400' : ''}`
            }
            aria-label="Home"
          >
            Home
          </NavLink>
          
        </div>

 
        <div className="flex items-center">
          <Link 
            to="/"
            className="bg-blue-500 text-white uppercase text-lg font-medium px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
            aria-label="Logout"
            onClick={solve}
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar1;
