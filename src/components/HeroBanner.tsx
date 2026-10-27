import React from 'react';
import { Ticket } from 'lucide-react';

interface HeroBannerProps {
  bannerImg: string;
  badgeText: string;
  welcomeText: string;
  buttonText: string;
  onBookClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  bannerImg,
  badgeText,
  welcomeText,
  buttonText,
  onBookClick,
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 group">
      <div className="aspect-[16/9] w-full overflow-hidden bg-slate-800 relative">
        <img
          src={bannerImg}
          alt="بانر الرووف"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent"></div>
      </div>

      <div className="absolute bottom-3.5 right-3.5 left-3.5 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-[var(--brand-color)] text-white px-2.5 py-0.5 rounded-full shadow-md">
            {badgeText}
          </span>
          <h2 className="text-white font-black text-base mt-1 drop-shadow-md">
            {welcomeText}
          </h2>
        </div>
        <button
          onClick={onBookClick}
          className="bg-[var(--brand-color)] hover:opacity-90 active:scale-95 text-white text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-[var(--brand-glow)] transition-all"
        >
          <Ticket className="w-4 h-4" />
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
};
