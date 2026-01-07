import React, { useMemo, useRef, useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

const Contact: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const mailtoLinkRef = useRef<HTMLAnchorElement | null>(null);

  const canSend = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    return (
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      emailOk &&
      form.message.trim().length >= 10
    );
  }, [form]);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("CRE Mailflow — Contact");
    const body = encodeURIComponent(
      `First Name: ${form.firstName}\nLast Name: ${form.lastName}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    return `mailto:support@cremailflow.com?subject=${subject}&body=${body}`;
  }, [form]);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;

    // More reliable than window.location.href in some browsers
    mailtoLinkRef.current?.click();
  };

  return (
    <section className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Send Us A Message</h2>
          <p className="text-gray-600">Have questions about bulk orders or campaign strategies? We're here to help.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  name="firstName"
                  required
                  type="text"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                  placeholder="John"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  name="lastName"
                  required
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                name="email"
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                placeholder="john@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                placeholder="How can we help you close more deals?"
              />
              <div className="text-xs text-gray-500 mt-1">Minimum 10 characters.</div>
            </div>

            {/* Hidden anchor used for reliable mailto open */}
            <a ref={mailtoLinkRef} href={mailtoHref} className="hidden" aria-hidden="true">
              Email
            </a>

            <button
              type="submit"
              disabled={!canSend}
              className={`w-full py-3 rounded-lg font-semibold transition shadow-md ${
                canSend
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Send Message
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Or email us directly at{" "}
              <a href="mailto:support@cremailflow.com" className="text-blue-600 font-medium hover:underline">
                support@cremailflow.com
              </a>
            </p>

            <p className="text-gray-500 text-sm mt-2">
              One-click email:{" "}
              <a href={mailtoHref} className="text-blue-600 font-medium hover:underline">
                open drafted message
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
