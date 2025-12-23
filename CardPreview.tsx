import React, { useMemo, useState } from 'react';
import type { MailerDesign, BuyingCriteria } from './types';

interface CardPreviewProps {
  design: MailerDesign;
  criteria: BuyingCriteria;
  onSelect: () => void;
  selected: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({ design, criteria, onSelect, selected }) => {
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [imgError, setImgError] = useState(false);

  const getImage = (type: string) => {
    if (imgError) {
      return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800';
    }

    const t = (type || '').toLowerCase();

    if (t.includes('retail') || t.includes('shopping'))
      return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800';

    if (t.includes('office'))
      return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';

    if (t.includes('industrial') || t.includes('warehouse'))
      return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800';

    if (t.includes('multi'))
      return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';

    if (t.includes('land'))
      return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800';

    if (t.includes('flex'))
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';

    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800';
  };

  const bgImage = useMemo(() => getImage(criteria.propertyType), [criteria.propertyType, imgError]);

  const targetUrl = criteria.website || 'https://example.com';

  const qrCodeUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        targetUrl
      )}&bgcolor=ffffff`,
    [targetUrl]
  );

  const formattedPhone = criteria.phoneNumber || '(555) 000-0000';

  const renderLogo = (className: string) => {
    if (criteria.logo) {
      return <img src={criteria.logo} alt="Company Logo" className={`object-contain ${className}`} />;
    }
    return (
      <div className={`font-bold uppercase tracking-widest text-gray-500 ${className}`}>
        {criteria.companyName}
      </div>
    );
  };

  const primaryColor = 'text-blue-900';
  const accentBg = 'bg-blue-900';

  const renderFront = () => {
    if (design.style === 'modern') {
      return (
        <div className="w-full h-full bg-blue-50 relative flex overflow-hidden font-sans border border-gray-100">
          <div className="w-1/2 relative h-full bg-gray-300">
            <img
              src={bgImage}
              alt="Property"
              className="w-full h-full object-cover block absolute inset-0"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-blue-900/10"></div>
          </div>

          <div className="w-1/2 flex flex-col justify-between relative bg-blue-50">
            <div className="p-5 flex-1 flex flex-col justify-center">
              {renderLogo('h-8 mb-4 self-start')}
              <h3 className={`text-xl font-bold ${primaryColor} leading-tight mb-3`}>{design.front.headline}</h3>
              <div className={`w-12 h-1.5 ${accentBg} mb-4`}></div>
              <p className="text-xs text-gray-700 leading-snug font-medium">{design.front.bodyCopy}</p>
            </div>

            <div className="bg-blue-900 text-white p-4 flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                <div className="text-[10px] font-bold uppercase opacity-80 mb-0.5">{design.front.cta}</div>
                <div className="text-sm font-bold tracking-wide">{formattedPhone}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (design.style === 'bold') {
      return (
        <div className="w-full h-full bg-slate-900 text-white relative flex flex-col overflow-hidden font-sans bg-gray-800">
          <img
            src={bgImage}
            alt="Property"
            className="absolute inset-0 w-full h-full object-cover opacity-100"
            onError={() => setImgError(true)}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/20 z-0"></div>

          <div className="absolute top-5 left-6 z-10">
            {criteria.logo ? (
              <img src={criteria.logo} alt="Logo" className="h-10 object-contain brightness-0 invert" />
            ) : (
              <div className="text-xs font-bold tracking-widest uppercase text-white/90">{criteria.companyName}</div>
            )}
          </div>

          <div className="p-6 relative z-10 flex-1 flex flex-col justify-center h-full text-left max-w-[75%]">
            <div
              className={`inline-block self-start ${accentBg} text-white px-3 py-1 text-[9px] font-bold uppercase tracking-wider mb-3 rounded shadow-sm`}
            >
              Notice to Owner
            </div>

            <h3 className="text-2xl font-black uppercase leading-none mb-4 text-white drop-shadow-xl">
              {design.front.headline}
            </h3>

            <div className="bg-slate-900/60 p-3 rounded-lg backdrop-blur-md mb-4 border-l-4 border-blue-500 shadow-lg">
              <p className="text-xs text-gray-100 leading-relaxed font-medium">{design.front.bodyCopy}</p>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="bg-white text-blue-900 px-4 py-2 rounded-md shadow-lg">
                <div className="text-[9px] font-bold uppercase tracking-wide opacity-70">{design.front.cta}</div>
                <div className="text-sm font-bold leading-none">{formattedPhone}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-stone-100 relative flex flex-col font-serif border border-gray-200">
        <div className="h-[45%] w-full relative bg-gray-300">
          <img
            src={bgImage}
            alt="Property"
            className="w-full h-full object-cover block absolute inset-0"
            onError={() => setImgError(true)}
          />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-3 left-5 right-5 text-white">
            <div className="text-lg font-bold leading-tight shadow-black drop-shadow-md">{design.front.headline}</div>
          </div>
        </div>

        <div className="h-[55%] p-6 flex flex-col bg-stone-100 justify-between items-center text-center">
          <div className="flex-1 flex flex-col justify-center w-full">
            {criteria.logo ? (
              <img src={criteria.logo} alt="Logo" className="h-8 object-contain mb-3 mx-auto" />
            ) : (
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-3">
                {criteria.companyName}
              </div>
            )}

            <div className="w-full h-px bg-stone-300 mb-3 mx-auto max-w-[50%]"></div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wide mb-2">{design.front.subHeadline}</p>
            <p className="text-xs text-gray-800 leading-relaxed font-medium">{design.front.bodyCopy}</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg px-4 py-2 mt-2 shadow-sm w-full max-w-[80%]">
            <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">
              {design.front.cta}
            </span>
            <span className="block text-sm font-bold text-blue-900">{formattedPhone}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderBack = () => {
    return (
      <div className="w-full h-full bg-white flex relative font-sans">
        <div className="w-3/5 p-4 flex flex-col h-full border-r border-gray-200 border-dashed bg-blue-50/50 relative">
          <h4 className="text-sm font-bold text-blue-900 mb-2 leading-tight">{design.back.headline}</h4>

          <ul className="space-y-1.5 mb-2">
            {design.back.benefits.slice(0, 4).map((b, i) => (
              <li key={i} className="flex items-start">
                <span className="text-blue-600 mr-1.5 text-[9px] font-bold mt-0.5">✓</span>
                <span className="text-[9px] text-gray-800 leading-tight font-medium">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-2">
            <div className="bg-white p-2 rounded border border-blue-100 shadow-sm">
              {design.back.testimonial && (
                <p className="text-[9px] text-gray-600 italic mb-1">"{design.back.testimonial}"</p>
              )}
              <p className="text-[8px] font-bold text-blue-800 uppercase tracking-wide">{design.back.socialProof}</p>
            </div>

            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col gap-1">
                {design.back.guarantee && (
                  <div className="text-[8px] font-bold text-gray-500 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span>
                    {design.back.guarantee}
                  </div>
                )}

                {criteria.logo ? (
                  <img src={criteria.logo} alt="Logo" className="h-5 w-auto object-contain self-start" />
                ) : (
                  <div className="text-[8px] font-bold text-gray-900">{criteria.companyName}</div>
                )}
              </div>

              <div className="flex flex-col items-center shrink-0">
                {design.back.secondaryCta && (
                  <span className="text-[7px] font-bold text-blue-900 mb-0.5 text-center max-w-[80px] leading-none">
                    {design.back.secondaryCta}
                  </span>
                )}
                <img src={qrCodeUrl} alt="QR" className="w-20 h-20 border-2 border-white shadow-sm bg-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-2/5 pl-4 p-4 flex flex-col relative h-full bg-white">
          <div className="absolute top-4 right-4 w-12 h-14 border border-gray-300 bg-white flex flex-col items-center justify-center text-center">
            <span className="text-[6px] uppercase text-gray-400 font-bold leading-tight">
              Presorted
              <br />
              Standard
              <br />
              US Postage
              <br />
              PAID
            </span>
          </div>

          <div className="mt-auto mb-6 pl-2">
            <div className="font-mono text-[10px] text-gray-500 mb-2 leading-relaxed">
              Current Resident
              <br />
              123 Investment Way
              <br />
              {criteria.targetCity || 'City'}, {criteria.targetState || 'ST'} 90210
            </div>

            <div className="h-5 w-full bg-gray-100 rounded-sm flex items-center px-2">
              <div className="w-full h-1 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="absolute bottom-2 right-4 left-6 flex justify-between items-end">
            <span className="text-[6px] text-gray-300">CRE-FLOW-2024 • {design.id}</span>
          </div>
        </div>
      </div>
    );
  };

  const containerClass = `
    relative w-full bg-white rounded shadow-lg cursor-pointer transition-all overflow-hidden border hover:shadow-xl group
    ${selected ? 'border-blue-600 ring-2 ring-blue-500 ring-offset-2' : 'border-gray-200'}
  `;

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={onSelect}
        style={{ aspectRatio: '3/2' }}
        className={containerClass}
        aria-pressed={selected}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelect();
        }}
      >
        {side === 'front' ? renderFront() : renderBack()}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSide((prev) => (prev === 'front' ? 'back' : 'front'));
          }}
          className="absolute bottom-3 left-3 z-20 bg-white/90 hover:bg-white text-blue-900 text-[10px] px-3 py-1.5 rounded-full shadow-md backdrop-blur-md transition-all flex items-center gap-1 font-bold border border-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {side === 'front' ? 'View Back' : 'View Front'}
        </button>
      </div>
    </div>
  );
};

export default CardPreview;
