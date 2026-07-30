

import { Button } from '@base-ui/react';
import React from 'react';

function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          {/* Left Content */}
          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Latest Electronics<br />at Best Prices
            </h1>
            
            <p className="text-lg text-blue-100 max-w-md">
              Discover cutting-edge technology with unbeatable prices on smartphones, laptops, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                className="bg-white text-blue-700 hover:bg-gray-100 px-7 py-3 text-base font-semibold rounded transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
              >
                Shop Now
              </Button>
              
              <Button 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-7 py-3 text-base font-semibold rounded transition-all duration-200 hover:scale-105 active:scale-95"
              >
                View Deals
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center">
            <div className="relative">
              <img 
                src="/hero-bg.png" 
                alt="Latest Electronics" 
                className="w-full max-w-md drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-white/10 rounded-3xl blur-3xl -z-10 scale-110"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;