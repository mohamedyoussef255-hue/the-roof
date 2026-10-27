import React from 'react';
import { Calendar, Clock, MapPin, Check, UserPlus, Users } from 'lucide-react';
import { EventItem, User } from '../../types';

interface EventsTabProps {
  currentUser: User;
  events: EventItem[];
  onToggleRsvp: (eventId: string) => void;
  t: Record<string, string>;
}

export const EventsTab: React.FC<EventsTabProps> = ({
  currentUser,
  events,
  onToggleRsvp,
  t,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-base text-slate-900 dark:text-white">
            {t.events_title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.events_desc}
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {events.map((ev) => {
          const isGoing = ev.attendees.includes(currentUser.name);

          return (
            <div
              key={ev.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3.5 shadow-sm hover:border-[var(--brand-color)]/60 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    {ev.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-bold text-[var(--brand-color)]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ev.date}</span>
                    </span>
                    {ev.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ev.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                <span className="shrink-0 text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300 font-black border border-slate-200 dark:border-slate-700">
                  {ev.attendees.length} {t.attendees_count}
                </span>
              </div>

              {/* Attendees list preview */}
              {ev.attendees.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                  <Users className="w-3.5 h-3.5 text-[var(--brand-color)] shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    الحاضرين:{' '}
                  </span>
                  <span className="truncate">{ev.attendees.join(' ، ')}</span>
                </div>
              )}

              {/* RSVP Action */}
              <button
                onClick={() => onToggleRsvp(ev.id)}
                className={`w-full py-2.5 px-4 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm ${
                  isGoing
                    ? 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-[var(--brand-color)] text-slate-800 dark:text-slate-200 hover:text-white'
                }`}
              >
                {isGoing ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.already_going}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{t.going_btn}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
