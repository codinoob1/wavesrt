import React, { use, useContext } from 'react'
import { AuthContext } from '../src/AuthContext';
const Home = () => {

  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const handleLoginClick = () => {
    // Open login page in a new tab
    window.open("/login");
  };
  const handleGetStartedClick = () => {
    // Open upload page in a new tab
    window.open("/upload");
  };
  


  return (
    <section className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 pt-20'>
      <div className='max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>

        {/* Left Content */}
        <div className='flex flex-col gap-6'>
          <h1 className='text-5xl md:text-6xl font-bold text-gray-900 leading-tight'>
            Convert Audio to
            <span className='text-indigo-600'> SRT in Seconds</span>
          </h1>

          <p className='text-xl text-gray-600 leading-relaxed'>
            Transform your audio files into perfectly formatted subtitle files. Fast, accurate, and completely free.
          </p>

          <div className='flex gap-4 pt-4'>
            {
              // if the user is not logged in, show the login button, otherwise show the get started button
              !isLoggedIn &&(
                <button className='bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold text-lg  cursor-pointer' onClick={handleLoginClick}>
                  Get Started
                </button>
              )
            }
            {
              isLoggedIn && (
                <button className='bg-gray-300 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-400 transition font-semibold text-lg  cursor-pointer' onClick={handleGetStartedClick}>
                  ReDirect-Me! 
                </button>
              )
            }

            
            
          </div>
        </div>

        {/* Right Visual */}
        <div className='hidden md:flex items-center justify-center'>
          <div className='relative w-full aspect-square max-w-md'>
            {/* Decorative Waveform */}
            <svg className='w-full h-full' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'>
              <defs>
                <linearGradient id='waveGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                  <stop offset='0%' style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
                  <stop offset='100%' style={{ stopColor: '#6366f1', stopOpacity: 0.1 }} />
                </linearGradient>
              </defs>

              {/* Circle background */}
              <circle cx='100' cy='100' r='95' fill='none' stroke='#e5e7eb' strokeWidth='1' />

              {/* Waveform bars */}
              <g fill='url(#waveGradient)'>
                <rect x='30' y='60' width='8' height='80' rx='4' />
                <rect x='45' y='40' width='8' height='120' rx='4' />
                <rect x='60' y='50' width='8' height='100' rx='4' />
                <rect x='75' y='35' width='8' height='130' rx='4' />
                <rect x='90' y='30' width='8' height='140' rx='4' />
                <rect x='105' y='30' width='8' height='140' rx='4' />
                <rect x='120' y='35' width='8' height='130' rx='4' />
                <rect x='135' y='50' width='8' height='100' rx='4' />
                <rect x='150' y='40' width='8' height='120' rx='4' />
                <rect x='165' y='60' width='8' height='80' rx='4' />
              </g>
            </svg>

            {/* Floating label */}
            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-4 py-2'>
              <p className='text-sm font-semibold text-gray-900'>Audio Processing</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home