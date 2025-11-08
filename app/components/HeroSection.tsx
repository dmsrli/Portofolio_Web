'use client'

import ScrollIndicator from './ScrollIndicator'
import Spline from '@splinetool/react-spline'

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex flex-col md:flex-row items-center justify-between
                 min-h-[90vh] bg-[rgba(10,20,35,0.35)] text-white px-6 md:px-24 pt-28 overflow-hidden"
    >
      {/* === Left Text Area === */}
      <div className="flex-1 z-10 max-w-xl text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-accent-cyan 
                       drop-shadow-[0_0_15px_rgba(93,224,255,0.6)]">
          Hi, I’m <span className="text-accent-blue">Dimas Riali</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
          A Computer Engineering Graduate specializing in System & Web Development.  
          Passionate about Creative UI/UX Design and Front-End Programming to craft 
          digital experiences.
        </p>
      </div>

      {/* === Right 3D Animation === */}
      <div className="flex-1 relative w-full h-[500px] md:h-[700px] mt-10 md:mt-0">
        <Spline scene="https://prod.spline.design/nfvAQ4mKyvTuCAiA/scene.splinecode" />
      </div>

      {/* === Scroll Indicator === */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  )
}
