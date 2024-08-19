import React from 'react'
import { Navbar } from '../Header/Navbar'
import Logo from '../Logo/Logo'
import HeroSection from '../HeroSection/HeroSection'
import { Features } from '../Features/Features'
import { Reviews } from '../Reviews/Reviews'
import {Footer} from '../Footer/Footer'
export const Home = () => {
  return (
    <>
    {/* <div><Logo /></div> */}
    <div><Navbar /></div>
    <div><HeroSection/></div>
    <div><Features/></div>
    <div><Reviews/></div>
    <div><Footer></Footer></div>
    
    </>
  )
}
