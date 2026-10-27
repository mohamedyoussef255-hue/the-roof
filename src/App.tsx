import React, { useState, useEffect, useRef } from 'react';
import { UtensilsCrossed, Sparkles, ChevronLeft } from 'lucide-react';
import { AppData, Story, User, TicketBooking } from './types';
import {
  loadAppData,
  saveAppData,
  colorAccents,
} from './utils/storage';
import { translations } from './utils/translations';

// Components
import { Header } from './components/Header';
import { StoriesBar } from './components/StoriesBar';
import { StoryViewerModal } from './components/StoryViewerModal';
import { HeroBanner } from './components/HeroBanner';
import { HonestyBanner } from './components/HonestyBanner';
import { UserBalanceCard } from './components/UserBalanceCard';
import { BottomNav } from './components/BottomNav';
import { SecretPinModal } from './components/SecretPinModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MoeinAssistant } from './components/MoeinAssistant';
import { BookingModal } from './components/BookingModal';
import { ShubraFoodModal } from './components/ShubraFoodModal';
import { Toast, ToastMessage } from './components/Toast';

// Tabs
import { TicketTab } from './components/tabs/TicketTab';
import { BarTab } from './components/tabs/BarTab';
import { ChatTab } from './components/tabs/ChatTab';
import { EventsTab } from './components/tabs/EventsTab';
import { PaymentTab } from './components/tabs/PaymentTab';

export default function App() {
  const [appData, setAppData] = useState<AppData>(() => loadAppData());
  const [activeTab, setActiveTab] = useState<string>('ticketTab');
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // Modals
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isShubraFoodOpen, setIsShubraFoodOpen] = useState(false);

  // Non-blocking Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const showToast = (
    type: 'success' | 'warning' | 'error' | 'info',
    title: string,
    message: string
  ) => {
    setToast({
      id: 't_' + Date.now(),
      type,
      title,
      message,
    });
  };

  // Sync to localStorage whenever appData updates
  useEffect(() => {
    saveAppData(appData);
    applyThemeColors(appData);
  }, [appData]);

  // Apply theme & color palette to document
  const applyThemeColors = (data: AppData) => {
    if (data.config.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const lang = data.config.lang || 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    let brand = '#f97316';
    let hover = '#ea580c';
    let glow = 'rgba(249, 115, 22, 0.25)';

    if (data.config.themeAccent === 'custom' && data.config.customBrandColor) {
      brand = data.config.customBrandColor;
      hover = data.config.customBrandColor;
      glow = `${data.config.customBrandColor}40`;
    } else if (colorAccents[data.config.themeAccent]) {
      const p = colorAccents[data.config.themeAccent];
      brand = p.brand;
      hover = p.hover;
      glow = p.glow;
    }

    document.documentElement.style.setProperty('--brand-color', brand);
    document.documentElement.style.setProperty('--brand-hover', hover);
    document.documentElement.style.setProperty('--brand-glow', glow);
  };

  // Human audio player
  const playHumanAudio = (type: 'welcome' | 'ticket' | 'bar') => {
    const audioUrl = {
      welcome: appData.config.audioWelcome,
      ticket: appData.config.audioTicket,
      bar: appData.config.audioBar,
    }[type];

    if (!audioUrl || !audioPlayerRef.current) return;
    try {
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play().catch((err) => {
        console.log('Autoplay restriction or audio err:', err);
      });
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (appData.config.audioWelcome) {
      setTimeout(() => playHumanAudio('welcome'), 800);
    }
  }, []);

  const lang = appData.config.lang;
  const t = translations[lang];

  const handleToggleTheme = () => {
    setAppData((prev) => ({
      ...prev,
      config: { ...prev.config, darkMode: !prev.config.darkMode },
    }));
  };

  const handleToggleLang = () => {
    setAppData((prev) => ({
      ...prev,
      config: { ...prev.config, lang: prev.config.lang === 'ar' ? 'en' : 'ar' },
    }));
  };

  /* ================= BOOKING & 1-HOUR CONFIRMATION WORKFLOW ================= */
  const handleBookingSubmit = (bookingData: {
    bookingDate: string;
    slotTime: string;
    guestsCount: number;
    notes: string;
  }) => {
    const user = appData.currentUser;
    const timeStr = new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newBooking: TicketBooking = {
      id: 'bk_' + Date.now(),
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      bookingDate: bookingData.bookingDate,
      slotTime: bookingData.slotTime,
      guestsCount: bookingData.guestsCount,
      notes: bookingData.notes,
      status: 'pending',
      ticketPrice: appData.config.ticketPrice,
      createdAt: timeStr,
    };

    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: user.name,
      text: `قدمت طلب حجز تيكيت قعدة (${bookingData.bookingDate}) لميعاد ${bookingData.slotTime} لعدد ${bookingData.guestsCount} فرد 🎟️ في انتظار قبول مدير النظام.`,
      time: timeStr,
    };

    setAppData((prev) => ({
      ...prev,
      bookings: [newBooking, ...(prev.bookings || [])],
      chatMessages: [...prev.chatMessages, newMsg],
    }));

    setActiveTab('ticketTab');
    showToast(
      'success',
      'تم إرسال طلب الحجز بنجاح!',
      'طلبك الآن معروض أمام مدير النظام للقبول. وبمجرد قبوله ستتمكن من تأكيد الحضور قبل الميعاد بساعة على الأقل.'
    );
  };

  const handleConfirmBooking = (bookingId: string) => {
    const booking = (appData.bookings || []).find((b) => b.id === bookingId);
    if (!booking) return;

    const todayStr = new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US');
    const timeStr = new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedBookings = (appData.bookings || []).map((b) =>
      b.id === bookingId
        ? { ...b, status: 'confirmed' as const, confirmedAt: timeStr }
        : b
    );

    const exists = appData.attendance.some(
      (a) => a.userId === booking.userId && a.date === todayStr
    );

    let nextAttendance = appData.attendance;
    if (!exists) {
      nextAttendance = [
        {
          id: 'att_' + Date.now(),
          userId: booking.userId,
          userName: booking.userName,
          date: todayStr,
          time: timeStr,
        },
        ...appData.attendance,
      ];
    }

    const cost = booking.ticketPrice * booking.guestsCount;
    const user = appData.currentUser;
    const nextBal = user.balance + cost;
    const updatedUser = { ...user, balance: nextBal };
    const updatedUsers = appData.users.map((u) =>
      u.id === user.id ? updatedUser : u
    );

    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: user.name,
      text: `أكدت حضوري النهائي الليلة بالرووف لميعاد ${booking.slotTime} ✅ قعدة رايقة يا رجالة!`,
      time: timeStr,
    };

    setAppData((prev) => ({
      ...prev,
      bookings: updatedBookings,
      attendance: nextAttendance,
      currentUser: updatedUser,
      users: updatedUsers,
      chatMessages: [...prev.chatMessages, newMsg],
    }));

    playHumanAudio('ticket');
    showToast(
      'success',
      'تم تأكيد حضورك النهائي بالرووف!',
      'تم تثبيت مكانك والتكييف وتسجيلك في قائمة رواد اليوم. قعدة سعيدة يا غالي!'
    );
  };

  /* ================= BAR TAKE ITEM ================= */
  const handleTakeItem = (productId: string) => {
    const prod = appData.products.find((p) => p.id === productId);
    if (!prod || prod.stock <= 0) return;

    const user = appData.currentUser;
    const updatedProducts = appData.products.map((p) =>
      p.id === productId ? { ...p, stock: p.stock - 1 } : p
    );

    const nextBal = user.balance + prod.price;
    const updatedUser = { ...user, balance: nextBal };
    const updatedUsers = appData.users.map((u) =>
      u.id === user.id ? updatedUser : u
    );

    const newOrder = {
      id: 'ord_' + Date.now(),
      userId: user.id,
      userName: user.name,
      item: prod.name,
      price: prod.price,
      time: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setAppData((prev) => ({
      ...prev,
      products: updatedProducts,
      currentUser: updatedUser,
      users: updatedUsers,
      orders: [newOrder, ...prev.orders],
    }));

    playHumanAudio('bar');
    showToast(
      'success',
      'بالهنا والشفا!',
      `تم تسجيل "${prod.name}" بحسابك بنظام الأمانة الذاتي.`
    );
  };

  /* ================= CHAT ================= */
  const handleSendMessage = (text: string) => {
    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: appData.currentUser.name,
      text,
      time: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isSystem: false,
    };

    setAppData((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMsg],
    }));
  };

  /* ================= EVENTS RSVP ================= */
  const handleToggleRsvp = (eventId: string) => {
    const updatedEvents = appData.events.map((ev) => {
      if (ev.id === eventId) {
        const userName = appData.currentUser.name;
        const exists = ev.attendees.includes(userName);
        const nextAttendees = exists
          ? ev.attendees.filter((name) => name !== userName)
          : [...ev.attendees, userName];
        return { ...ev, attendees: nextAttendees };
      }
      return ev;
    });

    setAppData((prev) => ({ ...prev, events: updatedEvents }));
  };

  /* ================= PAYMENT SUBMISSION ================= */
  const handleSubmitPayment = (data: {
    amount: number;
    method: string;
    ref: string;
    receiptImg: string;
  }) => {
    const newPayment = {
      id: 'pay_' + Date.now(),
      userId: appData.currentUser.id,
      userName: appData.currentUser.name,
      amount: data.amount,
      method: data.method,
      ref: data.ref,
      receiptImg: data.receiptImg,
      status: 'pending' as const,
      time: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setAppData((prev) => ({
      ...prev,
      payments: [newPayment, ...prev.payments],
    }));

    showToast(
      'success',
      'تم إرسال إشعار الدفع!',
      'سيتم تصفير حسابك فور اعتماد الإيصال من قِبل مدير النظام.'
    );
  };

  /* ================= USER SWITCH & ADD ================= */
  const handleSelectUser = (user: User) => {
    setAppData((prev) => ({ ...prev, currentUser: user }));
    showToast('info', 'تم تبديل العضو', `أهلاً بك يا ${user.name}`);
  };

  const handleAddUser = (name: string, phone: string) => {
    const newUser: User = {
      id: 'u_' + Date.now(),
      name,
      phone,
      balance: 0,
      avatar: '🌟',
    };

    setAppData((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser,
    }));
    showToast('success', 'تمت إضافة العضو', `أهلاً بالعضو الجديد "${name}" في شلة الرووف!`);
  };

  /* ================= SHARE SHUBRA FOOD IN CHAT ================= */
  const handleShareFoodInChat = (restaurantName: string) => {
    const timeStr = new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: appData.currentUser.name,
      text: `يا شباب، إيه رأيكم نطلب دليفري لسهرة الرووف من "${restaurantName}" بشارع شبرا؟ 🍕🍔 مين يحب يشارك معايا؟`,
      time: timeStr,
    };

    setAppData((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMsg],
    }));

    setIsShubraFoodOpen(false);
    setActiveTab('chatTab');
    showToast(
      'success',
      'تم اقتراح الأكل بالشات!',
      `تم نشر اقتراحك للطلب من "${restaurantName}" في شات الرووف.`
    );
  };

  const userPayments = appData.payments.filter(
    (p) => p.userId === appData.currentUser.id
  );

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300">
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Navigation Header */}
      <Header
        appData={appData}
        onOpenAdminSecret={() => setIsPinModalOpen(true)}
        onToggleTheme={handleToggleTheme}
        onToggleLang={handleToggleLang}
        onOpenUserModal={() => setIsUserModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* Stories / Reels Bar */}
        <StoriesBar
          stories={appData.stories}
          title={t.reels_title}
          onSelectStory={(s) => setActiveStory(s)}
        />

        {/* Hero Banner: Clicking button opens BookingModal! */}
        <HeroBanner
          bannerImg={appData.config.bannerImg}
          badgeText={t.badge_bar}
          welcomeText={t.banner_welcome}
          buttonText="احجز تيكيت اليوم"
          onBookClick={() => setIsBookingModalOpen(true)}
        />

        {/* SHUBRA RESTAURANTS QUICK BANNER */}
        <div
          onClick={() => setIsShubraFoodOpen(true)}
          className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/35 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all shadow-sm active:scale-98 group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
              <UtensilsCrossed className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>دليل مطاعم شارع شبرا مصر</span>
                <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-md">
                  دليفري الرووف
                </span>
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                كشري التحرير، بازوكا، شاورما أنس، بلبن، بريموز بيتزا (أرقام ومنيو)
              </p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-amber-500 group-hover:-translate-x-1 transition-transform" />
        </div>

        {/* Honesty Alert Broadcast Banner */}
        {appData.config.broadcastActive && (
          <HonestyBanner
            title={t.audit_alert_title}
            body={t.audit_alert_body}
            buttonText={t.btn_record_bar}
            onRecordClick={() => setActiveTab('barTab')}
          />
        )}

        {/* User Balance Status Card */}
        <UserBalanceCard
          user={appData.currentUser}
          onPayClick={() => setActiveTab('payTab')}
          welcomeText={t.welcome_user}
          dueText={t.due_balance}
          currencyText={t.currency}
          payBtnText={t.btn_pay_now}
        />

        {/* TABS CONTENT */}
        {activeTab === 'ticketTab' && (
          <TicketTab
            currentUser={appData.currentUser}
            ticketPrice={appData.config.ticketPrice}
            attendance={appData.attendance}
            bookings={appData.bookings || []}
            onOpenBookingModal={() => setIsBookingModalOpen(true)}
            onConfirmBooking={handleConfirmBooking}
            lang={lang}
            t={t}
          />
        )}

        {activeTab === 'barTab' && (
          <BarTab
            products={appData.products}
            onTakeItem={handleTakeItem}
            currencyText={t.currency}
            t={t}
          />
        )}

        {activeTab === 'chatTab' && (
          <ChatTab
            currentUser={appData.currentUser}
            messages={appData.chatMessages}
            onSendMessage={handleSendMessage}
            t={t}
          />
        )}

        {activeTab === 'eventsTab' && (
          <EventsTab
            currentUser={appData.currentUser}
            events={appData.events}
            onToggleRsvp={handleToggleRsvp}
            t={t}
          />
        )}

        {activeTab === 'payTab' && (
          <PaymentTab
            currentUser={appData.currentUser}
            config={appData.config}
            userPayments={userPayments}
            onSubmitPayment={handleSubmitPayment}
            currencyText={t.currency}
            t={t}
          />
        )}
      </main>

      {/* Moein Smart Egyptian Assistant */}
      <MoeinAssistant
        appData={appData}
        onNavigateTab={(tabId) => setActiveTab(tabId)}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        hasUnreadChat={appData.chatMessages.length > 0}
        t={t}
      />

      {/* Modals */}
      <StoryViewerModal
        story={activeStory}
        onClose={() => setActiveStory(null)}
      />

      {/* Secret PIN Modal (5 clicks on logo) */}
      <SecretPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setIsPinModalOpen(false);
          setIsAdminOpen(true);
        }}
        correctPin={appData.config.adminPin}
        t={t}
      />

      {/* User Switch Modal */}
      <UserProfileModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        currentUser={appData.currentUser}
        users={appData.users}
        onSelectUser={handleSelectUser}
        onAddUser={handleAddUser}
        currencyText={t.currency}
      />

      {/* Booking Ticket Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        currentUser={appData.currentUser}
        ticketPrice={appData.config.ticketPrice}
        onSubmitBooking={handleBookingSubmit}
        currencyText={t.currency}
      />

      {/* Shubra Restaurants & Delivery Modal */}
      <ShubraFoodModal
        isOpen={isShubraFoodOpen}
        onClose={() => setIsShubraFoodOpen(false)}
        restaurants={appData.shubraRestaurants || []}
        onShareInChat={handleShareFoodInChat}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        appData={appData}
        onUpdateData={(newData) => setAppData(newData)}
        onPlayAudioPreview={playHumanAudio}
      />
    </div>
  );
}
