import React from 'react';
import {
  Ticket,
  GlassWater,
  MessagesSquare,
  Calendar,
  Wallet,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  hasUnreadChat?: boolean;
  t: Record<string, string>;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  hasUnreadChat = false,
  t,
}) => {
  const tabs = [
    { id: 'ticketTab', label: t.nav_ticket, icon: <Ticket className="w-5 h-5" /> },
    { id: 'barTab', label: t.nav_bar, icon: <GlassWater className="w-5 h-5" /> },
    {
      id: 'chatTab',
      label: t.nav_chat,
      icon: <MessagesSquare className="w-5 h-5" />,
      hasBadge: hasUnreadChat,
    },
    { id: 'eventsTab', label: t.nav_events, icon: <Calendar className="w-5 h-5" /> },
    { id: 'payTab', label: t.nav_pay, icon: <Wallet className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2.5 transition-colors shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 px-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 rounded-2xl relative transition-all active:scale-95 ${
                isActive
                  ? 'text-[var(--brand-color)] font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-semibold'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.hasBadge && (
                  <span className="w-2 h-2 rounded-full bg-[var(--brand-color)] absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-color)] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
