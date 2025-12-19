import React from 'react';

const WhyCreMailflow: React.FC = () => {
  const features = [
    {
      title: "Designed for CRE Investors",
      desc: "We focus exclusively on commercial property owners—not generic residential lists—so every campaign reaches the right decision-makers.",
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "Same-Day Printing & Mailing",
      desc: "Submit your criteria and get your entire campaign printed and mailed the same day. No batching, no delays.",
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Verified Owner Data",
      desc: "We pull, clean, and validate ownership records to ensure accurate delivery and higher response rates.",
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Why CRE MailFlow</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Built specifically for commercial real estate investors who need fast, reliable, and targeted direct-mail campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition duration-300">
              <div className="mb-6 bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyCreMailflow;