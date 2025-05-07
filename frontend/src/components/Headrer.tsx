import React, { useState, useEffect } from 'react';
import Button from './Button';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="py-4 flex justify-center sticky top-0 z-40 lg:px-0 px-12">
        <div className="flex justify-between items-center w-full max-w-7xl py-2 lg:px-0 px-4 lg:rounded-none rounded-lg lg:backdrop-blur-none backdrop-blur-md lg:shadow-none shadow-none">
          <p className="font-medium text-white">Blog App</p>
          <div className="lg:flex hidden items-center rounded-lg backdrop-blur-md h-full shadow-lg px-4">
            <NavLink to="/" className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </NavLink>
            {/* Desktop Navigation */}
            <nav className="hidden md:block ml-8">
              <ul className="flex space-x-6">
                <li>
                  <NavLink to="/about" className="text-white hover:text-gray-300 transition-colors font-medium">About</NavLink>
                </li>
                <li>
                  <NavLink to="/features" className="text-white hover:text-gray-300 transition-colors font-medium">Features</NavLink>
                </li>
                <li>
                  <NavLink to="/pricing" className="text-white hover:text-gray-300 transition-colors font-medium">Pricing</NavLink>
                </li>
              </ul>
            </nav>
          </div>

          {/* Desktop Login/Register */}
          <div className="hidden md:flex space-x-4">
            <Button variant="outline">Login</Button>
            <Button variant="primary">Register</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white z-50 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Full-screen Mobile Menu with animation */}
      <div 
        className={`fixed inset-0 backdrop-blur-xl bg-gray-900/90 z-30 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col h-full justify-center items-center">
          <nav className="w-full max-w-md mx-auto">
            <ul className="flex flex-col space-y-8 px-8 text-center">
              <li>
                <NavLink 
                  to="/about" 
                  className="text-white text-2xl hover:text-gray-300 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/features" 
                  className="text-white text-2xl hover:text-gray-300 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/pricing" 
                  className="text-white text-2xl hover:text-gray-300 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="flex flex-col sm:flex-row w-full max-w-xs mx-auto space-y-4 sm:space-y-0 sm:space-x-4 mt-12 px-8">
            <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>Login</Button>
            <Button variant="primary" className="w-full" onClick={() => setIsMenuOpen(false)}>Register</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;