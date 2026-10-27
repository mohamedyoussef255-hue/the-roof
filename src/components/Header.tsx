import React, { useRef } from 'react';
import { Coffee, Sun, Moon, User as UserIcon, Sparkles } from 'lucide-react';
import { AppData, User } from '../types';

interface HeaderProps {
  appData: AppData;
  onOpenAdminSecret: () => void;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onOpenUserModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appData,
  onOpenAdminSecret,
  onToggleTheme,
  onToggleLang,
  onOpenUserModal,
}) => {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      onOpenAdminSecret();
    }
  };

  const isDark = appData.config.darkMode;
  const lang = appData.config.lang;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo with 5 clicks secret trigger */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer select-none group active:scale-95 transition-transform"
          title="اضغط ٥ مرات لفتح لوحة المدير السرية"
        >
          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-[var(--brand-color)] flex items-center justify-center shadow-lg shadow-[var(--brand-glow)] ring-2 ring-orange-500/30 group-hover:ring-orange-500 transition-all">
            {appData.config.logoImg ? (
              <img
                src={appData.config.logoImg}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Coffee className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h1 className="font-black text-lg text-slate-900 dark:text-white tracking-wide flex items-center gap-1.5 leading-tight">
              {appData.config.appName}
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              {appData.config.appSubtitle}
            </p>
          </div>
        </div>

        {/* Controls: Lang, Theme & User Switch */}
        <div className="flex items-center gap-1.5">
          {/* Lang button */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* User Profile / Switch */}
          <button
            onClick={onOpenUserModal}
            className="flex items-center gap-1.5 p-1.5 pr-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
            title="تبديل العضو"
          >
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[70px] truncate hidden xs:inline">
              {appData.currentUser.name.split(' ')[0]}
            </span>
            <div className="w-6 h-6 rounded-lg bg-[var(--brand-color)] text-white flex items-center justify-center text-xs font-black">
              {appData.currentUser.avatar || appData.currentUser.name.charAt(0)}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
