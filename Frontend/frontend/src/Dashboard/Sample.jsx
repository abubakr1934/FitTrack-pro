import React from 'react';
import Navbar1 from './Navbar/Navbar1';
import Sidebar from './Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';

const Sample = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar1 />
      <div className="flex flex-1 overflow-hidden">
       <Sidebar></Sidebar>
        <main className='flex-1 overflow-y-auto'>
          <p>hello</p>
        </main>
      </div>
    </div>
  );
};

export default Sample;