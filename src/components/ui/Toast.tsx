import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id?: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toastConfig: Record<ToastType, { 
  icon: React.ElementType; 
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
}> = {
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-800',
    iconColor: 'text-emerald-500'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-500'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    iconColor: 'text-amber-500'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500'
  }
};

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 4000,
  onClose,
  action
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  
  const config = toastConfig[type];
  const Icon = config.icon;
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);
  
  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200);
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`
        flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border
        ${config.bgColor} ${config.borderColor}
        ${isLeaving ? 'animate-fade-out' : 'animate-slide-in'}
        max-w-md
      `}
      role="alert"
    >
      <Icon size={20} className={`shrink-0 mt-0.5 ${config.iconColor}`} />
      
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`font-semibold text-sm ${config.textColor}`}>
            {title}
          </p>
        )}
        <p className={`text-sm ${config.textColor} ${title ? 'mt-0.5' : ''}`}>
          {message}
        </p>
        
        {action && (
          <button
            onClick={action.onClick}
            className={`mt-2 text-sm font-medium underline hover:no-underline ${config.textColor}`}
          >
            {action.label}
          </button>
        )}
      </div>
      
      <button
        onClick={handleClose}
        className={`shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors ${config.textColor} opacity-60 hover:opacity-100`}
      >
        <X size={14} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const positionClasses: Record<string, string> = {
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-center': 'top-6 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2'
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = 'top-right'
}) => {
  return (
    <div className={`fixed z-50 flex flex-col gap-3 ${positionClasses[position]}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => toast.id && onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
