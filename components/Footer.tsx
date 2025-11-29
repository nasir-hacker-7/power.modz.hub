
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-power-darker border-t border-gray-200 dark:border-white/10 py-12 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Power Modz</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your ultimate destination for premium digital content, mods, and utilities. Safe, fast, and reliable.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/" className="hover:text-power-600 dark:hover:text-power-500 transition">Home</Link></li>
              <li><Link to="/profile" className="hover:text-power-600 dark:hover:text-power-500 transition">Web Profile</Link></li>
              <li><Link to="/about" className="hover:text-power-600 dark:hover:text-power-500 transition">About Us</Link></li>
              <li><Link to="/login" className="hover:text-power-600 dark:hover:text-power-500 transition">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/privacy" className="hover:text-power-600 dark:hover:text-power-500 transition">Privacy Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-power-600 dark:hover:text-power-500 transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-power-600 dark:hover:text-power-500 transition">DMCA</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/5 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Power Modz. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
