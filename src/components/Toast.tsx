import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100',
    error: 'border-red-500/30 bg-red-500/10 text-red-950 dark:text-red-100',
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-950 dark:text-blue-100',
  };

  return (
    <div className="fixed top-4 inset-x-4 max-w-md mx-auto z-50 animate-in fade-in slide-in-from-top-3 duration-300 pointer-events-auto">
      <div
        className={`p-3.5 rounded-2xl border backdrop-blur-md shadow-2xl flex items-start justify-between gap-3 ${borders[toast.type]}`}
      >
        <div className="flex items-start gap-2.5">
          {icons[toast.type]}
          <div>
            {toast.title && (
              <h4 className="font-black text-xs">{toast.title}</h4>
            )}
            <p className="text-xs font-semibold leading-relaxed mt-0.5">
              {toast.message}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg opacity-70 hover:opacity-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
