import React from 'react';
import { IndustryPartner } from '../types';

export function renderPartnerLogo(partner: IndustryPartner, customClass = "max-h-full max-w-full object-contain"): React.ReactNode {
  const name = partner.company_name.toLowerCase();

  // 1. TATA CONSULTANCY SERVICES (TCS)
  if (name.includes('tata') || name.includes('tcs')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="tcs-svg-logo"
      >
        <g transform="translate(10, 15)">
          <ellipse cx="35" cy="35" rx="32" ry="26" fill="#1b365d" />
          <path d="M35 15 C41 15, 48 22, 49 34 C50 46, 43 52, 35 52 C27 52, 20 46, 21 34 C22 22, 29 15, 35 15 Z" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          <path d="M35 15 L35 52" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        </g>
        <text x="90" y="46" fill="#1b365d" className="font-sans font-extrabold text-[30px] tracking-tight dark:fill-white">TATA</text>
        <text x="90" y="70" fill="#1b365d" className="font-sans font-bold text-[14px] tracking-[0.1em] text-slate-500 dark:fill-slate-300">CONSULTANCY SERVICES</text>
      </svg>
    );
  }

  // 2. COGNIZANT
  if (name.includes('cognizant')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="cognizant-svg-logo"
      >
        <g transform="translate(10, 15)">
          <path d="M30 15 C15 15, 8 26, 8 38 C8 50, 15 62, 30 62 C45 62, 52 50, 52 38 C52 26, 60 15, 75 15 C90 15, 98 26, 98 38 C98 50, 90 62, 75 62" stroke="#0033A0" strokeWidth="9" strokeLinecap="round" className="dark:stroke-blue-400" />
          <circle cx="75" cy="38" r="9" fill="#00B5E2" />
        </g>
        <text x="125" y="55" fill="#0033A0" className="font-sans font-black text-[32px] tracking-tight dark:fill-white">cognizant</text>
      </svg>
    );
  }

  // 3. WIPRO
  if (name.includes('wipro')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="wipro-svg-logo"
      >
        <g transform="translate(40, 50)">
          <circle cx="0" cy="0" r="6" fill="#1F4E9F" />
          <circle cx="-12" cy="-12" r="4" fill="#E41E26" />
          <circle cx="12" cy="-12" r="4" fill="#00A550" />
          <circle cx="-12" cy="12" r="4" fill="#F48221" />
          <circle cx="12" cy="12" r="4" fill="#29B3E4" />
          <circle cx="0" cy="-24" r="5" fill="#FBC02D" />
          <circle cx="0" cy="24" r="5" fill="#3F51B5" />
          <circle cx="-24" cy="0" r="5" fill="#E040FB" />
          <circle cx="24" cy="0" r="5" fill="#4CAF50" />
          <circle cx="-17" cy="-17" r="4" fill="#00E5FF" />
          <circle cx="17" cy="-17" r="4" fill="#FF5252" />
          <circle cx="-17" cy="17" r="4" fill="#FFC107" />
          <circle cx="17" cy="17" r="4" fill="#8E24AA" />
        </g>
        <text x="95" y="54" fill="#1F4E9F" className="font-sans font-bold text-[36px] tracking-tight dark:fill-white">wipro</text>
        <text x="95" y="70" fill="#757575" className="font-sans text-[10px] tracking-[0.2em] uppercase dark:fill-slate-400">Applying Thought</text>
      </svg>
    );
  }

  // 4. HCLTECH / HCL
  if (name.includes('hcl')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="hcl-svg-logo"
      >
        <g fill="#005691">
          <path d="M15 20 H28 V43 H48 V20 H61 V80 H48 V56 H28 V80 H15 Z" className="dark:fill-blue-400" />
          <path d="M102 20 H74 C68 20, 63 24, 63 31 V69 C63 76, 68 80, 74 80 H102 V66 H80 V34 H102 Z" className="dark:fill-blue-400" />
          <path d="M110 20 H123 V66 H142 V80 H110 Z" className="dark:fill-blue-400" />
          <path d="M152 20 H180 V31 H170 V80 H157 V31 H152 Z" fill="#009FDF" className="dark:fill-emerald-400" />
          <path d="M184 41 C184 35, 188 31, 194 31 H214 V41 H197 V47 H214 V57 H197 V67 H214 V80 H194 C188 80, 184 76, 184 69 Z" fill="#009FDF" className="dark:fill-emerald-400" />
          <path d="M219 41 C219 35, 223 31, 229 31 H245 C251 31, 255 35, 255 41 V80 H242 V44 H232 V80 H219 Z" fill="#009FDF" className="dark:fill-emerald-400" />
        </g>
      </svg>
    );
  }

  // 5. MICROSOFT
  if (name.includes('microsoft')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="microsoft-svg-logo"
      >
        <g transform="translate(10, 15)">
          {/* 4-color Microsoft grid */}
          <rect x="15" y="15" width="22" height="22" fill="#F25022" />
          <rect x="41" y="15" width="22" height="22" fill="#7FBA00" />
          <rect x="15" y="41" width="22" height="22" fill="#00A4EF" />
          <rect x="41" y="41" width="22" height="22" fill="#FFB900" />
        </g>
        <text x="85" y="58" fill="#737373" className="font-sans font-semibold text-[32px] tracking-tight dark:fill-white">Microsoft</text>
      </svg>
    );
  }

  // 6. GOOGLE
  if (name.includes('google')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="google-svg-logo"
      >
        <g transform="translate(15, 23) scale(0.95)">
          {/* Modern Google G symbol */}
          <path d="M43.2 24.5c0-1.7-.1-3.3-.4-4.9H22v9.3h11.9c-.5 2.7-2 5-4.3 6.6l6.7 5.2c3.9-3.6 6.2-8.9 6.2-16.2z" fill="#4285F4" />
          <path d="M22 46c6.2 0 11.4-2.1 15.2-5.6l-6.7-5.2c-1.9 1.3-4.3 2-6.5 2-5 0-9.2-3.4-10.7-8l-6.9 5.3C10.2 41.6 15.6 46 22 46z" fill="#34A853" />
          <path d="M11.3 29.2c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8V16.3H4.4C3 19.1 2.2 22.3 2.2 25.4s.8 6.3 2.2 9.1l6.9-5.3z" fill="#FBBC05" />
          <path d="M22 13.6c3.4 0 6.4 1.2 8.8 3.4l6.6-6.6C33.4 6.8 28.2 4.8 22 4.8 15.6 4.8 10.2 9.2 6.4 16.3l6.9 5.3c1.5-4.6 5.7-8 10.7-8z" fill="#EA4335" />
        </g>
        <text x="75" y="58" className="font-sans font-semibold text-[32px] tracking-tight">
          <tspan fill="#4285F4">G</tspan>
          <tspan fill="#EA4335">o</tspan>
          <tspan fill="#FBBC05">o</tspan>
          <tspan fill="#4285F4">g</tspan>
          <tspan fill="#34A853">l</tspan>
          <tspan fill="#EA4335">e</tspan>
        </text>
      </svg>
    );
  }

  // 7. AMAZON WEB SERVICES (AWS)
  if (name.includes('amazon') || name.includes('aws')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="aws-svg-logo"
      >
        <g transform="translate(15, 12)">
          <text x="0" y="44" fill="#232F3E" className="font-sans font-black text-[38px] tracking-tighter dark:fill-white">aws</text>
          {/* AWS Smile Arrow */}
          <path d="M12 48 C 22 55, 42 55, 55 46" stroke="#FF9900" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M55 46 L50 42 M55 46 L57 51" stroke="#FF9900" strokeWidth="4" strokeLinecap="round" />
        </g>
        <text x="95" y="44" fill="#232F3E" className="font-sans font-extrabold text-[24px] tracking-tight dark:fill-white">amazon</text>
        <text x="95" y="64" fill="#FF9900" className="font-sans font-bold text-[12px] tracking-[0.15em]">WEB SERVICES</text>
      </svg>
    );
  }

  // 8. IBM
  if (name.includes('ibm')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="ibm-svg-logo"
      >
        <defs>
          <mask id="ibm-stripes-mask">
            <rect width="320" height="100" fill="white" />
            <rect x="0" y="0" width="320" height="4" fill="black" />
            <rect x="0" y="11" width="320" height="4" fill="black" />
            <rect x="0" y="22" width="320" height="4" fill="black" />
            <rect x="0" y="33" width="320" height="4" fill="black" />
            <rect x="0" y="44" width="320" height="4" fill="black" />
            <rect x="0" y="55" width="320" height="4" fill="black" />
            <rect x="0" y="66" width="320" height="4" fill="black" />
            <rect x="0" y="77" width="320" height="4" fill="black" />
            <rect x="0" y="88" width="320" height="4" fill="black" />
          </mask>
        </defs>
        <g mask="url(#ibm-stripes-mask)" transform="translate(20, 15)">
          <text x="10" y="56" fill="#006699" className="font-sans font-black text-[64px] tracking-normal dark:fill-blue-400">IBM</text>
        </g>
      </svg>
    );
  }

  // 9. INFOSYS
  if (name.includes('infosys')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="infosys-svg-logo"
      >
        <g transform="translate(10, 15)">
          <text x="10" y="52" fill="#007CC3" className="font-sans font-bold text-[44px] tracking-tight italic dark:fill-blue-400">Infosys</text>
          <path d="M15 62 L155 62" stroke="#007CC3" strokeWidth="4" strokeLinecap="round" className="dark:stroke-blue-400" />
          <text x="18" y="78" fill="#757575" className="font-mono text-[9px] tracking-[0.25em] dark:fill-slate-400">POWERED BY INTELLECT</text>
        </g>
      </svg>
    );
  }

  // 10. ACCENTURE
  if (name.includes('accenture')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="accenture-svg-logo"
      >
        <g transform="translate(15, 15)">
          <text x="10" y="58" fill="#000000" className="font-sans font-medium text-[38px] tracking-tight dark:fill-white">accenture</text>
          <path d="M136 18 L145 23 L136 28" stroke="#A100FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </svg>
    );
  }

  // 11. CAPGEMINI
  if (name.includes('capgemini')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="capgemini-svg-logo"
      >
        <g transform="translate(10, 15)">
          <g transform="translate(10, 10)">
            <path d="M25 5 C15 15, 5 25, 5 35 C5 45, 15 45, 25 40 C35 45, 45 45, 45 35 C45 25, 35 15, 25 5 Z" fill="#0070AD" />
            <path d="M25 40 L25 50" stroke="#0070AD" strokeWidth="6" strokeLinecap="round" />
          </g>
          <text x="75" y="44" fill="#001F52" className="font-sans font-black text-[28px] tracking-tight dark:fill-white">Capgemini</text>
          <text x="75" y="62" fill="#0070AD" className="font-sans font-medium text-[10px] tracking-[0.1em] dark:fill-blue-400">CONSULTING.TECHNOLOGY.OUTSOURCING</text>
        </g>
      </svg>
    );
  }

  // 12. ORACLE
  if (name.includes('oracle')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="oracle-svg-logo"
      >
        <g transform="translate(10, 15)">
          <text x="15" y="58" fill="#F80000" className="font-sans font-extrabold text-[46px] tracking-tighter uppercase dark:fill-red-500">Oracle</text>
        </g>
      </svg>
    );
  }

  // 13. CISCO
  if (name.includes('cisco')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="cisco-svg-logo"
      >
        <g transform="translate(10, 15)">
          <g stroke="#049FD9" strokeWidth="4" strokeLinecap="round">
            <line x1="20" y1="35" x2="20" y2="45" />
            <line x1="28" y1="28" x2="28" y2="45" />
            <line x1="36" y1="20" x2="36" y2="45" />
            <line x1="44" y1="15" x2="44" y2="45" />
            <line x1="52" y1="15" x2="52" y2="45" />
            <line x1="60" y1="20" x2="60" y2="45" />
            <line x1="68" y1="28" x2="68" y2="45" />
            <line x1="76" y1="35" x2="76" y2="45" />
          </g>
          <text x="95" y="44" fill="#005073" className="font-sans font-black text-[36px] tracking-tight dark:fill-white">cisco</text>
        </g>
      </svg>
    );
  }

  // 14. DELL TECHNOLOGIES
  if (name.includes('dell')) {
    return (
      <svg 
        viewBox="0 0 320 100" 
        className={customClass}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="dell-svg-logo"
      >
        <g transform="translate(10, 15)">
          <circle cx="35" cy="35" r="28" stroke="#0076CE" strokeWidth="3" fill="none" />
          <g fill="#0076CE" className="dark:fill-blue-400">
            <path d="M19 25 H25 C29 25, 31 27, 31 31 V39 C31 43, 29 45, 25 45 H19 Z M22 28 V42 H24 C26 42, 28 41, 28 39 V31 C28 29, 26 28, 24 28 Z" />
            <g transform="translate(29, 35) rotate(-30) translate(-29, -35)">
              <path d="M26 25 H32 V28 H29 V33 H31 V36 H29 V41 H32 V44 H26 Z" />
            </g>
            <path d="M37 25 H40 V42 H45 V45 H37 Z" />
            <path d="M47 25 H50 V42 H55 V45 H47 Z" />
          </g>
          <text x="80" y="40" fill="#0076CE" className="font-sans font-bold text-[18px] tracking-tight dark:fill-white">DELL</text>
          <text x="80" y="58" fill="#5F6368" className="font-sans font-medium text-[13px] tracking-[0.1em] dark:fill-slate-300">Technologies</text>
        </g>
      </svg>
    );
  }

  // Fallback to standard <img> tag
  return (
    <img 
      src={partner.logo} 
      alt={partner.company_name} 
      className={customClass}
      referrerPolicy="no-referrer"
      loading="lazy"
    />
  );
}
