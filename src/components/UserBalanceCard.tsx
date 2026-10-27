import React from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { User } from '../types';

interface UserBalanceCardProps {
  user: User;
  onPayClick: () => void;
  welcomeText: string;
  dueText: string;
  currencyText: string;
  payBtnText: string;
}

export const UserBalanceCard: React.FC<UserBalanceCardProps> = ({
  user,
  onPayClick,
  welcomeText,
  dueText,
  currencyText,
  payBtnText,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[var(--brand-color)]/10 border border-[var(--brand-color)]/25 flex items-center justify-center text-[var(--brand-color)] font-black text-sm">
          {user.avatar || user.name.charAt(0)}
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span>{welcomeText}</span>{' '}
            <span className="font-extrabold text-slate-900 dark:text-slate-100">
              {user.name}
            </span>
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {dueText}
            </span>
            <span className="text-base text-[var(--brand-color)]">
              {user.balance}
            </span>
            <span className="text-xs text-slate-400">{currencyText}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onPayClick}
        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition"
      >
        <CreditCard className="w-3.5 h-3.5" />
        <span>{payBtnText}</span>
      </button>
    </div>
  );
};
