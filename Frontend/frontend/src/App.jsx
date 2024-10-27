import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import Login from './landingPage/authenticationPages/Login'
import Signup from './landingPage/authenticationPages/Signup'
import Features from './pageComponents/features/Features'
import Collection from './pageComponents/Collection'
import Footer from './pageComponents/Footer'
import HeroSection from './pageComponents/HeroSection'
import Navbar from './pageComponents/Navbar'
import Reviews from './pageComponents/Reviews'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Navbar />
      <HeroSection />
      <Features />
      <Collection />
      <Reviews />
      <Footer />
    </div>
  )
}

export default App