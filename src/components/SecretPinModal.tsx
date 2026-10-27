import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface SecretPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
  t: Record<string, string>;
}

export const SecretPinModal: React.FC<SecretPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin,
  t,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.trim() === correctPin) {
      setPin('');
      setErrorMsg('');
      onSuccess();
    } else {
      setErrorMsg('رمز الدخول غير صحيح! حاول مرة تانية.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xs w-full p-6 space-y-4 shadow-2xl text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <h3 className="font-black text-base text-slate-900 dark:text-white">
            {t.admin_pin_title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.admin_pin_desc}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <input
            type="password"
            maxLength={10}
            autoFocus
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setErrorMsg('');
            }}
            placeholder="••••"
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-3 py-3 text-center text-xl tracking-[0.4em] font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[var(--brand-color)]"
          />

          {errorMsg && (
            <p className="text-xs text-red-500 font-bold animate-pulse">
              {errorMsg}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs rounded-xl hover:bg-slate-200 transition"
            >
              {t.btn_cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[var(--brand-color)] text-white font-black text-xs rounded-xl shadow-md shadow-[var(--brand-glow)] active:scale-95 transition"
            >
              {t.btn_enter}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
