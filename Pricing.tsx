import React from 'react';
import { MailerType } from '../types';
import WhyCreMailflow from './WhyCreMailflow';

const Pricing: React.FC = () => {
  const plans = [
    {
      id: MailerType.LETTER,
      name: "Letter Mailer",
      price: 0.79,
      desc: "Professional letterhead in a standard #10 envelope. Great for formal offers.",
      popular: false
    },
    {
      id: MailerType.POSTCARD_STD,
      name: "Standard Postcard",
      price: 0.99,
      desc: "6x9 full color glossy postcard. High visibility and read rates.",
      popular: true
    },
    {
      id: MailerType.POSTCARD_JUMBO,
      name: "Jumbo Postcard",
      price: 1.39,
      desc: "9x12 oversized postcard. Dominates the mailbox for maximum impact.",
      popular: false
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600">All-inclusive pricing. Design, print, postage, and tracking included.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            {plans.map((plan) => (
              <div key={plan.id} className={`relative bg-white rounded-2xl shadow-sm border ${plan.popular ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-gray-200'} p-8 flex flex-col`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wide px-4 py-1 rounded-full shadow-sm">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price.toFixed(2)}</span>
                  <span className="text-gray-500 ml-2">/ piece</span>
                </div>
                <p className="text-gray-600 mb-8 text-sm leading-relaxed">{plan.desc}</p>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Full Color Print
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    First Class Postage
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Smart Tracking
                  </li>
                </ul>

                <button className={`w-full py-3 rounded-lg font-semibold transition ${plan.popular ? 'bg-primary text-white hover:bg-blue-800' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
                  Select {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* New Why CRE Mailflow Section */}
        <WhyCreMailflow />
      </section>
    </div>
  );
};

export default Pricing;