import React, { useState } from 'react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', value: 'home' },
    { name: 'Pricing', value: 'pricing' },
    { name: 'Contact', value: 'contact' },
  ];

  const handleNav = (value: string) => {
    onNavigate(value);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => handleNav('home')}>
            <span className="text-2xl font-serif font-bold text-primary">CRE Mailflow</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => handleNav(link.value)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === link.value ? 'text-primary font-bold' : 'text-gray-500 hover:text-primary'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => handleNav('setup')}
              className="bg-primary text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition shadow-sm"
            >
              Start Campaign
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => handleNav(link.value)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === link.value ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => handleNav('setup')}
              className="block w-full text-left px-3 py-2 mt-2 rounded-md text-base font-medium bg-primary text-white hover:bg-blue-800"
            >
              Start Campaign
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;