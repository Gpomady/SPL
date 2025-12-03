
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  subLabel?: string;
  icon?: LucideIcon;
  color: 'green' | 'red' | 'yellow' | 'purple' | 'gray' | 'blue';
  isActive?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subLabel, 
  icon: Icon, 
  color,
  isActive = false,
  onClick 
}) => {
  
  // Clean colors mapping (Backgrounds are white, accents via text/border)
  const colors = {
    green: { text: 'text-emerald-600', border: 'border-t-emerald-500', bg: 'bg-emerald-50' },
    red: { text: 'text-rose-600', border: 'border-t-rose-500', bg: 'bg-rose-50' },
    yellow: { text: 'text-amber-600', border: 'border-t-amber-500', bg: 'bg-amber-50' },
    purple: { text: 'text-fuchsia-600', border: 'border-t-fuchsia-500', bg: 'bg-fuchsia-50' },
    gray: { text: 'text-slate-500', border: 'border-t-slate-400', bg: 'bg-slate-50' },
    blue: { text: 'text-sky-600', border: 'border-t-sky-500', bg: 'bg-sky-50' },
  };

  const theme = colors[color];

  return (
    <div 
      onClick={onClick}
      className={`
        relative p-6 rounded-xl bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 
        hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[120px] group
        ${isActive ? `ring-1 ring-${color === 'green' ? 'emerald' : 'slate'}-400` : ''}
        border-t-4 ${theme.border}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
          <span className="text-3xl font-bold text-slate-800 mt-1 tracking-tight">{value}</span>
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${theme.bg} ${theme.text} opacity-80 group-hover:opacity-100 transition-opacity`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      
      {subLabel && (
        <div className="mt-auto">
           <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
             {subLabel}
           </span>
        </div>
      )}
    </div>
  );
};
