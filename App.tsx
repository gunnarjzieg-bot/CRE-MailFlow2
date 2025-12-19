import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DealSetup from './components/DealSetup';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import WhyChooseUs from './components/WhyChooseUs';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onStart={() => setCurrentPage('setup')} />
            <WhyChooseUs />
            <Testimonials />
          </>
        );
      case 'setup':
        return <DealSetup />;
      case 'pricing':
        return <Pricing />;
      case 'contact':
        return <Contact />;
      default:
        return <Hero onStart={() => setCurrentPage('setup')} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <main>
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-serif font-bold text-white">CRE Mailflow</span>
              <p className="text-slate-400 text-sm mt-2">Automated direct mail for commercial investors.</p>
            </div>
            <div className="flex space-x-6 text-sm text-slate-400">
              <button onClick={() => setCurrentPage('contact')} className="hover:text-white">Contact</button>
              <button onClick={() => setCurrentPage('pricing')} className="hover:text-white">Pricing</button>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-slate-600">
            &copy; {new Date().getFullYear()} CRE Mailflow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;