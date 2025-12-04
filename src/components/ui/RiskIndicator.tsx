import React from 'react';
import { Shield, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import type { RiskLevel } from '../../types';

interface RiskIndicatorProps {
  level: RiskLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'dot' | 'bar' | 'icon';
  className?: string;
}

const riskConfig: Record<RiskLevel, { 
  label: string; 
  color: string; 
  bgColor: string; 
  barColor: string;
  icon: React.ElementType;
  value: number;
}> = {
  baixo: { 
    label: 'Baixo', 
    color: 'text-green-600', 
    bgColor: 'bg-green-100',
    barColor: 'bg-green-500',
    icon: Shield,
    value: 25
  },
  medio: { 
    label: 'Médio', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-100',
    barColor: 'bg-yellow-500',
    icon: AlertTriangle,
    value: 50
  },
  alto: { 
    label: 'Alto', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-100',
    barColor: 'bg-orange-500',
    icon: AlertCircle,
    value: 75
  },
  critico: { 
    label: 'Crítico', 
    color: 'text-red-600', 
    bgColor: 'bg-red-100',
    barColor: 'bg-red-500',
    icon: XCircle,
    value: 100
  }
};

const sizeClasses = {
  sm: {
    badge: 'px-2 py-0.5 text-xs',
    dot: 'w-2 h-2',
    bar: 'h-1.5',
    icon: 12
  },
  md: {
    badge: 'px-2.5 py-1 text-xs',
    dot: 'w-3 h-3',
    bar: 'h-2',
    icon: 16
  },
  lg: {
    badge: 'px-3 py-1.5 text-sm',
    dot: 'w-4 h-4',
    bar: 'h-2.5',
    icon: 20
  }
};

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  showLabel = true,
  size = 'md',
  variant = 'badge',
  className = ''
}) => {
  const config = riskConfig[level];
  const Icon = config.icon;
  const sizes = sizeClasses[size];
  
  if (variant === 'dot') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span 
          className={`rounded-full ${sizes.dot} ${config.barColor}`} 
          title={config.label}
        />
        {showLabel && (
          <span className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
        )}
      </div>
    );
  }
  
  if (variant === 'bar') {
    return (
      <div className={`${className}`}>
        {showLabel && (
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs font-medium ${config.color}`}>
              Risco {config.label}
            </span>
            <span className="text-xs text-slate-500">{config.value}%</span>
          </div>
        )}
        <div className={`w-full bg-slate-200 rounded-full ${sizes.bar}`}>
          <div 
            className={`${config.barColor} ${sizes.bar} rounded-full transition-all duration-500`}
            style={{ width: `${config.value}%` }}
          />
        </div>
      </div>
    );
  }
  
  if (variant === 'icon') {
    return (
      <div 
        className={`flex items-center gap-1.5 ${className}`}
        title={`Risco ${config.label}`}
      >
        <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
          <Icon size={sizes.icon} className={config.color} />
        </div>
        {showLabel && (
          <span className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
        )}
      </div>
    );
  }
  
  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${config.bgColor} ${config.color}
        ${sizes.badge}
        ${className}
      `}
    >
      <Icon size={sizes.icon - 2} />
      {showLabel && config.label}
    </span>
  );
};

export default RiskIndicator;
