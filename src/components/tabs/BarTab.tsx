import React, { useState } from 'react';
import {
  GlassWater,
  CupSoda,
  Coffee,
  Sparkles,
  Droplet,
  Zap,
  Plus,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Product } from '../../types';

interface BarTabProps {
  products: Product[];
  onTakeItem: (productId: string) => void;
  currencyText: string;
  t: Record<string, string>;
}

export const BarTab: React.FC<BarTabProps> = ({
  products,
  onTakeItem,
  currencyText,
  t,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [justTakenId, setJustTakenId] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: t.cat_all },
    { id: 'cold', name: t.cat_cold },
    { id: 'hot', name: t.cat_hot },
    { id: 'snacks', name: t.cat_snacks },
  ];

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const getProductIcon = (iconName?: string, category?: string) => {
    switch (iconName) {
      case 'droplet':
        return <Droplet className="w-5 h-5" />;
      case 'cup-soda':
        return <CupSoda className="w-5 h-5" />;
      case 'zap':
        return <Zap className="w-5 h-5" />;
      case 'coffee':
        return <Coffee className="w-5 h-5" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5" />;
      default:
        return category === 'cold' ? (
          <CupSoda className="w-5 h-5" />
        ) : category === 'hot' ? (
          <Coffee className="w-5 h-5" />
        ) : (
          <GlassWater className="w-5 h-5" />
        );
    }
  };

  const handleTake = (id: string) => {
    onTakeItem(id);
    setJustTakenId(id);
    setTimeout(() => {
      setJustTakenId(null);
    }, 1200);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Title & Honesty Tag */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-base text-slate-900 dark:text-white">
            {t.bar_title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.bar_desc}
          </p>
        </div>
        <div className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-bold border border-slate-200 dark:border-slate-700">
          <ShieldCheck className="w-4 h-4 text-[var(--brand-color)]" />
          <span>{t.honesty_tag}</span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scroll">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
              activeCategory === c.id
                ? 'bg-[var(--brand-color)] text-white shadow-md shadow-[var(--brand-glow)]'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredProducts.map((p) => {
          const isTaken = justTakenId === p.id;
          return (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 flex flex-col justify-between hover:border-[var(--brand-color)] transition-all shadow-sm group overflow-hidden"
            >
              {/* Product Image or Icon Banner */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2 border border-slate-200/60 dark:border-slate-800">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--brand-color)] bg-[var(--brand-color)]/10">
                    {getProductIcon(p.icon, p.category)}
                  </div>
                )}

                {/* Stock Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md ${
                      p.stock > 3
                        ? 'bg-black/60 text-white'
                        : p.stock > 0
                        ? 'bg-amber-500/90 text-white animate-pulse'
                        : 'bg-red-500/90 text-white'
                    }`}
                  >
                    {p.stock > 0 ? `${t.left}: ${p.stock}` : t.out_of_stock}
                  </span>
                </div>
              </div>

              <div className="mt-1">
                <h4 className="text-xs font-black text-slate-800 dark:text-white line-clamp-2 leading-tight">
                  {p.name}
                </h4>
                <div className="text-base font-black text-[var(--brand-color)] mt-1">
                  {p.price}{' '}
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {currencyText}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleTake(p.id)}
                disabled={p.stock <= 0}
                className={`mt-2.5 w-full py-2 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                  isTaken
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-[var(--brand-color)] text-slate-800 dark:text-slate-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none'
                }`}
              >
                {isTaken ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تم التسجيل بالهنا!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.take_item}</span>
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
