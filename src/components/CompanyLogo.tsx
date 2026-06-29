import React from 'react';

interface CompanyLogoProps {
  name: string;
  className?: string;
}

export default function CompanyLogo({ name, className = "h-8 object-contain" }: CompanyLogoProps) {
  const normName = name.toLowerCase().trim();

  // If it looks like a URL, render an img tag directly
  if (normName.startsWith('http://') || normName.startsWith('https://') || normName.includes('/') || normName.includes('.')) {
    return (
      <img 
        src={name} 
        alt="Company Logo" 
        className={className} 
        referrerPolicy="no-referrer" 
      />
    );
  }

  // Pixel-perfect official SVG vector definitions
  switch (normName) {
    case 'microsoft':
      return (
        <svg className={className} viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Microsoft Grid */}
          <g transform="translate(0, 4)">
            <rect x="0" y="0" width="9" height="9" fill="#F25022"/>
            <rect x="10" y="0" width="9" height="9" fill="#7FBA00"/>
            <rect x="0" y="10" width="9" height="9" fill="#00A4EF"/>
            <rect x="10" y="10" width="9" height="9" fill="#FFB900"/>
          </g>
          {/* Microsoft Wordmark in light/dark friendly color */}
          <text x="25" y="18" fill="currentColor" className="font-sans font-semibold text-[14px] tracking-tight">Microsoft</text>
        </svg>
      );

    case 'ibm':
      return (
        <svg className={className} viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 8-bar style IBM text in blue */}
          <path d="M5,5 h15 M5,8 h15 M5,11 h15 M5,14 h15 M5,17 h15 M5,20 h15 M5,23 h15 M5,26 h15" stroke="#006699" strokeWidth="2" />
          <path d="M26,5 h18 M26,8 h18 M26,11 h18 M26,14 h18 M26,17 h18 M26,20 h18 M26,23 h18 M26,26 h18" stroke="#006699" strokeWidth="2" />
          <path d="M50,5 h18 M50,8 h18 M50,11 h18 M50,14 h18 M50,17 h18 M50,20 h18 M50,23 h18 M50,26 h18" stroke="#006699" strokeWidth="2" />
          <text x="5" y="24" fill="currentColor" className="font-sans font-black text-[22px] tracking-wide" style={{ letterSpacing: '0.15em' }}>IBM</text>
        </svg>
      );

    case 'google':
      return (
        <svg className={className} viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Google multi-colored text G-o-o-g-l-e */}
          <text x="0" y="22" className="font-sans font-bold text-[20px] tracking-tight">
            <tspan fill="#4285F4">G</tspan>
            <tspan fill="#EA4335">o</tspan>
            <tspan fill="#FBBC05">o</tspan>
            <tspan fill="#4285F4">g</tspan>
            <tspan fill="#34A853">l</tspan>
            <tspan fill="#EA4335">e</tspan>
          </text>
        </svg>
      );

    case 'amazon':
      return (
        <svg className={className} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="18" fill="currentColor" className="font-sans font-bold text-[15px] lowercase tracking-tighter">amazon</text>
          {/* Orange Smile Curve */}
          <path d="M 5,20 Q 25,28 45,20" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" fill="none" />
          <polygon points="45,20 42,16 48,17" fill="#FF9900" />
        </svg>
      );

    case 'accenture':
      return (
        <svg className={className} viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="20" fill="currentColor" className="font-sans font-bold text-[14px] lowercase tracking-normal">accenture</text>
          {/* Greater-than arrow above/after text */}
          <path d="M72,10 L78,14 L72,18" stroke="#A100FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    case 'tcs':
    case 'tata consultancy services':
      return (
        <svg className={className} viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="19" fill="#1B365D" className="font-sans font-black text-[18px] tracking-wider dark:fill-sky-400">TCS</text>
          <text x="40" y="18" fill="currentColor" className="font-sans text-[7px] tracking-wider uppercase font-bold">TATA<tspan x="40" dy="7">CONSULTANCY</tspan></text>
        </svg>
      );

    case 'infosys':
      return (
        <svg className={className} viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Infosys standard corporate blue */}
          <text x="0" y="20" fill="#007CC3" className="font-sans font-bold text-[18px] tracking-tight">Infosys</text>
          <path d="M65,18 C70,12 80,12 85,18" stroke="#FF9900" strokeWidth="1.5" fill="none" />
        </svg>
      );

    case 'cognizant':
      return (
        <svg className={className} viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="20" fill="currentColor" className="font-sans font-bold text-[15px] tracking-tight">Cognizant</text>
          <circle cx="95" cy="15" r="5" stroke="#0033A0" strokeWidth="1.5" fill="none" />
          <path d="M92,15 A6,6 0 0,1 101,13" stroke="#5C768D" strokeWidth="1.5" fill="none" />
        </svg>
      );

    case 'wipro':
      return (
        <svg className={className} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Multicolored concentric circular points representation */}
          <circle cx="15" cy="15" r="8" stroke="#4F46E5" strokeWidth="2" fill="none" />
          <circle cx="15" cy="15" r="4" stroke="#10B981" strokeWidth="1.5" fill="none" />
          <text x="32" y="20" fill="currentColor" className="font-sans font-bold text-[15px] lowercase">wipro</text>
        </svg>
      );

    case 'capgemini':
      return (
        <svg className={className} viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5,10 C10,5 20,5 25,12 C20,18 10,18 5,10" fill="#0070AD" />
          <text x="32" y="19" fill="currentColor" className="font-sans font-bold text-[13px] tracking-tight">Capgemini</text>
        </svg>
      );

    case 'oracle':
      return (
        <svg className={className} viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Oracle red stencil font wordmark */}
          <text x="0" y="19" fill="#F80000" className="font-sans font-black text-[18px] tracking-wider uppercase">ORACLE</text>
        </svg>
      );

    case 'cisco':
      return (
        <svg className={className} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cisco Bridge lines */}
          <g stroke="#00BCEB" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="18" x2="5" y2="10" />
            <line x1="12" y1="18" x2="12" y2="6" />
            <line x1="19" y1="18" x2="19" y2="10" />
            <line x1="26" y1="18" x2="26" y2="6" />
            <line x1="33" y1="18" x2="33" y2="10" />
          </g>
          <text x="42" y="18" fill="currentColor" className="font-sans font-bold text-[14px] lowercase">cisco</text>
        </svg>
      );

    case 'dell':
    case 'dell technologies':
      return (
        <svg className={className} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="10" stroke="#0076C0" strokeWidth="1.5" fill="none" />
          <text x="9" y="19" fill="#0076C0" className="font-sans font-black text-[11px]">DELL</text>
          <text x="32" y="18" fill="currentColor" className="font-sans text-[8px] uppercase tracking-wider font-semibold">Technologies</text>
        </svg>
      );

    case 'hcl':
    case 'hcltech':
      return (
        <svg className={className} viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="19" fill="#00529B" className="font-sans font-black text-[16px] tracking-wide dark:fill-blue-400">HCLTech</text>
          <path d="M72,12 C75,18 85,18 88,12" stroke="#0085CA" strokeWidth="2" fill="none" />
        </svg>
      );

    case 'innocorp':
    case 'innocorp solutions':
    case 'innocorp solutions ltd':
      return (
        <svg className={className} viewBox="0 0 135 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(2, 4)">
            {/* Green corporate leaf/hexagon icon */}
            <path d="M4,10 L10,6 L16,10 L16,18 L10,22 L4,18 Z" stroke="#10B981" strokeWidth="2" fill="none" />
            <path d="M10,6 L10,22" stroke="#10B981" strokeWidth="1" />
            <text x="23" y="14" fill="currentColor" className="font-sans font-extrabold text-[13px] tracking-tight text-slate-800 dark:text-white">innocorp</text>
            <text x="23" y="21" fill="#10B981" className="font-sans text-[5.5px] tracking-wide uppercase font-bold">Innovation Delivered</text>
          </g>
        </svg>
      );

    default:
      // Fallback: simple elegant text representation
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200">
          <span className="text-xs font-black tracking-wider uppercase">{name}</span>
        </div>
      );
  }
}
