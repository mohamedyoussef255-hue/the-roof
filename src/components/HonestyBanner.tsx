import React from 'react';
import { HeartHandshake } from 'lucide-react';

interface HonestyBannerProps {
  title: string;
  body: string;
  buttonText: string;
  onRecordClick: () => void;
}

export const HonestyBanner: React.FC<HonestyBannerProps> = ({
  title,
  body,
  buttonText,
  onRecordClick,
}) => {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 space-y-2 animate-in fade-in duration-300">
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
          <HeartHandshake className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-black text-amber-600 dark:text-amber-300">
            {title}
          </h4>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">
            {body}
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-0.5">
        <button
          onClick={onRecordClick}
          className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-1.5 rounded-xl shadow transition"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
