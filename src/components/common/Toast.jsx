import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-500',
    error: 'border-rose-500',
    warning: 'border-amber-500',
    info: 'border-blue-500'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-xl border-l-4 transition-all duration-300 transform translate-y-0 opacity-100 max-w-md border border-slate-200">
      {icons[toast.type] || icons.info}
      <div className="text-sm font-medium text-slate-800 pr-2">
        {toast.message}
      </div>
    </div>
  );
};
