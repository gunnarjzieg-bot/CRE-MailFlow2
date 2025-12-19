import React from 'react';

const Contact: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Send Us A Message</h2>
          <p className="text-gray-600">Have questions about bulk orders or campaign strategies? We're here to help.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="Doe" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="john@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="How can we help you close more deals?"></textarea>
            </div>

            <button type="button" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition shadow-md">
              Send Message
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">Or email us directly at <a href="mailto:support@cremailflow.com" className="text-primary font-medium hover:underline">support@cremailflow.com</a></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;