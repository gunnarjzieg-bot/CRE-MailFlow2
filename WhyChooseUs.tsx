import React from 'react';

const WhyChooseUs: React.FC = () => {
  const steps = [
    {
      step: "1",
      title: "Set Your Criteria & Choose Your Mail Piece",
      desc: "Tell us the markets you want to target, set your property/owner criteria, and choose the mail piece you want to send (postcard, letter, or jumbo)."
    },
    {
      step: "2",
      title: "We Pull & Verify Your Data",
      desc: "We pull, clean, and verify your mailing list so you’re only sending to accurate, deliverable owner addresses."
    },
    {
      step: "3",
      title: "We Print & Mail For You",
      desc: "Once you approve the campaign, we print, package, and drop your mail — all handled for you."
    },
    {
      step: "4",
      title: "Start Landing Off-Market Deals",
      desc: "Most campaigns start hitting mailboxes in about 7 days, giving you fast access to new off-market opportunities."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">How Does CRE Mailflow Work?</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Launch a targeted commercial direct-mail campaign in minutes and start landing off-market deals in as little as 7 days.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white border-4 border-primary text-primary rounded-full flex items-center justify-center text-3xl font-serif font-bold mb-6 shadow-sm z-10 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 px-2 min-h-[3.5rem] flex items-center justify-center">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed px-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;