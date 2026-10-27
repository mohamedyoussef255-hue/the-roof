import React from 'react';
import { Sparkles, Play } from 'lucide-react';
import { Story } from '../types';

interface StoriesBarProps {
  stories: Story[];
  title: string;
  onSelectStory: (story: Story) => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  title,
  onSelectStory,
}) => {
  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex items-center justify-between text-xs px-1">
        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[var(--brand-color)]" />
          <span>{title}</span>
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 custom-scroll">
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => onSelectStory(story)}
            className="shrink-0 w-16 flex flex-col items-center gap-1 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-500 group-hover:scale-105 transition-transform shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center relative">
                {story.type === 'video' ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                ) : (
                  <img
                    src={story.url}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <span className="text-[10px] text-slate-700 dark:text-slate-300 truncate w-full text-center font-bold">
              {story.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
