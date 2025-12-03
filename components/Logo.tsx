import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  collapsed?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'dark', collapsed = false }) => {
  const textSize = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-3xl' : 'text-5xl';
  // Jungle Teal for dark text, White for light
  const colorClass = variant === 'light' ? 'text-white' : 'text-[#0f766e]'; 
  const accentClass = variant === 'light' ? 'text-emerald-300' : 'text-emerald-600';
  
  if (collapsed) {
    return (
      <div className={`flex flex-col items-center justify-center font-bold tracking-tighter ${colorClass} text-2xl`}>
        <div className="relative flex items-center justify-center mb-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`w-8 h-8 ${accentClass}`}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M16 8L2 22" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 15H9" />
            </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 select-none">
      <div className={`flex items-center gap-1 font-bold tracking-tighter ${textSize} ${colorClass} leading-none`}>
        <div className="relative flex items-center justify-center mr-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`w-[0.9em] h-[0.9em] ${accentClass}`}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M16 8L2 22" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 15H9" />
            </svg>
        </div>
        <span>SPL</span>
        <div className={`w-[1px] bg-slate-300 h-[0.8em] mx-2 opacity-50`}></div>
      </div>
      <div className="flex flex-col justify-center">
           <span className={`text-[0.55em] font-bold uppercase tracking-wider leading-none text-slate-500`}>Sistema</span>
           <span className={`text-[0.55em] font-bold uppercase tracking-wider leading-none text-slate-500`}>Previsão</span>
           <span className={`text-[0.55em] font-bold uppercase tracking-wider leading-none ${accentClass}`}>Amazônia</span>
      </div>
    </div>
  );
};