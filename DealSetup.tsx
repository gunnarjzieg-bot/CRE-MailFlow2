import React, { useMemo, useState } from 'react';
import { BuyingCriteria, MailerDesign, MailerType, PricingPlan } from './types';
import { generateMailerCopy } from './geminiService';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import CardPreview from './CardPreview';

/* ------------------ Props Interface ------------------ */

interface DealSetupProps {
  initialPlan?: MailerType;
}

/* ------------------ Constants ------------------ */

const PROPERTY_TYPES = ['Retail', 'Industrial', 'Multi-family', 'Office', 'Flex', 'Land'];
const OWNER_TYPES = ['Individual Owner', 'LLC Owner', 'Portfolio / Multiple Properties', 'Bank Owned'];
const PRICE_RANGES = ['Under $1M', '$1M - $2.5M', '$2.5M - $5M', '$5M - $10M', '$10M - $20M', '$20M+'];

interface PricingPlanWithStripe extends PricingPlan {
  stripeLink: string;
}

/**
 * Stripe Payment Links (Hardcoded)
 * If Stripe checkout still shows "test", these are NOT live links—replace them with LIVE-mode links.
 */
const STRIPE_LINKS: Record<MailerType, string> = {
  [MailerType.LETTER]: 'https://buy.stripe.com/4gM00ldzffJFdAa3PiefC00',
  [MailerType.POSTCARD_STD]: 'https://buy.stripe.com/14A3cx2UBeFB9jU85yefC01',
  [MailerType.POSTCARD_JUMBO]: 'https://buy.stripe.com/9B66oJ0Mt8hdanY5XqefC02',
};

const PRICING_PLANS: PricingPlanWithStripe[] = [
  {
    id: MailerType.LETTER,
    name: 'A. Letter Mailer',
    pricePerUnit: 0.79,
    dimensions: '#10 Envelope',
    description: 'Formal introduction letter',
    stripeLink: STRIPE_LINKS[MailerType.LETTER],
  },
  {
    id: MailerType.POSTCARD_STD,
    name: 'B. 6x9 Postcard',
    pricePerUnit: 0.99,
    dimensions: '6x9',
    description: 'Standard size, most popular',
    stripeLink: STRIPE_LINKS[MailerType.POSTCARD_STD],
  },
  {
    id: MailerType.POSTCARD_JUMBO,
    name: 'C. 9x12 Postcard',
    pricePerUnit: 1.39,
    dimensions: '9x12',
    description: 'Jumbo size for maximum impact',
    stripeLink: STRIPE_LINKS[MailerType.POSTCARD_JUMBO],
  },
];

/* ------------------ Helpers ------------------ */

// Helper to ensure BigInt columns get clean numbers (or null if empty)
function toIntOrNull(value: string): number | null {
  const cleaned = (value || '').replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

/* ------------------ Component ------------------ */

const DealSetup: React.FC<DealSetupProps> = ({ initialPlan }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [launching, setLaunching] = useState(false);

  const [criteria, setCriteria] = useState<BuyingCriteria>({
    propertyType: PROPERTY_TYPES[0],
    targetState: '',
    targetCity: '',
    minSqFt: '',
    minYearsOwned: '',
    priceRange: PRICE_RANGES[0],
    ownerType: OWNER_TYPES[0],
    companyName: '',
    website: '',
    phoneNumber: '',
    email: '',
    logo: '',
  });

  const [generatedDesigns, setGeneratedDesigns] = useState<MailerDesign[]>([]);
  const [selectedDesignId, setSelectedDesignId] = useState<string>('');
  const [quantity, setQuantity] = useState(100);

  // Use provided initial plan (if any)
  const [selectedPlan, setSelectedPlan] = useState<MailerType>(initialPlan || MailerType.POSTCARD_STD);

  const activeDesign = useMemo(
    () => generatedDesigns.find((d) => d.id === selectedDesignId) || generatedDesigns[0],
    [generatedDesigns, selectedDesignId]
  );

  const selectedPlanObj = useMemo(() => PRICING_PLANS.find((p) => p.id === selectedPlan), [selectedPlan]);

  const calculateTotal = () => {
    const plan = selectedPlanObj;
    return (quantity * (plan?.pricePerUnit || 0)).toFixed(2);
  };

  const getDesignButtonColor = (style: MailerDesign['style'], isSelected: boolean) => {
    if (!isSelected) return 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50';

    switch (style) {
      case 'modern':
        return 'bg-blue-600 text-white border-blue-600 shadow-blue-200';
      case 'bold':
        return 'bg-red-600 text-white border-red-600 shadow-red-200';
      case 'classic':
        return 'bg-amber-500 text-white border-amber-500 shadow-amber-200';
      default:
        return 'bg-slate-900 text-white border-slate-900 shadow-slate-200';
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    const truncated = input.slice(0, 10);

    let formatted = truncated;
    if (truncated.length > 6) {
      formatted = `(${truncated.slice(0, 3)}) ${truncated.slice(3, 6)}-${truncated.slice(6)}`;
    } else if (truncated.length > 3) {
      formatted = `(${truncated.slice(0, 3)}) ${truncated.slice(3)}`;
    }

    setCriteria({ ...criteria, phoneNumber: formatted });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCriteria((prev) => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  /* ------------------ Supabase Save ------------------ */

  const saveCampaignDraft = async () => {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('[campaigns] Supabase not configured — skipping save');
      return { data: null, error: null };
    }

    const chosenDesign = activeDesign || null;

    // Matches campaigns schema
    const payload = {
      company_name: criteria.companyName || null,
      logo: criteria.logo || null,
      property_type: criteria.propertyType || null,
      owner_type: criteria.ownerType || null,
      target_state: criteria.targetState || null,
      target_city: criteria.targetCity || null,
      min_sq_ft: toIntOrNull(criteria.minSqFt),
      min_years_owned: toIntOrNull(criteria.minYearsOwned),
      price_range: criteria.priceRange || null,
      website: criteria.website || null,
      phone: criteria.phoneNumber || null,
      mailer_format: selectedPlanObj?.name || String(selectedPlan),
      quantity: quantity,
      selected_design_style: chosenDesign?.style || null,
      selected_design: chosenDesign, // jsonb
    };

    console.log('[campaigns] INSERT payload:', payload);

    const { data, error } = await supabase.from('campaigns').insert(payload).select('id, created_at').single();

    console.log('[campaigns] INSERT result:', { data, error });

    if (error) {
      console.error('[campaigns] Supabase insert failed:', error);
    }

    return { data, error };
  };

  /* ------------------ Step 1: Generate ------------------ */

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!criteria.logo) {
      alert('Please upload your company logo (JPG or PNG) to continue.');
      return;
    }

    setLoading(true);
    try {
      const designs = await generateMailerCopy(criteria);
      setGeneratedDesigns(designs);
      if (designs.length > 0) setSelectedDesignId(designs[0].id);
      setStep(2);
    } catch {
      alert('Something went wrong generating the mailer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Step 2: Launch -> Save -> Stripe ------------------ */

  const handleLaunch = async () => {
    setLaunching(true);

    try {
      const plan = selectedPlanObj;

      if (!plan) {
        alert('Please select a mailer format.');
        setLaunching(false);
        return;
      }

      if (!activeDesign) {
        alert('Please select a design.');
        setLaunching(false);
        return;
      }

      // Enforce minimum quantity at checkout (real enforcement)
      if (!Number.isFinite(quantity) || quantity < 100) {
        alert('Minimum order quantity is 100 pieces.');
        setLaunching(false);
        return;
      }

      // Save and STOP if it fails (only if Supabase configured)
      const { error } = await saveCampaignDraft();
      if (error) {
        alert('Could not save campaign. Check console + Supabase RLS/policies.');
        setLaunching(false);
        return;
      }

      // Redirect to Stripe
      console.log('Redirecting to:', plan.stripeLink);
      window.location.href = plan.stripeLink;
    } catch (err) {
      console.error(err);
      alert('Unable to launch campaign.');
      setLaunching(false);
    }
  };

  /* ------------------ Render ------------------ */

  if (step === 1) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Setup Your Deal Finder Campaign</h2>
          <p className="text-gray-600">Tell us about the commercial assets you are targeting.</p>
        </div>

        <form onSubmit={handleGenerate} className="bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-gray-100">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none bg-white"
                  value={criteria.propertyType}
                  onChange={(e) => setCriteria({ ...criteria, propertyType: e.target.value })}
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Type</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none bg-white"
                  value={criteria.ownerType}
                  onChange={(e) => setCriteria({ ...criteria, ownerType: e.target.value })}
                >
                  {OWNER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target State</label>
                <input
                  required
                  type="text"
                  maxLength={2}
                  placeholder="e.g. TX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                  value={criteria.targetState}
                  onChange={(e) => setCriteria({ ...criteria, targetState: e.target.value.toUpperCase() })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target City <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Austin"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                  value={criteria.targetCity || ''}
                  onChange={(e) => setCriteria({ ...criteria, targetCity: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min. Sq Feet</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 25,000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                  value={criteria.minSqFt}
                  onChange={(e) => setCriteria({ ...criteria, minSqFt: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min. Years Owned</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                  value={criteria.minYearsOwned}
                  onChange={(e) => setCriteria({ ...criteria, minYearsOwned: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none bg-white"
                  value={criteria.priceRange}
                  onChange={(e) => setCriteria({ ...criteria, priceRange: e.target.value })}
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Company Information</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    {criteria.logo ? (
                      <div className="flex flex-col items-center justify-center py-4">
                        <img src={criteria.logo} alt="Logo Preview" className="h-16 object-contain mb-2" />
                        <p className="text-xs text-green-600 font-bold">Logo Uploaded Successfully</p>
                        <p className="text-[10px] text-gray-400">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="mb-1 text-sm text-gray-500 font-medium">Click to upload logo</p>
                        <p className="text-xs text-gray-400">JPG or PNG</p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleLogoUpload} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Acme Capital Group"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                    value={criteria.companyName}
                    onChange={(e) => setCriteria({ ...criteria, companyName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                    value={criteria.phoneNumber}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. yourcompany.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                    value={criteria.website}
                    onChange={(e) => setCriteria({ ...criteria, website: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. you@company.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                    value={criteria.email || ''}
                    onChange={(e) => setCriteria({ ...criteria, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-slate-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-slate-800 transition shadow-md disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Designs...
                </>
              ) : (
                'Create Mailer Designs'
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // STEP 2
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Design Selection */}
        <div className="lg:w-2/3 flex flex-col">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Select Your Design</h2>
            <p className="text-gray-600">Choose the style that best fits your brand voice.</p>
          </div>

          <div className="flex-1 bg-white p-4 sm:p-8 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center mb-8 bg-gradient-to-br from-gray-50 to-gray-100">
            {activeDesign && (
              <div className="w-full max-w-2xl transform transition-all duration-500">
                <CardPreview design={activeDesign} criteria={criteria} selected={true} onSelect={() => {}} />
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
            {generatedDesigns.map((design) => {
              const isSelected = selectedDesignId === design.id;
              const colorClass = getDesignButtonColor(design.style, isSelected);

              return (
                <button
                  key={design.id}
                  onClick={() => setSelectedDesignId(design.id)}
                  className={`px-6 py-3 rounded-full text-sm font-bold border-2 transition-all transform hover:-translate-y-1 shadow-sm ${colorClass} ${
                    isSelected ? 'scale-105 shadow-md ring-2 ring-offset-2 ring-transparent' : ''
                  }`}
                >
                  {design.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Checkout */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Checkout</h3>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
                Secure
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Format</label>
                <div className="space-y-3">
                  {PRICING_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`cursor-pointer p-3 border rounded-lg flex items-center justify-between transition ${
                        selectedPlan === plan.id
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-gray-900">{plan.name}</div>
                        <div className="text-xs text-gray-500">{plan.dimensions}</div>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">${plan.pricePerUnit.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="relative">
                  <input
                    type="number"
                    min={100}
                    step={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                    onBlur={() => setQuantity((prev) => Math.max(100, Math.trunc(prev)))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                  />
                  <div className="absolute right-3 top-2 text-sm text-gray-400">pcs</div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 100 pieces.</p>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateTotal()}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">Postage</span>
                  <span className="font-medium text-green-600">Included</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              <button
                className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold hover:bg-slate-800 transition shadow-lg transform active:scale-95 disabled:opacity-50"
                onClick={handleLaunch}
                disabled={launching}
              >
                {launching ? 'Processing...' : 'Launch Campaign'}
              </button>

              <p className="text-xs text-center text-gray-400 mt-3 flex items-center justify-center gap-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Encrypted SSL Payment
              </p>

              {!isSupabaseConfigured && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  Supabase env vars aren’t set yet. That’s fine for now — saving will be skipped until you add them in
                  Vercel.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealSetup;
