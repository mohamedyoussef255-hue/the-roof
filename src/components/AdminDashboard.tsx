import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  AlertCircle,
  Users,
  Palette,
  Clapperboard,
  Image as ImageIcon,
  Mic,
  ClipboardCheck,
  PlusCircle,
  Sliders,
  Receipt,
  Bot,
  Copy,
  Check,
  Trash2,
  BellRing,
  Download,
  Upload,
  RefreshCw,
  Eye,
  CheckCircle2,
  Volume2,
  Ticket,
  Calendar,
  Clock,
  Hourglass,
  CheckCheck,
  XCircle,
  UtensilsCrossed,
  Phone,
  MapPin,
  Star,
  Edit3,
  Plus,
  UploadCloud
} from 'lucide-react';
import { AppData, Product, Story, TicketBooking, ShubraRestaurant, MenuItem } from '../types';
import { colorAccents } from '../utils/storage';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  appData: AppData;
  onUpdateData: (newData: AppData) => void;
  onPlayAudioPreview: (type: 'welcome' | 'ticket' | 'bar') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  appData,
  onUpdateData,
  onPlayAudioPreview,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<
    'overview' | 'audit' | 'bookings' | 'products' | 'restaurants' | 'payments' | 'stories' | 'branding' | 'audio' | 'moein' | 'settings'
  >('overview');

  // Local state for stock audit
  const [actualStockMap, setActualStockMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    appData.products.forEach((p) => {
      map[p.id] = p.stock;
    });
    return map;
  });

  const bookingsList = appData.bookings || [];
  const pendingBookings = bookingsList.filter((b) => b.status === 'pending');
  const restaurantsList = appData.shubraRestaurants || [];

  // Calculate KPIs
  const totalPendingBalance = appData.users.reduce((acc, u) => acc + (u.balance || 0), 0);
  const totalOrdersAmount = appData.orders.reduce((acc, o) => acc + (o.price || 0), 0);
  const totalApprovedPayments = appData.payments
    .filter((p) => p.status === 'approved')
    .reduce((acc, p) => acc + (p.amount || 0), 0);
  const pendingPayments = appData.payments.filter((p) => p.status === 'pending');

  const todayStr = new Date().toLocaleDateString(appData.config.lang === 'ar' ? 'ar-EG' : 'en-US');
  const todayAttendeesCount = appData.attendance.filter((a) => a.date === todayStr).length;

  // Audit deficit calculation
  const calculatedDeficit = appData.products.reduce((acc, p) => {
    const actual = actualStockMap[p.id] !== undefined ? actualStockMap[p.id] : p.stock;
    if (actual < p.stock) {
      return acc + (p.stock - actual) * p.price;
    }
    return acc;
  }, 0);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'cold' | 'hot' | 'snacks'>('cold');
  const [newProdImage, setNewProdImage] = useState('');

  // New restaurant form
  const [newRestName, setNewRestName] = useState('');
  const [newRestCategory, setNewRestCategory] = useState<'koshary' | 'chicken' | 'shawarma' | 'grills' | 'pizza' | 'desserts' | 'juices'>('koshary');
  const [newRestAddress, setNewRestAddress] = useState('');
  const [newRestPhone, setNewRestPhone] = useState('');
  const [newRestHotline, setNewRestHotline] = useState('');
  const [newRestImage, setNewRestImage] = useState('');
  const [newRestNotes, setNewRestNotes] = useState('');

  // Selected restaurant for menu management
  const [selectedRestIdForMenu, setSelectedRestIdForMenu] = useState<string | null>(null);
  const [newMenuItemName, setNewMenuItemName] = useState('');
  const [newMenuItemPrice, setNewMenuItemPrice] = useState('');
  const [newMenuItemDesc, setNewMenuItemDesc] = useState('');

  // New story form
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryType, setNewStoryType] = useState<'image' | 'video'>('image');
  const [newStoryUrl, setNewStoryUrl] = useState('');

  // Settings form
  const [appName, setAppName] = useState(appData.config.appName);
  const [appSubtitle, setAppSubtitle] = useState(appData.config.appSubtitle);
  const [adminPin, setAdminPin] = useState(appData.config.adminPin);
  const [ticketPrice, setTicketPrice] = useState(appData.config.ticketPrice.toString());
  const [instapay, setInstapay] = useState(appData.config.paymentInfo.instapay);
  const [vodafone, setVodafone] = useState(appData.config.paymentInfo.vodafone);
  const [otherPay, setOtherPay] = useState(appData.config.paymentInfo.other);

  // Moein settings
  const [moeinEnabled, setMoeinEnabled] = useState(appData.config.moeinSettings?.enabled ?? true);
  const [moeinShowUsers, setMoeinShowUsers] = useState(appData.config.moeinSettings?.showOnUserPages ?? true);
  const [moeinWelcome, setMoeinWelcome] = useState(appData.config.moeinSettings?.customWelcome ?? '');
  const [moeinTopics, setMoeinTopics] = useState(appData.config.moeinSettings?.permittedTopics ?? '');
  const [moeinForbidden, setMoeinForbidden] = useState(appData.config.moeinSettings?.forbiddenSecrets ?? '');

  // Custom accent color
  const [customHex, setCustomHex] = useState(appData.config.customBrandColor || '#f97316');
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);

  // Theme changer
  const handleThemeChange = (accent: 'orange' | 'emerald' | 'blue' | 'purple' | 'custom', hex?: string) => {
    onUpdateData({
      ...appData,
      config: {
        ...appData.config,
        themeAccent: accent,
        customBrandColor: hex || customHex,
      },
    });
  };

  // Stock audit reconciliation
  const handleApplyAudit = () => {
    const updatedProducts = appData.products.map((p) => {
      const actual = actualStockMap[p.id];
      return {
        ...p,
        stock: actual !== undefined ? Math.max(0, actual) : p.stock,
      };
    });
    onUpdateData({ ...appData, products: updatedProducts });
    alert('تم اعتماد المخزون الفعلي وتحديث الثلاجة بنجاح!');
  };

  // Honesty broadcast banner toggle
  const handleToggleHonestyBroadcast = () => {
    const nextState = !appData.config.broadcastActive;
    let newChat = [...appData.chatMessages];
    if (nextState) {
      newChat.push({
        id: 'msg_' + Date.now(),
        sender: 'إدارة الرووف',
        text: 'تنويه ودي يا شلة: عملنا جرد سريع للثلاجة والبار ولقينا مسحوبات نسينا نسجلها سهواً.. برجاء اللي أخد حاجة يدخل على البار ويسجلها بروقان عشان تلاجتنا تفضل دايماً مليانة ❤️☕',
        time: new Date().toLocaleTimeString(appData.config.lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        isSystem: true,
      });
    }
    onUpdateData({
      ...appData,
      chatMessages: newChat,
      config: {
        ...appData.config,
        broadcastActive: nextState,
      },
    });
    alert(nextState ? 'تم تفعيل التنبيه وبثه للرواد وإرسال إشعار بالشات!' : 'تم إيقاف التنبيه.');
  };

  const handleCopyWhatsApp = () => {
    const msg = `يا شباب شلة الرووف المنورين ❤️ عملنا جرد سريع للثلاجة والبار ولقينا حاجات اتسحبت واتنست في زحمة القعدة والهزار.. برجاء اللي سحب حاجة ومسجلهاش يفتح الأبلكيشن ويسجلها عشان تلاجتنا تفضل عامرة بصحبتنا دايماً ☕🥤`;
    navigator.clipboard.writeText(msg);
    setCopiedWhatsapp(true);
    setTimeout(() => setCopiedWhatsapp(false), 2000);
  };

  /* ================= BOOKINGS APPROVALS ================= */
  const handleApproveBooking = (bookingId: string) => {
    const booking = bookingsList.find((b) => b.id === bookingId);
    if (!booking) return;

    const timeStr = new Date().toLocaleTimeString(appData.config.lang === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedBookings = bookingsList.map((b) =>
      b.id === bookingId
        ? { ...b, status: 'approved' as const, approvedAt: timeStr }
        : b
    );

    const newChat = [
      ...appData.chatMessages,
      {
        id: 'msg_' + Date.now(),
        sender: 'إدارة الرووف',
        text: `تمت موافقة الإدارة على طلب حجز تيكيت [${booking.userName}] لميعاد ${booking.slotTime}! يرجى تأكيد الحضور النهائي قبل الميعاد بساعة على الأقل ✅`,
        time: timeStr,
        isSystem: true,
      },
    ];

    onUpdateData({
      ...appData,
      bookings: updatedBookings,
      chatMessages: newChat,
    });
    alert(`تمت الموافقة وقبول حجز ${booking.userName} بنجاح!`);
  };

  const handleConfirmBookingDirectly = (bookingId: string) => {
    const booking = bookingsList.find((b) => b.id === bookingId);
    if (!booking) return;

    const timeStr = new Date().toLocaleTimeString(appData.config.lang === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const dateStr = new Date().toLocaleDateString(appData.config.lang === 'ar' ? 'ar-EG' : 'en-US');

    const updatedBookings = bookingsList.map((b) =>
      b.id === bookingId
        ? { ...b, status: 'confirmed' as const, confirmedAt: timeStr }
        : b
    );

    const exists = appData.attendance.some(
      (a) => a.userId === booking.userId && a.date === dateStr
    );
    let nextAttendance = appData.attendance;
    if (!exists) {
      nextAttendance = [
        {
          id: 'att_' + Date.now(),
          userId: booking.userId,
          userName: booking.userName,
          date: dateStr,
          time: timeStr,
        },
        ...appData.attendance,
      ];
    }

    const cost = booking.ticketPrice * booking.guestsCount;
    const updatedUsers = appData.users.map((u) => {
      if (u.id === booking.userId) {
        return { ...u, balance: u.balance + cost };
      }
      return u;
    });

    const nextCurrentUser =
      appData.currentUser.id === booking.userId
        ? { ...appData.currentUser, balance: appData.currentUser.balance + cost }
        : appData.currentUser;

    onUpdateData({
      ...appData,
      bookings: updatedBookings,
      attendance: nextAttendance,
      users: updatedUsers,
      currentUser: nextCurrentUser,
    });
    alert(`تم تأكيد حضور ${booking.userName} في الرووف وتسجيل التيكيت!`);
  };

  const handleRejectBooking = (bookingId: string) => {
    const reason = prompt('سبب عدم إمكانية الحجز (مثال: الرووف ممتلئ اليوم):', 'الرووف ممتلئ بالكامل اليوم') || 'الرووف ممتلئ اليوم';
    const updatedBookings = bookingsList.map((b) =>
      b.id === bookingId
        ? { ...b, status: 'rejected' as const, rejectionReason: reason }
        : b
    );
    onUpdateData({
      ...appData,
      bookings: updatedBookings,
    });
  };

  /* ================= PRODUCTS MANAGEMENT WITH IMAGE UPLOAD ================= */
  const handleProductImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setNewProdImage((ev.target?.result as string) || '');
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice || !newProdStock) return;
    const newP: Product = {
      id: 'p_' + Date.now(),
      name: newProdName.trim(),
      price: Number(newProdPrice),
      stock: Number(newProdStock),
      category: newProdCategory,
      image: newProdImage || undefined,
      icon: newProdCategory === 'cold' ? 'cup-soda' : newProdCategory === 'hot' ? 'coffee' : 'sparkles',
    };
    onUpdateData({
      ...appData,
      products: [...appData.products, newP],
    });
    setActualStockMap((prev) => ({ ...prev, [newP.id]: newP.stock }));
    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock('');
    setNewProdImage('');
    alert('تمت إضافة الصنف بالصورة بنجاح!');
  };

  const handleUpdateProductImage = (productId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const imgBase64 = (ev.target?.result as string) || '';
      const updatedProducts = appData.products.map((p) =>
        p.id === productId ? { ...p, image: imgBase64 } : p
      );
      onUpdateData({ ...appData, products: updatedProducts });
      alert('تم تحديث صورة الصنف بنجاح وستظهر للمستخدمين!');
    };
    reader.readAsDataURL(file);
  };

  const handleAdjustStock = (id: string, delta: number) => {
    const updated = appData.products.map((p) => {
      if (p.id === id) {
        const next = Math.max(0, p.stock + delta);
        setActualStockMap((prev) => ({ ...prev, [id]: next }));
        return { ...p, stock: next };
      }
      return p;
    });
    onUpdateData({ ...appData, products: updated });
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصنف من البار؟')) return;
    onUpdateData({
      ...appData,
      products: appData.products.filter((p) => p.id !== id),
    });
  };

  /* ================= SHUBRA RESTAURANTS MANAGEMENT ================= */
  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    const newR: ShubraRestaurant = {
      id: 'rst_' + Date.now(),
      name: newRestName.trim(),
      category: newRestCategory,
      address: newRestAddress.trim() || 'شارع شبرا الرئيسي، القاهرة',
      phone: newRestPhone.trim() || '0222010045',
      hotline: newRestHotline.trim(),
      image: newRestImage.trim() || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      deliveryAvailable: true,
      notes: newRestNotes.trim(),
      menu: [
        { id: 'm_' + Date.now() + '_1', name: 'وجبة / صنف رئيسي', price: 75, description: 'أشهر أصناف المطعم' },
      ],
    };

    onUpdateData({
      ...appData,
      shubraRestaurants: [newR, ...restaurantsList],
    });

    setNewRestName('');
    setNewRestAddress('');
    setNewRestPhone('');
    setNewRestHotline('');
    setNewRestImage('');
    setNewRestNotes('');
    alert(`تمت إضافة مطعم "${newR.name}" بنجاح لدليل شبرا!`);
  };

  const handleDeleteRestaurant = (restId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المطعم من دليل شبرا؟')) return;
    onUpdateData({
      ...appData,
      shubraRestaurants: restaurantsList.filter((r) => r.id !== restId),
    });
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestIdForMenu || !newMenuItemName.trim() || !newMenuItemPrice) return;

    const newItem: MenuItem = {
      id: 'mi_' + Date.now(),
      name: newMenuItemName.trim(),
      price: Number(newMenuItemPrice),
      description: newMenuItemDesc.trim(),
    };

    const updated = restaurantsList.map((r) =>
      r.id === selectedRestIdForMenu
        ? { ...r, menu: [...r.menu, newItem] }
        : r
    );

    onUpdateData({ ...appData, shubraRestaurants: updated });
    setNewMenuItemName('');
    setNewMenuItemPrice('');
    setNewMenuItemDesc('');
    alert('تمت إضافة الصنف لقائمة طعام المطعم بنجاح!');
  };

  const handleDeleteMenuItem = (restId: string, itemId: string) => {
    const updated = restaurantsList.map((r) =>
      r.id === restId
        ? { ...r, menu: r.menu.filter((m) => m.id !== itemId) }
        : r
    );
    onUpdateData({ ...appData, shubraRestaurants: updated });
  };

  /* ================= PAYMENTS APPROVAL ================= */
  const handleApprovePayment = (paymentId: string) => {
    const payment = appData.payments.find((p) => p.id === paymentId);
    if (!payment) return;

    const updatedPayments = appData.payments.map((p) =>
      p.id === paymentId ? { ...p, status: 'approved' as const } : p
    );

    const updatedUsers = appData.users.map((u) => {
      if (u.id === payment.userId) {
        const nextBal = Math.max(0, u.balance - payment.amount);
        return { ...u, balance: nextBal };
      }
      return u;
    });

    const nextCurrentUser =
      appData.currentUser.id === payment.userId
        ? { ...appData.currentUser, balance: Math.max(0, appData.currentUser.balance - payment.amount) }
        : appData.currentUser;

    onUpdateData({
      ...appData,
      payments: updatedPayments,
      users: updatedUsers,
      currentUser: nextCurrentUser,
    });
    alert('تم اعتماد الإيصال وتصفير حساب العضو بنجاح!');
  };

  /* ================= STORIES REELS ================= */
  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryTitle.trim() || !newStoryUrl.trim()) return;
    const newS: Story = {
      id: 'st_' + Date.now(),
      title: newStoryTitle.trim(),
      type: newStoryType,
      url: newStoryUrl.trim(),
    };
    onUpdateData({
      ...appData,
      stories: [newS, ...appData.stories],
    });
    setNewStoryTitle('');
    setNewStoryUrl('');
    alert('تم نشر الستوري بنجاح!');
  };

  const handleDeleteStory = (id: string) => {
    onUpdateData({
      ...appData,
      stories: appData.stories.filter((s) => s.id !== id),
    });
  };

  const handleUploadLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpdateData({
        ...appData,
        config: { ...appData.config, logoImg: (ev.target?.result as string) || '' },
      });
      alert('تم تحديث اللوجو بنجاح!');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpdateData({
        ...appData,
        config: { ...appData.config, bannerImg: (ev.target?.result as string) || '' },
      });
      alert('تم تحديث البانر بنجاح!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = () => {
    onUpdateData({
      ...appData,
      config: {
        ...appData.config,
        appName: appName.trim() || 'الرووف',
        appSubtitle: appSubtitle.trim() || 'سهرات ولمّة الصحاب',
        adminPin: adminPin.trim() || '0000',
        ticketPrice: Number(ticketPrice) || 50,
        paymentInfo: {
          instapay: instapay.trim(),
          vodafone: vodafone.trim(),
          other: otherPay.trim(),
        },
      },
    });
    alert('تم حفظ وتثبيت إعدادات النظام بنجاح!');
  };

  const handleSaveMoein = () => {
    onUpdateData({
      ...appData,
      config: {
        ...appData.config,
        moeinSettings: {
          enabled: moeinEnabled,
          showOnUserPages: moeinShowUsers,
          voiceSpeechEnabled: true,
          customWelcome: moeinWelcome,
          permittedTopics: moeinTopics,
          forbiddenSecrets: moeinForbidden,
        },
      },
    });
    alert('تم حفظ إعدادات ومهام المساعد الذكي مُعين بنجاح!');
  };

  const handleExportBackup = () => {
    const jsonStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the_roof_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.config && parsed.products) {
          onUpdateData(parsed);
          alert('تم استيراد واسترجاع البيانات بنجاح!');
        } else {
          alert('ملف النسخة الاحتياطية غير متوافق!');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف النسخ الاحتياطي!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="max-w-xl mx-auto min-h-screen bg-slate-50 dark:bg-slate-950 p-4 space-y-4 pb-20 border-x border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <div>
              <h2 className="font-black text-lg text-slate-900 dark:text-white">
                لوحة تحكم مدير الرووف
              </h2>
              <span className="text-[10px] text-slate-400">تحكم كامل في الحجوزات، المطاعم، البار، والصور</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black px-4 py-2 rounded-xl transition"
          >
            خروج من اللوحة
          </button>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-400 block">حجوزات معلقة</span>
            <span className="text-sm font-black text-orange-500">
              {pendingBookings.length}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-400 block">أرصدة معلقة</span>
            <span className="text-sm font-black text-[var(--brand-color)]">
              {totalPendingBalance} ج.م
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-400 block">مطاعم شبرا</span>
            <span className="text-sm font-black text-amber-500">
              {restaurantsList.length}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-400 block">إيصالات معلقة</span>
            <span className="text-sm font-black text-emerald-500">
              {pendingPayments.length}
            </span>
          </div>
        </div>

        {/* Section Tabs inside Admin */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scroll text-xs">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { id: 'bookings', label: `طلبات الحجز (${pendingBookings.length})`, icon: <Ticket className="w-3.5 h-3.5 text-orange-500" /> },
            { id: 'products', label: 'أصناف وصور البار', icon: <PlusCircle className="w-3.5 h-3.5" /> },
            { id: 'restaurants', label: `مطاعم شبرا (${restaurantsList.length})`, icon: <UtensilsCrossed className="w-3.5 h-3.5 text-amber-500" /> },
            { id: 'audit', label: 'جرد الثلاجة', icon: <ClipboardCheck className="w-3.5 h-3.5" /> },
            { id: 'payments', label: `الإيصالات (${pendingPayments.length})`, icon: <Receipt className="w-3.5 h-3.5" /> },
            { id: 'stories', label: 'الريلز والقصص', icon: <Clapperboard className="w-3.5 h-3.5" /> },
            { id: 'branding', label: 'الألوان واللوجو', icon: <Palette className="w-3.5 h-3.5" /> },
            { id: 'moein', label: 'إدارة مُعين AI', icon: <Bot className="w-3.5 h-3.5" /> },
            { id: 'audio', label: 'التسجيلات الصوتية', icon: <Mic className="w-3.5 h-3.5" /> },
            { id: 'settings', label: 'الإعدادات والنسخ', icon: <Sliders className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-[var(--brand-color)] text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ================= TAB: BOOKINGS MANAGEMENT ================= */}
        {activeTab === 'bookings' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-orange-500" />
                  <span>طلبات الحجز والقبول المسبق</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  مراجعة طلبات حضور الأعضاء والموافقة عليها (يؤكدها العضو قبل الحضور بساعة)
                </p>
              </div>
              <span className="text-xs bg-orange-500/15 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full font-black">
                {pendingBookings.length} طلب بانتظار القبول
              </span>
            </div>

            {bookingsList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                لا توجد طلبات حجز مسجلة حالياً.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scroll pr-1">
                {bookingsList.map((bk) => (
                  <div
                    key={bk.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-black text-sm text-slate-900 dark:text-white block">
                          {bk.userName} ({bk.userPhone})
                        </span>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                          <span className="flex items-center gap-1 font-bold text-[var(--brand-color)]">
                            <Clock className="w-3 h-3" />
                            <span>{bk.slotTime} ({bk.bookingDate})</span>
                          </span>
                          <span>•</span>
                          <span>{bk.guestsCount} فرد</span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      {bk.status === 'pending' && (
                        <span className="text-[10px] bg-amber-500/15 text-amber-600 px-2.5 py-0.5 rounded-full font-black">
                          بانتظار قبولك
                        </span>
                      )}
                      {bk.status === 'approved' && (
                        <span className="text-[10px] bg-sky-500/15 text-sky-600 px-2.5 py-0.5 rounded-full font-black">
                          تم قبولك (بانتظار تأكيد العضو)
                        </span>
                      )}
                      {bk.status === 'confirmed' && (
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-600 px-2.5 py-0.5 rounded-full font-black">
                          حاضر ومؤكد
                        </span>
                      )}
                      {bk.status === 'rejected' && (
                        <span className="text-[10px] bg-red-500/15 text-red-500 px-2.5 py-0.5 rounded-full font-black">
                          تم الاعتذار
                        </span>
                      )}
                    </div>

                    {bk.notes && (
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                        <strong>ملاحظات العضو:</strong> {bk.notes}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                      {bk.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApproveBooking(bk.id)}
                            className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>قبول وموافقة الحجز</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectBooking(bk.id)}
                            className="py-1.5 px-3 bg-red-500/15 hover:bg-red-500/25 text-red-600 rounded-xl font-bold text-xs"
                          >
                            اعتذار
                          </button>
                        </>
                      )}

                      {bk.status === 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleConfirmBookingDirectly(bk.id)}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>تسجيل حضور مباشر وتأكيد</span>
                        </button>
                      )}

                      {bk.status === 'confirmed' && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                          تم تثبيت الحضور وتسجيل تيكيت العضو في قائمة اليوم ✅
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: PRODUCTS WITH PHOTO UPLOAD ================= */}
        {activeTab === 'products' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-500" />
              <span>إضافة صنف جديد للبار مع رفع الصورة</span>
            </h4>

            <form onSubmit={handleAddProduct} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="اسم الصنف (مثال: بيبسي كانز)"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="السعر (ج.م)"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="الكمية / الرصيد الأولي"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="cold">ساقع ومياه</option>
                  <option value="hot">قهوة وسخن</option>
                  <option value="snacks">مقرمشات وحلويات</option>
                </select>
              </div>

              {/* Product Photo Upload */}
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 font-bold mb-1 block">
                  رفع صورة الصنف (تظهر للمستخدمين عند الاختيار):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageFile}
                    className="flex-1 text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-slate-200 dark:file:bg-slate-800 file:text-[var(--brand-color)] cursor-pointer"
                  />
                  {newProdImage && (
                    <img
                      src={newProdImage}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-300"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition"
              >
                إضافة الصنف مع الصورة للمخزون
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h5 className="text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
                الأصناف الحالية مع إمكانية تعديل صورها:
              </h5>
              <div className="space-y-2 max-h-72 overflow-y-auto custom-scroll pr-1">
                {appData.products.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-300 dark:border-slate-700 relative group">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--brand-color)] font-bold text-xs">
                            صورة
                          </div>
                        )}
                        {/* Quick upload on click */}
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                          <UploadCloud className="w-4 h-4 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUpdateProductImage(p.id, f);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div>
                        <div className="font-black text-slate-800 dark:text-white">{p.name}</div>
                        <div className="text-[11px] text-[var(--brand-color)] font-bold">
                          {p.price} ج.م | الرصيد: {p.stock}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(p.id, 5)}
                        className="bg-slate-200 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white px-2 py-1 rounded-lg text-slate-700 dark:text-slate-200 font-black text-xs transition"
                        title="إضافة 5 قطع"
                      >
                        +5
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(p.id, -1)}
                        className="bg-slate-200 dark:bg-slate-800 hover:bg-amber-600 hover:text-white px-2 py-1 rounded-lg text-slate-700 dark:text-slate-200 font-black text-xs transition"
                        title="خصم قطعة"
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition"
                        title="حذف الصنف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: SHUBRA RESTAURANTS MANAGEMENT ================= */}
        {activeTab === 'restaurants' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-amber-500" />
                  <span>دليل مطاعم شارع شبرا مصر وقوائم الطعام</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  إضافة أو تعديل أو حذف مطاعم شارع شبرا، وأرقام الدليفري وأسعار المنيو
                </p>
              </div>
            </div>

            {/* Add Restaurant Form */}
            <form onSubmit={handleAddRestaurant} className="space-y-2.5 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h5 className="text-xs font-black text-slate-800 dark:text-white">إضافة مطعم جديد لدليل شبرا:</h5>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="اسم المطعم (مثال: كشري التحرير)"
                  value={newRestName}
                  onChange={(e) => setNewRestName(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
                <select
                  value={newRestCategory}
                  onChange={(e) => setNewRestCategory(e.target.value as any)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="koshary">كشري وطواجن</option>
                  <option value="chicken">فرايد تشيكن وبرجر</option>
                  <option value="shawarma">شاورما وسوري</option>
                  <option value="grills">مشويات وكباب</option>
                  <option value="pizza">بيتزا وفطير شرقي</option>
                  <option value="desserts">حلويات وقشطوطة</option>
                  <option value="juices">عصائر فريش</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="العنوان بشارع شبرا"
                  value={newRestAddress}
                  onChange={(e) => setNewRestAddress(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="الخط الساخن أو الموبايل"
                  value={newRestHotline}
                  onChange={(e) => setNewRestHotline(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="url"
                  placeholder="رابط صورة المطعم (Image URL)"
                  value={newRestImage}
                  onChange={(e) => setNewRestImage(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="ملاحظات (توصيل سريع، عروض)"
                  value={newRestNotes}
                  onChange={(e) => setNewRestNotes(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-xl shadow-md transition"
              >
                تأكيد وإضافة المطعم
              </button>
            </form>

            {/* Existing Restaurants List & Menu Editor */}
            <div className="space-y-3">
              <h5 className="text-xs font-black text-slate-700 dark:text-slate-300">
                المطاعم الحالية بشارع شبرا وإدارة المنيو:
              </h5>
              <div className="space-y-2.5 max-h-96 overflow-y-auto custom-scroll pr-1">
                {restaurantsList.map((rest) => {
                  const isEditingMenu = selectedRestIdForMenu === rest.id;
                  return (
                    <div
                      key={rest.id}
                      className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-black text-sm text-slate-900 dark:text-white">
                            {rest.name}
                          </span>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
                            خط ساخن: {rest.hotline || rest.phone} • {rest.address}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedRestIdForMenu(isEditingMenu ? null : rest.id)}
                            className="px-2.5 py-1 bg-amber-500/15 text-amber-600 rounded-lg font-black text-xs hover:bg-amber-500/25 transition"
                          >
                            {isEditingMenu ? 'إغلاق المنيو' : `تعديل المنيو (${rest.menu.length})`}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRestaurant(rest.id)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                            title="حذف المطعم"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Menu Management Sub-panel */}
                      {isEditingMenu && (
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-slate-800 dark:text-white">
                              قائمة طعام {rest.name}:
                            </span>
                            <span className="text-[10px] text-slate-400">
                              يمكنك إضافة أو حذف أي صنف
                            </span>
                          </div>

                          {/* Add Menu Item */}
                          <form onSubmit={handleAddMenuItem} className="flex gap-2 items-center">
                            <input
                              type="text"
                              required
                              placeholder="اسم الصنف الجديد"
                              value={newMenuItemName}
                              onChange={(e) => setNewMenuItemName(e.target.value)}
                              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                            />
                            <input
                              type="number"
                              required
                              placeholder="السعر (ج.م)"
                              value={newMenuItemPrice}
                              onChange={(e) => setNewMenuItemPrice(e.target.value)}
                              className="w-20 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg text-xs"
                            >
                              + إضافة
                            </button>
                          </form>

                          {/* Menu Items List */}
                          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scroll divide-y divide-slate-100 dark:divide-slate-800">
                            {rest.menu.map((m) => (
                              <div key={m.id} className="pt-1.5 flex items-center justify-between">
                                <span className="font-bold text-slate-800 dark:text-white">
                                  {m.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-amber-500 font-black">{m.price} ج.م</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMenuItem(rest.id, m.id)}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: AUDIT & HONESTY BROADCAST ================= */}
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-amber-500" />
                  <span>جرد الثلاجة ومطابقة الأمانة</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  سجل العدد الفعلي الموجود في الثلاجة الآن لمقارنته مع المسجل في السيستم
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleHonestyBroadcast}
                className={`text-xs px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 transition ${
                  appData.config.broadcastActive
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                }`}
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>
                  {appData.config.broadcastActive ? 'التنبيه مفعل (اضغط للإلغاء)' : 'بث تنبيه للرواد'}
                </span>
              </button>
            </div>

            {/* Audit Table */}
            <div className="space-y-2 max-h-72 overflow-y-auto custom-scroll pr-1">
              {appData.products.map((p) => {
                const actual = actualStockMap[p.id] !== undefined ? actualStockMap[p.id] : p.stock;
                const deficit = p.stock - actual;
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <div>
                      <div className="font-black text-slate-800 dark:text-white">{p.name}</div>
                      <div className="text-[11px] text-slate-500">
                        السيستم: <span className="text-[var(--brand-color)] font-black">{p.stock}</span> | السعر: {p.price} ج.م
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-bold">الفعلي بالثلاجة:</span>
                      <input
                        type="number"
                        min="0"
                        value={actual}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value) || 0);
                          setActualStockMap((prev) => ({ ...prev, [p.id]: val }));
                        }}
                        className="w-16 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-1 text-center font-black text-slate-900 dark:text-white"
                      />
                      {deficit > 0 && (
                        <span className="text-[10px] text-red-500 font-black">
                          عجز: {deficit} ({deficit * p.price} ج.م)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Deficit Banner */}
            <div className="p-3.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-bold">
                إجمالي العجز غير المسجل:
              </span>
              <span className="text-base font-black text-red-500">
                {calculatedDeficit} ج.م
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleApplyAudit}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-xl shadow-md transition"
              >
                اعتماد المخزون الفعلي
              </button>
              <button
                type="button"
                onClick={handleCopyWhatsApp}
                className="py-2.5 px-4 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black text-xs rounded-xl flex items-center gap-1.5 hover:bg-slate-300 transition"
              >
                {copiedWhatsapp ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedWhatsapp ? 'تم نسخ الرسالة' : 'نسخ رسالة واتساب مهذبة'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB: PENDING PAYMENTS ================= */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-500" />
                <span>إيصالات الدفع المعلقة للاعتماد</span>
              </h4>
              <span className="text-xs bg-amber-500/15 text-amber-600 px-3 py-1 rounded-full font-black">
                {pendingPayments.length} معلق
              </span>
            </div>

            {pendingPayments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                لا توجد إيصالات دفع معلقة حالياً. كل الحسابات معتمدة!
              </p>
            ) : (
              <div className="space-y-3">
                {pendingPayments.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-sm text-slate-900 dark:text-white block">
                          {p.userName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          وسيلة: {p.method} | مرجع: {p.ref} | {p.time}
                        </span>
                      </div>
                      <span className="text-base font-black text-emerald-500">
                        {p.amount} ج.م
                      </span>
                    </div>

                    {p.receiptImg && (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-black/60 border border-slate-300 dark:border-slate-700">
                        <img
                          src={p.receiptImg}
                          alt="Receipt Screenshot"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApprovePayment(p.id)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>اعتماد الإيصال وتصفير الحساب</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: STORIES / REELS ================= */}
        {activeTab === 'stories' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-purple-500" />
              <span>نشر ريلز وقصص سهرات الرووف</span>
            </h4>

            <form onSubmit={handleAddStory} className="space-y-2.5">
              <input
                type="text"
                required
                placeholder="عنوان الريل أو الستوري (مثال: سهرة الخميس والجو رايق 🔥)"
                value={newStoryTitle}
                onChange={(e) => setNewStoryTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newStoryType}
                  onChange={(e) => setNewStoryType(e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="image">صورة (Image)</option>
                  <option value="video">فيديو ريل (MP4 Video)</option>
                </select>
                <input
                  type="url"
                  required
                  placeholder="رابط الصورة أو الفيديو (URL)"
                  value={newStoryUrl}
                  onChange={(e) => setNewStoryUrl(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-md transition"
              >
                نشر الريل في شريط الستوريز للمستخدمين
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <h5 className="text-xs font-black text-slate-700 dark:text-slate-300">
                الريلز المعروضة حالياً:
              </h5>
              {appData.stories.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {s.title} ({s.type === 'video' ? 'فيديو' : 'صورة'})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteStory(s.id)}
                    className="text-red-500 font-bold hover:underline"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: BRANDING & PALETTE ================= */}
        {activeTab === 'branding' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-5 shadow-sm">
            <div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-2.5">
                <Palette className="w-4 h-4 text-[var(--brand-color)]" />
                <span>بنتونة ألوان التطبيق والأيقونات (Theme Palette)</span>
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {(['orange', 'emerald', 'blue', 'purple'] as const).map((key) => {
                  const pal = colorAccents[key];
                  const isCur = appData.config.themeAccent === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleThemeChange(key, pal.brand)}
                      className={`p-3 rounded-2xl border transition-all font-black ${
                        isCur
                          ? 'border-[var(--brand-color)] bg-[var(--brand-color)]/15 text-slate-900 dark:text-white ring-2 ring-[var(--brand-color)]'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full mx-auto mb-1 block"
                        style={{ backgroundColor: pal.brand }}
                      ></span>
                      <span>{pal.nameAr}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => {
                    setCustomHex(e.target.value);
                    handleThemeChange('custom', e.target.value);
                  }}
                  className="w-9 h-9 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-white block">
                    اختيار لون مخصص بالكامل (Custom Color)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{customHex}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[var(--brand-color)]" />
                <span>التحكم باللوجو والبانر الرئيسي</span>
              </h4>

              <div>
                <label className="text-xs text-slate-500 mb-1 block font-bold">
                  تغيير لوجو التطبيق (Logo Image):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadLogoFile}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-slate-200 dark:file:bg-slate-800 file:text-[var(--brand-color)] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block font-bold">
                  تغيير صورة البانر العلوي (Hero Banner):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadBannerFile}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-slate-200 dark:file:bg-slate-800 file:text-[var(--brand-color)] cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  onUpdateData({
                    ...appData,
                    config: {
                      ...appData.config,
                      bannerImg:
                        'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
                      logoImg: '',
                    },
                  });
                  alert('تمت استعادة اللوجو والبانر الافتراضي!');
                }}
                className="py-2 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                استرجاع اللوجو والبانر الافتراضي
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB: MOEIN AI GOVERNANCE ================= */}
        {activeTab === 'moein' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-orange-500" />
                <span>إدارة وحوكمة المساعد الذكي (مُعين)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                تحديد نطاق مهامه، ما هو مسموح له قوله للمستخدمين، وحماية أسرار الفكرة والبزنس
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-black text-xs text-slate-800 dark:text-white block">
                    تفعيل روبوت مُعين بالتطبيق
                  </span>
                  <span className="text-[10px] text-slate-400">تشغيل أو تعطيل المساعد بالكامل</span>
                </div>
                <input
                  type="checkbox"
                  checked={moeinEnabled}
                  onChange={(e) => setMoeinEnabled(e.target.checked)}
                  className="w-5 h-5 accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-black text-xs text-slate-800 dark:text-white block">
                    إظهار مُعين في صفحات المستخدمين
                  </span>
                  <span className="text-[10px] text-slate-400">
                    عند إيقافه، يختفي من واجهة المستخدمين ويظل متاحاً فقط لمدير النظام
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={moeinShowUsers}
                  onChange={(e) => setMoeinShowUsers(e.target.checked)}
                  className="w-5 h-5 accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 dark:text-slate-300 font-bold mb-1 block">
                  رسالة الترحيب التي ينطق بها مُعين:
                </label>
                <textarea
                  rows={2}
                  value={moeinWelcome}
                  onChange={(e) => setMoeinWelcome(e.target.value)}
                  placeholder="يا هلا بيك يا غالي في الرووف..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 dark:text-slate-300 font-bold mb-1 block">
                  الموضوعات المصرح لمُعين التحدث فيها (Permitted Topics):
                </label>
                <input
                  type="text"
                  value={moeinTopics}
                  onChange={(e) => setMoeinTopics(e.target.value)}
                  placeholder="شرح طريقة الاستخدام، التيكيت، ميني بار الأمانة..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs text-red-500 font-black mb-1 block">
                  الموضوعات والأسرار الممنوع الخوض فيها تماماً (Forbidden Secrets):
                </label>
                <input
                  type="text"
                  value={moeinForbidden}
                  onChange={(e) => setMoeinForbidden(e.target.value)}
                  placeholder="أسرار الفكرة، التفاصيل المالية الداخلية، والعقود..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-red-200 dark:border-red-950 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveMoein}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md transition"
              >
                اعتماد وتثبيت إعدادات مُعين
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB: HUMAN AUDIO ================= */}
        {activeTab === 'audio' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-pink-500" />
              <span>رفع التسجيلات الصوتية البشرية المخصصة (MP3/WAV)</span>
            </h4>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    ١. تسجيل الترحيب عند فتح التطبيق:
                  </span>
                  <button
                    type="button"
                    onClick={() => onPlayAudioPreview('welcome')}
                    className="text-[11px] bg-slate-200 dark:bg-slate-800 text-[var(--brand-color)] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>سماع</span>
                  </button>
                </div>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const r = new FileReader();
                      r.onload = (ev) => {
                        onUpdateData({
                          ...appData,
                          config: { ...appData.config, audioWelcome: (ev.target?.result as string) || '' },
                        });
                        alert('تم حفظ تسجيل الترحيب!');
                      };
                      r.readAsDataURL(f);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:bg-slate-200 dark:file:bg-slate-800 file:text-pink-500 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    ٢. تسجيل صوتي عند تأكيد التيكيت:
                  </span>
                  <button
                    type="button"
                    onClick={() => onPlayAudioPreview('ticket')}
                    className="text-[11px] bg-slate-200 dark:bg-slate-800 text-[var(--brand-color)] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>سماع</span>
                  </button>
                </div>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const r = new FileReader();
                      r.onload = (ev) => {
                        onUpdateData({
                          ...appData,
                          config: { ...appData.config, audioTicket: (ev.target?.result as string) || '' },
                        });
                        alert('تم حفظ تسجيل التيكيت!');
                      };
                      r.readAsDataURL(f);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:bg-slate-200 dark:file:bg-slate-800 file:text-pink-500 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    ٣. تسجيل صوتي تذكير نظام أمانة البار:
                  </span>
                  <button
                    type="button"
                    onClick={() => onPlayAudioPreview('bar')}
                    className="text-[11px] bg-slate-200 dark:bg-slate-800 text-[var(--brand-color)] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>سماع</span>
                  </button>
                </div>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const r = new FileReader();
                      r.onload = (ev) => {
                        onUpdateData({
                          ...appData,
                          config: { ...appData.config, audioBar: (ev.target?.result as string) || '' },
                        });
                        alert('تم حفظ تسجيل البار!');
                      };
                      r.readAsDataURL(f);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:bg-slate-200 dark:file:bg-slate-800 file:text-pink-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: SETTINGS & BACKUP ================= */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[var(--brand-color)]" />
              <span>هوية التطبيق وإعدادات الدخول والنسخ</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block font-bold">اسم التطبيق:</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block font-bold">الوصف الترحيبي:</label>
                <input
                  type="text"
                  value={appSubtitle}
                  onChange={(e) => setAppSubtitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block font-bold">رمز دخول المدير (PIN):</label>
                  <input
                    type="text"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block font-bold">سعر التيكيت اليومي (ج.م):</label>
                  <input
                    type="number"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block font-bold">عنوان إنستاباي:</label>
                  <input
                    type="text"
                    value={instapay}
                    onChange={(e) => setInstapay(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block font-bold">رقم فودافون كاش:</label>
                  <input
                    type="text"
                    value={vodafone}
                    onChange={(e) => setVodafone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                className="w-full py-2.5 bg-[var(--brand-color)] text-white font-black text-xs rounded-xl shadow-md transition"
              >
                تثبيت وحفظ إعدادات الهوية
              </button>
            </div>

            {/* Backup & Restore System */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <h5 className="text-xs font-black text-slate-700 dark:text-slate-300">
                النسخ الاحتياطي واسترجاع البيانات:
              </h5>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير نسخة احتياطية</span>
                </button>

                <label className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition text-center">
                  <Upload className="w-4 h-4" />
                  <span>استيراد نسخة (JSON)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm">
              <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>ملخص النشاط الأخير بالرووف</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <span className="text-slate-500">طلبات حجز التيكيت بانتظار القبول:</span>
                  <span className="font-black text-orange-500">{pendingBookings.length} طلب</span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <span className="text-slate-500">مجموع الطلبات المسجلة بالبار:</span>
                  <span className="font-black text-slate-800 dark:text-white">{appData.orders.length} طلب</span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <span className="text-slate-500">إجمالي قيمة مسحوبات البار:</span>
                  <span className="font-black text-[var(--brand-color)]">{totalOrdersAmount} ج.م</span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <span className="text-slate-500">عدد مطاعم شبرا المعتمدة بالدليل:</span>
                  <span className="font-black text-amber-500">{restaurantsList.length} مطعم</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className="p-3 bg-orange-500/10 border border-orange-500/25 rounded-2xl text-right text-xs font-black text-orange-600 dark:text-orange-400"
              >
                🎟️ مراجعة طلبات الحجز ({pendingBookings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('restaurants')}
                className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-right text-xs font-black text-amber-600 dark:text-amber-400"
              >
                🍔 إدارة مطاعم وقوائم شبرا ({restaurantsList.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
