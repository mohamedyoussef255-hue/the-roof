import React, { useState } from 'react';
import {
  X,
  UtensilsCrossed,
  Phone,
  MapPin,
  Star,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  Check,
  Search,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ShubraRestaurant } from '../types';

interface ShubraFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants: ShubraRestaurant[];
  onShareInChat: (restaurantName: string, itemsText?: string) => void;
}

export const ShubraFoodModal: React.FC<ShubraFoodModalProps> = ({
  isOpen,
  onClose,
  restaurants,
  onShareInChat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRestId, setExpandedRestId] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'koshary', name: 'كشري وطواجن' },
    { id: 'chicken', name: 'فرايد تشيكن وبرجر' },
    { id: 'shawarma', name: 'شاورما وسوري' },
    { id: 'grills', name: 'مشويات وكباب' },
    { id: 'pizza', name: 'بيتزا وفطير شرقي' },
    { id: 'desserts', name: 'حلويات وقشطوطة' },
    { id: 'juices', name: 'عصائر فريش' },
  ];

  const filtered = restaurants.filter((r) => {
    const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.menu.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleCopyPhone = (num: string, key: string) => {
    navigator.clipboard.writeText(num);
    setCopiedPhone(key);
    setTimeout(() => setCopiedPhone(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-4 sm:p-5 space-y-4 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black border border-amber-500/25">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>دليل مطاعم شارع شبرا مصر</span>
                <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black">
                  دليفري الرووف
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                أحدث قوائم الطعام وأرقام التليفونات والخط الساخن لأحلى سهرة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مطعم أو أكلة بشبرا (كشري، شاورما، فرايد تشيكن، بيتزا)..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pr-9 pl-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[var(--brand-color)]"
          />
        </div>

        {/* Category Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scroll text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl font-black transition-all ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Restaurants List Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 custom-scroll">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              لا توجد مطاعم مطابقة لبحثك في شارع شبرا حالياً.
            </div>
          ) : (
            filtered.map((rest) => {
              const isExpanded = expandedRestId === rest.id;
              const phoneToCall = rest.hotline || rest.phone;

              return (
                <div
                  key={rest.id}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:border-amber-500/50 transition-all"
                >
                  {/* Restaurant Banner / Photo */}
                  {rest.image && (
                    <div className="relative w-full h-32 overflow-hidden bg-slate-900">
                      <img
                        src={rest.image}
                        alt={rest.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-2.5 right-3 left-3 flex items-end justify-between text-white">
                        <div>
                          <h4 className="font-black text-sm drop-shadow">{rest.name}</h4>
                          <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[220px]">{rest.address}</span>
                          </span>
                        </div>
                        {rest.rating && (
                          <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-lg text-xs font-black text-amber-400 backdrop-blur-sm">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{rest.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-3.5 space-y-2.5">
                    {!rest.image && (
                      <div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          {rest.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          <span>{rest.address}</span>
                        </span>
                      </div>
                    )}

                    {rest.notes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                        {rest.notes}
                      </p>
                    )}

                    {/* Phones & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${phoneToCall}`}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>اتصل بالدليفري: {phoneToCall}</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleCopyPhone(phoneToCall, rest.id)}
                          className="p-1.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 text-xs font-bold transition"
                          title="نسخ رقم الهاتف"
                        >
                          {copiedPhone === rest.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onShareInChat(rest.name)}
                          className="px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-black flex items-center gap-1 transition"
                          title="اقتراح الأكل للشلة في الشات"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>اقترح في الشات</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedRestId(isExpanded ? null : rest.id)}
                          className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-[11px] font-black flex items-center gap-1"
                        >
                          <span>المنيو ({rest.menu.length})</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Menu items */}
                    {isExpanded && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5 bg-white dark:bg-slate-900 p-3 rounded-2xl animate-in fade-in duration-200">
                        <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
                          <span>أشهر أصناف وقائمة أسعار {rest.name}:</span>
                          <span className="text-[10px] text-slate-400">أسعار حديثة</span>
                        </h5>
                        <div className="space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800">
                          {rest.menu.map((item) => (
                            <div
                              key={item.id}
                              className="pt-1.5 first:pt-0 flex items-start justify-between text-xs"
                            >
                              <div className="pr-2">
                                <span className="font-black text-slate-800 dark:text-white block">
                                  {item.name}
                                </span>
                                {item.description && (
                                  <span className="text-[10px] text-slate-400 block leading-tight">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                              <span className="shrink-0 font-black text-amber-600 dark:text-amber-400 text-xs">
                                {item.price} ج.م
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
