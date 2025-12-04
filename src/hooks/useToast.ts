import { useState, useCallback, useRef } from 'react';
import type { ToastProps } from '../components/ui/Toast';

export interface ToastOptions {
  type?: ToastProps['type'];
  title?: string;
  duration?: number;
  action?: ToastProps['action'];
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const idCounter = useRef(0);

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    const id = `toast-${++idCounter.current}`;
    const newToast: ToastProps = {
      id,
      message,
      type: options.type || 'info',
      title: options.title,
      duration: options.duration ?? 4000,
      action: options.action
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return showToast(message, { ...options, type: 'success' });
  }, [showToast]);

  const error = useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return showToast(message, { ...options, type: 'error' });
  }, [showToast]);

  const warning = useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return showToast(message, { ...options, type: 'warning' });
  }, [showToast]);

  const info = useCallback((message: string, options?: Omit<ToastOptions, 'type'>) => {
    return showToast(message, { ...options, type: 'info' });
  }, [showToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll
  };
}

export default useToast;
