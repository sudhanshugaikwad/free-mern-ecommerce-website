import React from 'react';
import { Truck, ShieldCheck, HeadphonesIcon, Bot } from 'lucide-react';

function Features() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Why Shop With Us?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We provide the best shopping experience with premium services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Free Shipping */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600">Free delivery on all orders above $50</p>
          </div>

          {/* Secure Payment */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-gray-600">100% secure checkout with SSL protection</p>
          </div>

          {/* 24/7 Support */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <HeadphonesIcon className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600">Our team is always ready to help you</p>
          </div>

          {/* AI Agent Help (Added as requested) */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-6 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Assistant</h3>
            <p className="text-gray-600">Get instant product recommendations &amp; help 24/7</p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Features;