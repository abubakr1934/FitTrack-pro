import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignUp from './components/LoginSignup/Signup/Signup'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import Login from './components/LoginSignup/Login/Login'
import { Home } from './components/Home/Home'
import { Features } from './components/Features/Features'
import { Reviews } from './components/Reviews/Reviews'
import Dashboard from './components/Dashboard/Dashboard'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          {/* <Route path='/' element={<Home />} /> */}
          <Route path='/signup' element={<SignUp />} />
          <Route path='/features' element={<Features />} />
          <Route path='/reviews' element={<Reviews />} />
        </Routes>
      </Router>
      <Dashboard />
    </>
  )
}

export default App
