import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignUp from './components/LoginSignup/Signup/Signup'
import {Routes,Route,BrowserRouter as Router} from 'react-router-dom'
import Login from './components/LoginSignup/Login/Login'
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<SignUp/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<SignUp/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
