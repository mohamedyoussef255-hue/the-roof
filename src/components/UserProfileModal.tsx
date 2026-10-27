import React, { useState } from 'react';
import { X, UserPlus, Check, Users, Phone, Wallet } from 'lucide-react';
import { User } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  onAddUser: (name: string, phone: string) => void;
  currencyText: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  onSelectUser,
  onAddUser,
  currencyText,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddUser(newName.trim(), newPhone.trim() || '01000000000');
    setNewName('');
    setNewPhone('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--brand-color)]/10 text-[var(--brand-color)] flex items-center justify-center font-black text-lg border border-[var(--brand-color)]/20">
            {currentUser.avatar || currentUser.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">
              {currentUser.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>حسابك الحالي:</span>
              <span className="font-black text-[var(--brand-color)]">
                {currentUser.balance} {currencyText}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[var(--brand-color)]" />
              <span>أعضاء شلة الرووف</span>
            </span>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="text-xs text-[var(--brand-color)] font-bold flex items-center gap-1 hover:underline"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'إلغاء' : 'إضافة عضو'}</span>
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleAddSubmit} className="space-y-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 mb-3">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="اسم العضو الجديد (مثال: شريف فتحي)"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[var(--brand-color)]"
              />
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="رقم التليفون (اختياري)"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[var(--brand-color)]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[var(--brand-color)] text-white text-xs font-black rounded-xl shadow-md"
              >
                تأكيد إضافة العضو
              </button>
            </form>
          )}

          <div className="space-y-1.5 max-h-52 overflow-y-auto custom-scroll pr-1">
            {users.map((u) => {
              const isSelected = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs transition text-right ${
                    isSelected
                      ? 'bg-[var(--brand-color)]/10 text-slate-900 dark:text-white border border-[var(--brand-color)]/30 font-black'
                      : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                      {u.avatar || u.name.charAt(0)}
                    </span>
                    <div>
                      <div className="font-bold">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-[var(--brand-color)]">
                      {u.balance} {currencyText}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
