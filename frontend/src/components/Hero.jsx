import React, { useState, useEffect } from 'react';
// import { assets } from '../assets/assets';
 import hero1 from "../assets/hero_img.png";
import hero2 from "../assets/hero_img2.png";
import hero3 from "../assets/hero_img3.png";

const slides = [
  {
    image: hero1,
    title: 'Big Discounts',
    subtitle: 'Up to 70% OFF',
    description: 'Best deals on fashion, electronics, and more!',
  },
  { 
    image:  hero2, 
    title: 'Trending Now',
    subtitle: 'Latest Styles',
    description: 'Get your hands on the hottest new arrivals.',
  },
  {
    image: hero3,
    title: 'Smart Electronics',
    subtitle: 'Gadgets & Devices',
    description: 'Explore the tech world at unbeatable prices.',
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 1500); // change every 4s
    return () => clearInterval(interval);
  }, []);

  const { image, title, subtitle, description } = slides[currentSlide];

  return (
    <div className='flex flex-col sm:flex-row border border-gray-300'>
      {/* Left Text Content */}
      <div className='flex items-center justify-center w-full py-10 sm:w-1/2 sm:py-0 px-4'>
        <div className='text-[#414141] space-y-4'>
          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='text-sm font-medium md:text-base uppercase'>{subtitle}</p>
          </div>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold prata-regular'>{title}</h1>
          <p className='text-base md:text-lg text-gray-600'>{description}</p>
          <div className='flex items-center gap-2'>
            <p className='text-sm font-semibold md:text-base cursor-pointer hover:underline'>SHOP NOW</p>
            <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className='relative w-full sm:w-1/2 h-[300px] sm:h-auto overflow-hidden'>
        <img
          src={image}
          alt='Hero Slide'
          className='w-full h-full object-cover transition-all duration-700'
        />

        {/* Dots navigation */}
        <div className='absolute bottom-3 right-3 flex gap-2'>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? 'bg-black' : 'bg-gray-400'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
