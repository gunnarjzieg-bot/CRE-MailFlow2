import React, { useEffect, useState } from 'react';
import type { Page } from './types';
import { MailerType } from './types';
import Navbar from './Navbar';
import Hero from './Hero';
import DealSetup from './DealSetup';
import Pricing from './Pricing';
import Contact from './Contact';
import Testimonials from './Testimonials';
import WhyChooseUs from './WhyChooseUs';

function assertNever(x: never): never {
  throw new Error(`Unexpected page: ${String(x)}`);
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedPlan, setSelectedPlan] = useState<MailerType>(MailerType.POSTCARD_STD);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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
        return <DealSetup initialPlan={selectedPlan} />;
      case 'pricing':
        return <Pricing onPlanSelect={setSelectedPlan} onNavigate={setCurrentPage} />;
      case 'contact':
        return <Contact />;
      default: {
        if (process.env.NODE_ENV !== 'production') {
          return assertNever(currentPage as never);
        }
        return (
          <>
            <Hero onStart={() => setCurrentPage('setup')} />
            <WhyChooseUs />
            <Testimonials />
          </>
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-2xl font-serif font-bold text-white hover:opacity-80 transition-opacity"
              >
                CRE Mailflow
              </button>
              <p className="text-slate-400 text-sm mt-2">
                Automated direct mail for commercial investors.
              </p>
            </div>
            <nav className="flex space-x-6 text-sm text-slate-400" aria-label="Footer navigation">
              <button
                onClick={() => setCurrentPage('contact')}
                className="hover:text-white transition-colors"
              >
                Contact
              </button>
              <button
                onClick={() => setCurrentPage('pricing')}
                className="hover:text-white transition-colors"
              >
                Pricing
              </button>
            </nav>
          </div>
          <div className="mt-8 text-center text-xs text-slate-600 border-t border-slate-800 pt-8">
            &copy; {new Date().getFullYear()} CRE Mailflow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
