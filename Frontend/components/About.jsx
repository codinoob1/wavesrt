import React from 'react'

const About = () => {
  return (
    <section className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 pt-20'>
      <div className='max-w-4xl w-full'>
        <div className='bg-white rounded-2xl shadow-xl p-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>About WaveSRT</h1>
          
          <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
            WaveSRT is a cutting-edge audio-to-subtitle conversion platform designed to make content creation easier and more accessible. Our mission is to break down language barriers and make video content available to everyone.
          </p>

          <h2 className='text-2xl font-bold text-gray-900 mt-8 mb-4'>Our Mission</h2>
          <p className='text-gray-600 mb-6 leading-relaxed'>
            We believe that quality content should be accessible to everyone, regardless of language or hearing ability. By making it easy to convert audio to subtitles, we're helping creators reach a global audience.
          </p>

          <h2 className='text-2xl font-bold text-gray-900 mt-8 mb-4'>Features</h2>
          <ul className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <li className='flex items-start'>
              <span className='text-indigo-600 font-bold mr-3'>✓</span>
              <span className='text-gray-600'>Fast and accurate audio processing</span>
            </li>
            <li className='flex items-start'>
              <span className='text-indigo-600 font-bold mr-3'>✓</span>
              <span className='text-gray-600'>Support for multiple languages</span>
            </li>
            <li className='flex items-start'>
              <span className='text-indigo-600 font-bold mr-3'>✓</span>
              <span className='text-gray-600'>High-quality SRT subtitle generation</span>
            </li>
            <li className='flex items-start'>
              <span className='text-indigo-600 font-bold mr-3'>✓</span>
              <span className='text-gray-600'>Easy to use interface</span>
            </li>
          </ul>

          <h2 className='text-2xl font-bold text-gray-900 mt-8 mb-4'>Get Started</h2>
          <p className='text-gray-600 mb-4'>
            Ready to convert your audio files to subtitles? Click the login button in the navbar to get started!
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
