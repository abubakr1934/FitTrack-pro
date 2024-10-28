import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './landingPage/authenticationPages/Login';
import Signup from './landingPage/authenticationPages/Signup';
import Sample from './Dashboard/Sample';
import Collection from './landingPage/pageComponents/Collection';
import Footer from './landingPage/pageComponents/Footer';
import HeroSection from './landingPage/pageComponents/HeroSection';
import Navbar from './landingPage/pageComponents/Navbar';
import Reviews from './landingPage/pageComponents/Reviews';

function App() {
  return (
    <Router>  
      <Routes>
        <Route path="/" element={<Collection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" exact element={<Sample/>}/>
      </Routes>
    </Router>
  );
}

export default App;