import React, { useState } from 'react';
import heroImage1 from '../../assets/heroimage1.jpg'; 
import heroImage2 from '../../assets/heroimage2.jpg';
import HeroImage3 from '../../assets/HeroImage3.jpg'
import { Link } from 'react-router-dom';
import 'animate.css';

const slides = [
  {
    image:HeroImage3,
    title:"Change your food habits to the better side",
    description:"explore our personalised diet plans for your goals and fast track your nutrition and food choices"
  },
  {
    image: heroImage1,
    title: "Transform Your Fitness Journey",
    description: "Achieve your goals with our comprehensive fitness and nutrition programs. Join us today and start your transformation!"
  },
  {
    image: heroImage2,
    title: "Reach Your Fitness Goals",
    description: "Explore our expert-designed programs and start seeing results today."
  }
  
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative h-screen overflow-hidden ">
      <div 
        className="relative bg-cover bg-center h-full"
        style={{ 
          backgroundImage: `url(${slides[currentSlide].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center' 
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate__animated animate__fadeIn animate__delay-1s">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg mb-8 animate__animated animate__fadeIn animate__delay-2s">
              {slides[currentSlide].description}
            </p>
            <Link 
              to="/signup"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
        <button 
          onClick={prevSlide} 
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl bg-black p-2 rounded-full"
        >
          &lt;
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl bg-black p-2 rounded-full"
        >
          &gt;
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
