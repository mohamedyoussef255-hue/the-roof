export interface User {
  id: string;
  name: string;
  phone: string;
  balance: number;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: 'cold' | 'hot' | 'snacks' | string;
  icon?: string;
  image?: string;
}

export interface Story {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  timestamp?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  time: string;
}

export interface OrderRecord {
  id: string;
  userId: string;
  userName: string;
  item: string;
  price: number;
  time: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: string;
  ref: string;
  receiptImg?: string;
  status: 'pending' | 'approved' | 'rejected';
  time: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  location?: string;
}

export interface TicketBooking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  bookingDate: string; // e.g. "اليوم - 27 أكتوبر" or YYYY-MM-DD
  slotTime: string; // e.g. "08:00 م"
  guestsCount: number;
  notes?: string;
  status: 'pending' | 'approved' | 'confirmed' | 'rejected' | 'cancelled';
  rejectionReason?: string;
  ticketPrice: number;
  createdAt: string;
  approvedAt?: string;
  confirmedAt?: string;
}

export interface AppConfig {
  appName: string;
  appSubtitle: string;
  adminPin: string;
  ticketPrice: number;
  logoImg: string;
  bannerImg: string;
  broadcastActive: boolean;
  themeAccent: 'orange' | 'emerald' | 'blue' | 'purple' | 'custom';
  customBrandColor?: string;
  lang: 'ar' | 'en';
  darkMode: boolean;
  audioWelcome: string;
  audioTicket: string;
  audioBar: string;
  paymentInfo: {
    instapay: string;
    vodafone: string;
    other: string;
  };
  moeinSettings: {
    enabled: boolean;
    showOnUserPages: boolean;
    voiceSpeechEnabled: boolean;
    permittedTopics: string;
    forbiddenSecrets: string;
    customWelcome: string;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface ShubraRestaurant {
  id: string;
  name: string;
  category: 'koshary' | 'chicken' | 'shawarma' | 'grills' | 'pizza' | 'desserts' | 'juices' | string;
  address: string;
  phone: string;
  hotline?: string;
  image?: string;
  rating?: number;
  deliveryAvailable: boolean;
  notes?: string;
  menu: MenuItem[];
}

export interface AppData {
  config: AppConfig;
  currentUser: User;
  users: User[];
  products: Product[];
  stories: Story[];
  attendance: AttendanceRecord[];
  orders: OrderRecord[];
  payments: PaymentRecord[];
  chatMessages: ChatMessage[];
  events: EventItem[];
  bookings: TicketBooking[];
  shubraRestaurants: ShubraRestaurant[];
}


