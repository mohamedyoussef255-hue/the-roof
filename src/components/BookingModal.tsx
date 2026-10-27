import React, { useState } from 'react';
import {
  X,
  Ticket,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  Sparkles,
  Send,
  Coffee
} from 'lucide-react';
import { User, TicketBooking } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  ticketPrice: number;
  onSubmitBooking: (bookingData: {
    bookingDate: string;
    slotTime: string;
    guestsCount: number;
    notes: string;
  }) => void;
  currencyText: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  ticketPrice,
  onSubmitBooking,
  currencyText,
}) => {
  const [bookingDate, setBookingDate] = useState('اليوم');
  const [slotTime, setSlotTime] = useState('08:00 م');
  const [guestsCount, setGuestsCount] = useState(1);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const quickTimes = [
    '06:00 م',
    '07:00 م',
    '08:00 م',
    '09:00 م',
    '10:00 م',
    '11:00 م',
    '12:00 ص',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitBooking({
      bookingDate,
      slotTime,
      guestsCount: Math.max(1, guestsCount),
      notes: notes.trim(),
    });
    onClose();
  };

  const totalCost = ticketPrice * guestsCount;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scroll">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--brand-color)]/10 text-[var(--brand-color)] flex items-center justify-center font-black border border-[var(--brand-color)]/20 shadow-inner">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>حجز تيكيت وقعدة الرووف</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              طلب حجز مسبق واعتماد من إدارة الرووف
            </p>
          </div>
        </div>

        {/* Policy & Important Note Box */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-black text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>نظام الحجز والقبول:</span>
          </div>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
            ١. بعد إرسال طلبك، يقوم <strong className="text-amber-600 dark:text-amber-300">مدير النظام بمراجعة وقبول الحجز</strong>.
            <br />
            ٢. <strong className="text-amber-600 dark:text-amber-300">يجب تأكيد الحجز قبل الحضور بساعة على الأقل</strong> من التطبيق لضمان وتثبيت جلستك والتكييف.
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Member Name */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">الحجز باسم:</span>
            <span className="font-black text-slate-800 dark:text-white">
              {currentUser.name}
            </span>
          </div>

          {/* Date Selector */}
          <div>
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--brand-color)]" />
              <span>يوم القعدة:</span>
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['اليوم', 'غداً', 'بعد غد'].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setBookingDate(d)}
                  className={`py-2 rounded-xl font-black border transition ${
                    bookingDate === d
                      ? 'bg-[var(--brand-color)] text-white border-[var(--brand-color)] shadow-md'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Slot Time */}
          <div>
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--brand-color)]" />
              <span>ميعاد الحضور المتوقع:</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-xs mb-2">
              {quickTimes.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setSlotTime(t)}
                  className={`py-1.5 rounded-xl text-[11px] font-black border transition ${
                    slotTime === t
                      ? 'bg-[var(--brand-color)] text-white border-[var(--brand-color)] shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              placeholder="أو اكتب وقتاً مخصصاً (مثال: 07:30 م)"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Guests Count */}
          <div>
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[var(--brand-color)]" />
              <span>عدد الأفراد:</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-black text-sm flex items-center justify-center border border-slate-200 dark:border-slate-700"
                >
                  -
                </button>
                <span className="w-10 text-center font-black text-sm text-slate-800 dark:text-white">
                  {guestsCount}
                </span>
                <button
                  type="button"
                  onClick={() => setGuestsCount(guestsCount + 1)}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-black text-sm flex items-center justify-center border border-slate-200 dark:border-slate-700"
                >
                  +
                </button>
              </div>
              <div className="text-xs text-slate-500">
                <span>الإجمالي: </span>
                <span className="font-black text-[var(--brand-color)]">
                  {totalCost} {currencyText}
                </span>
                <span className="text-[10px] block text-slate-400">
                  ({ticketPrice} ج.م للفرد)
                </span>
              </div>
            </div>
          </div>

          {/* Special Requests / Notes */}
          <div>
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 mb-1 block">
              ملاحظات أو طلبات خاصة (اختياري):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: ترابيزة تكييف، تجهيز دراعين بلايستيشن، شاي بنعناع..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[var(--brand-color)] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-[var(--brand-glow)] active:scale-98 transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>إرسال طلب الحجز لمدير النظام</span>
          </button>
        </form>
      </div>
    </div>
  );
};
