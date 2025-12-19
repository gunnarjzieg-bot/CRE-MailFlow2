import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
            AI-powered off-market deal finder
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6">
            Score off-market deals in <br className="hidden sm:block" /> less than 7 days
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Generate smart, personalized postcards in seconds. Enter your buying criteria, and our system designs the mailer,
            writes the copy, and handles printing and delivery.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onStart}
              className="px-8 py-4 bg-slate-900 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-slate-800 transition transform hover:-translate-y-0.5"
            >
              Start Your Campaign
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="flex -space-x-2">
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100"
                alt=""
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=100&h=100"
                alt=""
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=100&h=100"
                alt=""
              />
            </div>
            <p>Trusted by 1,000+ active investors & funds</p>
          </div>
        </div>
      </div>

      {/* Mockup Preview Area */}
      <div className="relative mt-8 lg:mt-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 opacity-10 pointer-events-none">
        {/* Background pattern or subtle imagery */}
      </div>
    </div>
  );
};

export default Hero;
