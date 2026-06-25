import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (text: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((text: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast container floating layout */}
      <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div 
            id={`toast-${t.id}`}
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-xl border animate-slide-in text-sm backdrop-blur-md ${
              t.type === 'success' ? 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200' :
              t.type === 'error' ? 'bg-red-50/95 dark:bg-red-950/90 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200' :
              t.type === 'warning' ? 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200' :
              'bg-blue-50/95 dark:bg-blue-950/90 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-200'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
            {t.type === 'error' && <AlertTriangle size={18} className="text-red-500 shrink-0" />}
            {t.type === 'warning' && <AlertTriangle size={18} className="text-amber-500 shrink-0" />}
            {t.type === 'info' && <Info size={18} className="text-blue-500 shrink-0" />}
            
            <span className="flex-1 font-medium">{t.text}</span>
            
            <button 
              onClick={() => removeToast(t.id)}
              className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
