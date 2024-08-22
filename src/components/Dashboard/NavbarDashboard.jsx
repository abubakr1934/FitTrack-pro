import React, { useState } from "react";
import { FaSignOutAlt, FaCalculator, FaRunning } from "react-icons/fa";
import { MdOutlinePersonalInjury } from "react-icons/md";
import { IoFastFoodSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom"; 
import { FaHandsHelping } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";

const NavbarDashboard = ({ setActiveSection }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("Dashboard");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleButtonClick = (section) => () => {
    setActiveButton(section);
    setActiveSection(section);
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="separator-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <button
                className={`flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeButton === "Dashboard" ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
                onClick={handleButtonClick("Dashboard")}
              >
                <MdDashboard className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400" />
                <span className="ms-3">Dashboard</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeButton === "Calories" ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
                onClick={handleButtonClick("Calories")}
              >
                <IoFastFoodSharp className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400" />
                <span className="ms-3">Calories</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeButton === "Exercises" ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
                onClick={handleButtonClick("Exercises")}
              >
                <FaRunning className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400" />
                <span className="ms-3">Exercises</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeButton === "Body Fat Calculator" ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
                onClick={handleButtonClick("Body Fat Calculator")}
              >
                <FaCalculator className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400" />
                <span className="ms-3">Body Fat Calculator</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeButton === "Personalised Diet Plan" ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
                onClick={handleButtonClick("Personalised Diet Plan")}
              >
                <MdOutlinePersonalInjury className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400" />
                <span className="ms-3">Personalised Diet Plan</span>
              </button>
            </li>
          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
              <button
                className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white ${
                  activeButton === "Profile" ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
                onClick={handleButtonClick("Profile")}
              >
                <IoPersonSharp className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400" />
                <span className="ms-3">Profile</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white ${
                  activeButton === "Help" ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
                onClick={handleButtonClick("Help")}
              >
                <FaHandsHelping className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400" />
                <span className="ms-3">Help</span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white ${
                  activeButton === "Sign Out" ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
                onClick={handleButtonClick("Sign Out")}
              >
                <FaSignOutAlt className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400" />
                <span className="ms-3">Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default NavbarDashboard;
