
import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'exercise-form', label: 'Add/Edit Exercise' },
    { id: 'exercise-data', label: 'Exercise Data' },
    { id: 'food-form', label: 'Add/Edit Food Item' },
    { id: 'food-data', label: 'Food Data' },
    { id: 'diet-plan', label: 'Custom Diet Plan' },
    {id:'edit-goals',label:'Edit Goals'}
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-6 shadow-lg min-h-screen fixed left-0 top-16">
      <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
      <div className="space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full text-left py-3 px-4 rounded-lg transition-colors duration-300 ease-in-out ${
              activePage === item.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
};
export default Sidebar;