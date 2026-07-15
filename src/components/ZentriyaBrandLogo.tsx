import React from 'react';

interface ZentriyaBrandLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  inverseText?: boolean; // If true, forces text to be white/gold instead of blue/gold (useful in dark headers/footers)
}

export default function ZentriyaBrandLogo({ 
  className = '', 
  iconOnly = false, 
  size = 'md',
  inverseText = false
}: ZentriyaBrandLogoProps) {
  
  // Icon dimensions based on size
  let iconSizeClass = 'w-9 h-9 text-xl';
  let titleTextClass = 'text-base sm:text-lg';
  let subtitleTextClass = 'text-[7px] sm:text-[9px] tracking-[0.12em] sm:tracking-[0.18em]';
  
  if (size === 'sm') {
    iconSizeClass = 'w-7.5 h-7.5 text-lg';
    titleTextClass = 'text-sm sm:text-base';
    subtitleTextClass = 'text-[6px] sm:text-[8px] tracking-[0.1em] sm:tracking-[0.15em]';
  } else if (size === 'lg') {
    iconSizeClass = 'w-10 h-10 text-2xl';
    titleTextClass = 'text-lg sm:text-xl';
    subtitleTextClass = 'text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em]';
  } else if (size === 'xl') {
    iconSizeClass = 'w-16 h-16 text-4xl';
    titleTextClass = 'text-2xl sm:text-3xl';
    subtitleTextClass = 'text-[10px] sm:text-[12px] tracking-[0.18em] sm:tracking-[0.22em]';
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {/* Official Zentriya Corporate Logo Image */}
      <img 
        src="/logo.png" 
        alt="Zentriya Logo" 
        className={`${iconSizeClass} object-contain shrink-0 group-hover:scale-105 transition-transform duration-300`}
      />

      {!iconOnly && (
        <div className="flex flex-col select-none">
          {/* ZENTRIYA wordmark */}
          <span 
            className={`font-black uppercase tracking-tight leading-none ${titleTextClass} ${
              inverseText 
                ? 'text-white' 
                : 'text-[#1E60F2] dark:text-white'
            }`}
          >
            ZENTRIYA
          </span>
          {/* Subtitle brand line */}
          <span 
            className={`uppercase font-extrabold mt-1 leading-none ${subtitleTextClass} text-[#E2952E]`}
          >
            IT Solutions Private Limited
          </span>
        </div>
      )}
    </div>
  );
}
