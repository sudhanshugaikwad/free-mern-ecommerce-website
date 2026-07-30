import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Company Info */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <img src="/eKart.png" alt="eKart" className="w-28 rounded-md" />
            </div>
            <p className="text-gray-400 max-w-md text-base">
              Your trusted destination for the latest electronics and gadgets. 
              Quality products at unbeatable prices.
            </p>
          </div>

          {/* Customer Service */}
          <div className="lg:col-span-3">
            <h3 className="text-white text-lg font-semibold mb-5">Customer Service</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns &amp; Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-lg font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-lg font-semibold mb-5">Secure Payment</h3>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="bg-gray-800 px-4 py-2 rounded-lg">Visa</div>
              <div className="bg-gray-800 px-4 py-2 rounded-lg">Mastercard</div>
              <div className="bg-gray-800 px-4 py-2 rounded-lg">PayPal</div>
              <div className="bg-gray-800 px-4 py-2 rounded-lg">COD</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-16 pt-8 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} eKart. All Rights Reserved. |<a href="https://sudhanshugaikwad.vercel.app/"> Developed by  Sudhanshu Gaikwad</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;