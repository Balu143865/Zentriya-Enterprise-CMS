import { useState, useEffect, useRef } from 'react';
import { Palette, X, Sun, Moon, Monitor, Laptop, Sparkles, Sliders, Check } from 'lucide-react';

// Define types for the aesthetics state
export type IconStyle = 'outline' | 'glow' | 'duotone';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface AestheticSettings {
  iconStyle: IconStyle;
  themeMode: ThemeMode;
  accentColor: string;
}

// 7 Beautiful brand accent colors precisely matched to the user's design image
export const ACCENT_COLORS = [
  { value: '#10b981', name: 'Emerald', label: 'Emerald Green' },
  { value: '#065f46', name: 'Forest', label: 'Forest Green' },
  { value: '#3b82f6', name: 'Blue', label: 'Electric Blue' },
  { value: '#06b6d4', name: 'Cyan', label: 'Tech Cyan' },
  { value: '#f59e0b', name: 'Orange', label: 'Vibrant Orange' },
  { value: '#8b5cf6', name: 'Purple', label: 'Royal Purple' },
  { value: '#f43f5e', name: 'Pink-Red', label: 'Sunset Red' }
];

// Color scale mappings for Tailwind v4 overrides
export const COLOR_PALETTES: Record<string, Record<number | string, string>> = {
  '#10b981': {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    850: '#022c22',
    950: '#022c22',
  },
  '#065f46': {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#065f46',
    600: '#047857',
    700: '#065f46',
    850: '#012117',
    950: '#011c13',
  },
  '#3b82f6': {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    850: '#172554',
    950: '#0f172a',
  },
  '#06b6d4': {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    850: '#083344',
    950: '#083344',
  },
  '#f59e0b': {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    850: '#451a03',
    950: '#451a03',
  },
  '#8b5cf6': {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    850: '#2e1065',
    950: '#1e1b4b',
  },
  '#f43f5e': {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    850: '#4c0519',
    950: '#4c0519',
  }
};

export default function AestheticControls() {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Read initial states from LocalStorage or default values
  const [iconStyle, setIconStyle] = useState<IconStyle>(() => {
    return (localStorage.getItem('aesthetic_icon_style') as IconStyle) || 'outline';
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('aesthetic_theme_mode') as ThemeMode) || 'system';
  });

  const [accentColor, setAccentColor] = useState<string>(() => {
    return localStorage.getItem('aesthetic_accent_color') || '#10b981';
  });

  // Handle outside click to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Apply properties dynamically whenever states change
  useEffect(() => {
    // 1. PROPAGATE ICON STYLE CLASS TO BODY
    const rootClass = document.documentElement.classList;
    rootClass.remove('icon-style-outline', 'icon-style-glow', 'icon-style-duotone');
    rootClass.add(`icon-style-${iconStyle}`);
    localStorage.setItem('aesthetic_icon_style', iconStyle);
  }, [iconStyle]);

  useEffect(() => {
    // 2. PROPAGATE THEME MODE (LIGHT, DARK, SYSTEM)
    const rootClass = document.documentElement.classList;
    
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        rootClass.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        rootClass.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      window.dispatchEvent(new Event('themeChanged'));
    };

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);
      
      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };
      mediaQuery.addEventListener('change', listener);
      localStorage.setItem('aesthetic_theme_mode', 'system');
      
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(themeMode === 'dark');
      localStorage.setItem('aesthetic_theme_mode', themeMode);
    }
  }, [themeMode]);

  useEffect(() => {
    // 3. PROPAGATE BRAND ACCENT COLOR BY OVERRIDING EMERALD PROPERTIES
    localStorage.setItem('aesthetic_accent_color', accentColor);
    const palette = COLOR_PALETTES[accentColor] || COLOR_PALETTES['#10b981'];
    
    // Inject custom CSS styles for SVG icons, theme properties, and dynamic elements
    const styleId = 'dynamic-aesthetic-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    // Set CSS Custom Properties in :root to override any emerald references instantly
    const properties = [
      `--brand-primary: ${accentColor};`,
      `--color-emerald-50: ${palette[50]};`,
      `--color-emerald-100: ${palette[100]};`,
      `--color-emerald-200: ${palette[200]};`,
      `--color-emerald-300: ${palette[300]};`,
      `--color-emerald-400: ${palette[400]};`,
      `--color-emerald-500: ${palette[500]};`,
      `--color-emerald-600: ${palette[600]};`,
      `--color-emerald-700: ${palette[700]};`,
      `--color-emerald-850: ${palette[850]};`,
      `--color-emerald-950: ${palette[950]};`,
    ].join('\n');

    // Custom glow and duotone SVG stylesheet rules
    const customRules = `
      :root {
        ${properties}
      }
      
      /* Global Lucide SVG custom styling rules */
      .icon-style-glow svg.lucide {
        filter: drop-shadow(0 0 3px ${accentColor}80);
        transition: filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .icon-style-duotone svg.lucide {
        fill: ${accentColor};
        fill-opacity: 0.18;
        stroke: currentColor;
        transition: fill 0.3s ease, fill-opacity 0.3s ease;
      }
      
      .icon-style-outline svg.lucide {
        fill: none;
        filter: none;
      }
    `;

    styleEl.innerHTML = customRules;
  }, [accentColor]);

  return (
    <>
      {/* 1. BACKDROP OVERLAY FOR CLOSING WHEN CLICKING ANYWHERE OUTSIDE */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 animate-fade-in sm:bg-black/35"
          onClick={() => setIsOpen(false)}
          id="aesthetic-controls-backdrop"
        />
      )}

      {/* 2. DYNAMIC BOTTOM SHEET / COMPACT DIALOG PANEL */}
      {isOpen && (
        <div 
          ref={popoverRef}
          className="fixed z-50 text-slate-200 bg-[#0c1222] text-left font-sans shadow-2xl shadow-black/95 transition-all duration-300
            /* Mobile: Bottom Sheet, full width, rounded-t, sliding up from bottom */
            bottom-0 left-0 right-0 w-full rounded-t-[24px] rounded-b-none border-t border-x border-[#1e293b] p-6 pb-10 animate-slide-up
            /* Desktop/Tablet override: Floating compact window on the bottom-right */
            sm:bottom-24 sm:right-6 sm:left-auto sm:w-96 sm:rounded-[24px] sm:border sm:p-6 sm:pb-6 sm:animate-scale-in"
          id="aesthetic-controls-panel"
        >
          {/* Top Grab Handle Indicator for Mobile */}
          <div className="w-12 h-1.5 bg-[#1e293b] rounded-full mx-auto mb-5 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-4 mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="text-emerald-500 w-5 h-5 animate-pulse" />
              <h3 className="font-display font-bold text-lg text-white tracking-tight">Aesthetic Controls</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close Aesthetic Controls"
              id="close-aesthetics-btn"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Section 1: Choose Icon Style */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-slate-400 block">
                1. Choose Icon Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'outline', label: 'Outline', icon: Laptop },
                  { id: 'glow', label: 'Glow', icon: Sparkles },
                  { id: 'duotone', label: 'Duotone', icon: Palette }
                ].map((style) => {
                  const Icon = style.icon;
                  const isSelected = iconStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setIconStyle(style.id as IconStyle)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#1e293b] border-white text-white shadow-md'
                          : 'bg-[#0f172a] border-[#1e293b] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                      id={`icon-style-btn-${style.id}`}
                    >
                      {/* Enforce manual styling on this inner icon preview to show style directly */}
                      <Icon 
                        size={16} 
                        className={`mb-1.5 ${
                          style.id === 'glow' ? 'drop-shadow-[0_0_3px_#10b981]' : ''
                        }`}
                        style={style.id === 'duotone' ? { fill: 'currentColor', fillOpacity: 0.2 } : {}}
                      />
                      <span className="text-xs font-semibold">{style.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Mode Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-slate-400 block">
                2. Mode Selector
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Monitor }
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = themeMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setThemeMode(mode.id as ThemeMode)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#1e293b] border-white text-white shadow-md'
                          : 'bg-[#0f172a] border-[#1e293b] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                      id={`theme-mode-btn-${mode.id}`}
                    >
                      <Icon size={16} className="mb-1.5" />
                      <span className="text-xs font-semibold">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Brand Accent Color */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-slate-400 block">
                3. Brand Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {ACCENT_COLORS.map((color) => {
                  const isSelected = accentColor === color.value;
                  return (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      style={{ backgroundColor: color.value }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-offset-[#0c1222] ring-white scale-110'
                          : 'hover:scale-105 opacity-90 hover:opacity-100'
                      }`}
                      title={color.label}
                      id={`accent-color-btn-${color.name.toLowerCase()}`}
                      aria-label={`Set brand color to ${color.label}`}
                    >
                      {isSelected && (
                        <Check size={14} className="text-white drop-shadow" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer status indicator */}
          <div className="border-t border-[#1e293b] mt-5 pt-3.5 text-center">
            <span className="text-[10px] font-mono text-slate-500 tracking-wider">
              Changes propagate instantly.
            </span>
          </div>
        </div>
      )}

      {/* 3. CAPSULE FLOATING ACTION BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#059669] hover:bg-[#10b981] text-white font-sans font-bold px-5 py-3 rounded-full shadow-lg shadow-[#10b981]/20 hover:scale-[1.04] active:scale-95 transition-all duration-300"
        style={{ backgroundColor: accentColor }}
        id="trigger-aesthetic-customizer-btn"
        aria-label="Customize Aesthetics"
      >
        <Palette size={18} className="animate-spin-slow" />
        <span className="text-sm font-bold tracking-tight">Customize Aesthetics</span>
      </button>
    </>
  );
}
