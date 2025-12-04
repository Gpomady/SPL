import React, { useState } from 'react';
import { Filter, X, ChevronDown, Check, Search } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'multi-select' | 'search' | 'date-range';
  options?: FilterOption[];
  placeholder?: string;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, string | string[] | { from?: string; to?: string }>;
  onChange: (id: string, value: string | string[] | { from?: string; to?: string }) => void;
  onClear: () => void;
  onApply?: () => void;
  variant?: 'inline' | 'dropdown' | 'sidebar';
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  values,
  onChange,
  onClear,
  onApply,
  variant = 'inline',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const activeFilterCount = Object.values(values).filter(v => 
    v && (typeof v === 'string' ? v !== '' && v !== 'all' : Array.isArray(v) ? v.length > 0 : v.from || v.to)
  ).length;
  
  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.id];
    
    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.id} className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === filter.id ? null : filter.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all
                ${value && value !== 'all' 
                  ? 'border-teal-500 bg-teal-50 text-teal-700' 
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}
              `}
            >
              <span>{filter.label}</span>
              {value && value !== 'all' && (
                <span className="font-medium">
                  : {filter.options?.find(o => o.value === value)?.label}
                </span>
              )}
              <ChevronDown size={14} className={`transition-transform ${openDropdown === filter.id ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === filter.id && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setOpenDropdown(null)}
                />
                <div className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[180px]">
                  {filter.options?.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onChange(filter.id, option.value);
                        setOpenDropdown(null);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-sm transition-colors
                        ${value === option.value 
                          ? 'bg-teal-50 text-teal-700' 
                          : 'text-slate-600 hover:bg-slate-50'}
                      `}
                    >
                      <span>{option.label}</span>
                      <div className="flex items-center gap-2">
                        {option.count !== undefined && (
                          <span className="text-xs text-slate-400">{option.count}</span>
                        )}
                        {value === option.value && <Check size={14} />}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      
      case 'multi-select':
        const selectedValues = (value as string[]) || [];
        return (
          <div key={filter.id} className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === filter.id ? null : filter.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all
                ${selectedValues.length > 0
                  ? 'border-teal-500 bg-teal-50 text-teal-700' 
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}
              `}
            >
              <span>{filter.label}</span>
              {selectedValues.length > 0 && (
                <span className="bg-teal-600 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                  {selectedValues.length}
                </span>
              )}
              <ChevronDown size={14} className={`transition-transform ${openDropdown === filter.id ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === filter.id && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setOpenDropdown(null)}
                />
                <div className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[200px] max-h-[300px] overflow-y-auto">
                  {filter.options?.map(option => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          const newValues = isSelected
                            ? selectedValues.filter(v => v !== option.value)
                            : [...selectedValues, option.value];
                          onChange(filter.id, newValues);
                        }}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 text-sm transition-colors
                          ${isSelected 
                            ? 'bg-teal-50 text-teal-700' 
                            : 'text-slate-600 hover:bg-slate-50'}
                        `}
                      >
                        <span>{option.label}</span>
                        <div className="flex items-center gap-2">
                          {option.count !== undefined && (
                            <span className="text-xs text-slate-400">{option.count}</span>
                          )}
                          <div className={`
                            w-4 h-4 rounded border flex items-center justify-center
                            ${isSelected 
                              ? 'bg-teal-600 border-teal-600 text-white' 
                              : 'border-slate-300'}
                          `}>
                            {isSelected && <Check size={10} />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );
      
      case 'search':
        return (
          <div key={filter.id} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={(value as string) || ''}
              onChange={(e) => onChange(filter.id, e.target.value)}
              placeholder={filter.placeholder || `Buscar ${filter.label.toLowerCase()}...`}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-64"
            />
          </div>
        );
      
      case 'date-range':
        const dateValue = (value as { from?: string; to?: string }) || {};
        return (
          <div key={filter.id} className="flex items-center gap-2">
            <span className="text-sm text-slate-600">{filter.label}:</span>
            <input
              type="date"
              value={dateValue.from || ''}
              onChange={(e) => onChange(filter.id, { ...dateValue, from: e.target.value })}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            <span className="text-slate-400">até</span>
            <input
              type="date"
              value={dateValue.to || ''}
              onChange={(e) => onChange(filter.id, { ...dateValue, to: e.target.value })}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        );
      
      default:
        return null;
    }
  };
  
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all
            ${activeFilterCount > 0
              ? 'border-teal-500 bg-teal-50 text-teal-700'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}
          `}
        >
          <Filter size={16} />
          <span>Filtros</span>
          {activeFilterCount > 0 && (
            <span className="bg-teal-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-20 min-w-[320px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Filtros</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={onClear}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    Limpar tudo
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {filters.map(renderFilter)}
              </div>
              
              {onApply && (
                <button
                  onClick={() => {
                    onApply();
                    setIsOpen(false);
                  }}
                  className="w-full mt-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  Aplicar Filtros
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
  
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {filters.map(renderFilter)}
      
      {activeFilterCount > 0 && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <X size={14} />
          <span>Limpar filtros</span>
        </button>
      )}
    </div>
  );
};

export default FilterPanel;
