import React from 'react';
import { X } from 'lucide-react';
import { Story } from '../types';

interface StoryViewerModalProps {
  story: Story | null;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  onClose,
}) => {
  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-3 animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="absolute top-5 left-5 z-50 bg-slate-800/90 p-2.5 rounded-full text-white hover:bg-slate-700 transition"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="w-full max-w-sm h-full max-h-[82vh] relative rounded-3xl overflow-hidden bg-slate-900 flex items-center justify-center shadow-2xl border border-slate-800">
        {story.type === 'video' ? (
          <video
            src={story.url}
            autoPlay
            controls
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src={story.url}
            alt={story.title}
            className="w-full h-full object-contain"
          />
        )}

        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white">
          <h4 className="font-extrabold text-sm drop-shadow">{story.title}</h4>
        </div>
      </div>
    </div>
  );
};
