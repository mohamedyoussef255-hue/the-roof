import React from 'react';
import {
  Ticket,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Calendar,
  Hourglass,
  CheckCheck,
  XCircle,
  PlusCircle,
  Coffee
} from 'lucide-react';
import { AttendanceRecord, TicketBooking, User } from '../../types';

interface TicketTabProps {
  currentUser: User;
  ticketPrice: number;
  attendance: AttendanceRecord[];
  bookings: TicketBooking[];
  onOpenBookingModal: () => void;
  onConfirmBooking: (bookingId: string) => void;
  lang: 'ar' | 'en';
  t: Record<string, string>;
}

export const TicketTab: React.FC<TicketTabProps> = ({
  currentUser,
  ticketPrice,
  attendance,
  bookings,
  onOpenBookingModal,
  onConfirmBooking,
  lang,
  t,
}) => {
  const todayStr = new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US');
  const todayAttendance = attendance.filter((a) => a.date === todayStr);

  // User's active booking for today or latest pending/approved/confirmed
  const userBookings = bookings.filter((b) => b.userId === currentUser.id);
  const activeBooking = userBookings.length > 0 ? userBookings[0] : null;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Active Booking Status Card (If user has a booking) */}
      {activeBooking && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--brand-color)]" />
              <h4 className="font-black text-sm text-slate-900 dark:text-white">
                حالة حجزك الأخير
              </h4>
            </div>

            {/* Status Badges */}
            {activeBooking.status === 'pending' && (
              <span className="text-xs bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-500/30">
                <Hourglass className="w-3.5 h-3.5 animate-spin" />
                <span>بانتظار قبول المدير</span>
              </span>
            )}
            {activeBooking.status === 'approved' && (
              <span className="text-xs bg-sky-500/15 text-sky-600 dark:text-sky-400 font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-sky-500/30 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تم قبول الحجز (جاهز للتأكيد)</span>
              </span>
            )}
            {activeBooking.status === 'confirmed' && (
              <span className="text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-500/30">
                <CheckCheck className="w-3.5 h-3.5" />
                <span>حجز مؤكد وحاضر</span>
              </span>
            )}
            {activeBooking.status === 'rejected' && (
              <span className="text-xs bg-red-500/15 text-red-500 font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-red-500/30">
                <XCircle className="w-3.5 h-3.5" />
                <span>اعتذار الإدارة</span>
              </span>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
              <span className="text-slate-400 block text-[10px]">ميعاد الحضور:</span>
              <span className="font-black text-slate-800 dark:text-white">
                {activeBooking.slotTime} ({activeBooking.bookingDate})
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
              <span className="text-slate-400 block text-[10px]">عدد الأفراد:</span>
              <span className="font-black text-slate-800 dark:text-white">
                {activeBooking.guestsCount} فرد ({activeBooking.ticketPrice * activeBooking.guestsCount} ج.م)
              </span>
            </div>
          </div>

          {/* Contextual Status Guidance */}
          {activeBooking.status === 'pending' && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs space-y-1">
              <div className="font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>طلبك معروض أمام مدير النظام للمراجعة والقبول</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                بمجرد موافقة المدير، سيظهر لك هنا زر تأكيد الحضور النهائي قبل موعد حضورك بساعة على الأقل.
              </p>
            </div>
          )}

          {activeBooking.status === 'approved' && (
            <div className="p-3 bg-sky-500/10 border border-sky-500/25 rounded-2xl text-xs space-y-2">
              <div className="font-black text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                <span>وافق مدير النظام على حجزك!</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                يرجى تأكيد الحضور النهائي قبل موعد الحضور بساعة على الأقل لتسجيلك رسمياً في قائمة رواد اليوم وتجهيز مكانك.
              </p>
              <button
                type="button"
                onClick={() => onConfirmBooking(activeBooking.id)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <CheckCheck className="w-4 h-4" />
                <span>تأكيد الحضور النهائي الآن (قبل الحضور بساعة)</span>
              </button>
            </div>
          )}

          {activeBooking.status === 'confirmed' && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs space-y-1 text-emerald-800 dark:text-emerald-300">
              <div className="font-black flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>تم تأكيد حضورك رسمياً في الرووف!</span>
              </div>
              <p className="text-[11px] opacity-90">
                تم تسجيل اسمك في شلة رواد اليوم وتثبيت التكييف والخدمة. قعدة سعيدة يا غالي!
              </p>
            </div>
          )}

          {activeBooking.status === 'rejected' && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs space-y-1 text-red-700 dark:text-red-400">
              <div className="font-black flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>تعذر قبول هذا الحجز من الإدارة</span>
              </div>
              <p className="text-[11px] opacity-90">
                السبب: {activeBooking.rejectionReason || 'الرووف ممتلئ اليوم أو محجوز بالكامل'}.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Main Ticket Booking Action Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[var(--brand-color)]" />
              <span>{t.ticket_tab_title}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.ticket_tab_desc}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[var(--brand-color)]">
              {ticketPrice}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">
              {t.per_person}
            </span>
          </div>
        </div>

        {/* Big Action Button: Opens the Booking Modal */}
        <button
          type="button"
          onClick={onOpenBookingModal}
          className="w-full py-3.5 px-4 bg-[var(--brand-color)] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-[var(--brand-glow)] transition flex items-center justify-center gap-2 active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          <span>
            {activeBooking ? 'طلب حجز إضافي أو تعديل الميعاد' : 'سجل تيكيت واحجز قعدة اليوم'}
          </span>
        </button>

        {/* Rule Reminder */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-[var(--brand-color)]" />
            <span>نظام القبول:</span>
          </span>
          <span>يتطلب موافقة المدير + تأكيد قبل الحضور بساعة</span>
        </div>
      </div>

      {/* Today Attendees List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>{t.today_attendees_title}</span>
          </h4>
          <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full font-black">
            {todayAttendance.length} {t.attendees_count}
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto custom-scroll pr-0.5">
          {todayAttendance.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              {t.no_attendees_yet}
            </p>
          ) : (
            todayAttendance.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center">
                    {a.userName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      {a.userName}
                    </span>
                    <span className="text-[10px] text-slate-400">حاضر اليوم بالرووف</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{a.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
