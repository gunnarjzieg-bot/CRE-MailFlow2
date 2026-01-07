import React from "react";

type Review = {
  id: string;
  name: string;
  role: string;
  text: string;
  image: string;
  rating: number;
};

const REVIEWS: Review[] = [
  {
    id: "david-kim",
    name: "David Kim",
    role: "Multi-family Syndicator",
    text:
      "I used to spend weeks designing mailers. CRE Mailflow got my campaign out in 10 minutes. Landed a 12-unit off-market deal in my first month.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?fit=crop&w=150&h=150",
    rating: 5,
  },
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    role: "Portfolio Manager",
    text:
      "The response rates are significantly higher because the copy feels personal, not generic. Essential tool for our acquisition team.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=150&h=150",
    rating: 5,
  },
  {
    id: "michael-ross",
    name: "Michael Ross",
    role: "Industrial Investor",
    text:
      "Finally, a direct mail service that understands commercial real estate assets. The property-specific targeting is a game changer.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=150&h=150",
    rating: 5,
  },
];

const Star: React.FC = () => (
  <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">Trusted by Deal Finders</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div key={review.id} className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <div className="flex items-center mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} />
                ))}
              </div>

              <p className="text-gray-300 mb-6 italic">"{review.text}"</p>

              <div className="flex items-center">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{review.name}</h4>
                  <p className="text-slate-400 text-xs">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* If these aren’t real customers, keep this. If they are real, remove it. */}
        <p className="text-center text-xs text-slate-400 mt-10">
          Testimonials are representative results and may vary.
        </p>
      </div>
    </section>
  );
};

export default Testimonials;
