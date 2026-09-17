import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t-[4px] border-primary pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍔</span>
              <span className="font-bold text-2xl text-primary">FoodRush</span>
            </Link>
            <p className="text-gray-500 max-w-sm">
              Delicious food, delivered fast to your door. Experience the best local cuisines with FoodRush.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-navy mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-navy mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-500 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2026 FoodRush. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
