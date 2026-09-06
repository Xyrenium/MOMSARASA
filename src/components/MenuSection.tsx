import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Sparkles, Utensils, Award, SlidersHorizontal, ArrowRight, MessageCircle, Maximize2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MenuItem } from '../types';
import { calculateCartSummary, formatRupiah } from '../utils/formatters';

type CategoryFilter = 'all' | 'specialties' | 'potatoes' | 'platters';

export const MenuSection: React.FC = () => {
  const { menu, setCustomizingItem, setPreviewItem, settings, cart, setIsCartOpen } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'platters', label: 'Platters' },
    { id: 'specialties', label: 'Chips & Meat' },
    { id: 'potatoes', label: 'Crispy Potatoes' },
  ];

  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ? true : item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menu, selectedCategory, searchQuery]);

  const summary = calculateCartSummary(cart, settings.bulkDiscount);

  return (
    <section id="menu" className="py-16 sm:py-20 bg-white border-b border-[#DC2626]/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#F59E0B] text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                Fresh & Hot
              </span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                MOMSARASA Signature Selection
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-[#111827]">
              Interactive Menu
            </h3>
          </div>

          {/* Editorial Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                  className={`px-3.5 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-tighter rounded-full transition-all ${
                    isActive
                      ? 'border-2 border-black bg-black text-white'
                      : 'text-gray-400 border border-gray-200 bg-white hover:border-black/50 hover:text-black'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input Filter */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Fish And Chips, Wedges, Fries..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF9F6] border border-gray-200 text-stone-800 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:border-[#DC2626] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Menu Grid - 2 columns on tablet/desktop for clean editorial ratio */}
        {filteredItems.length === 0 ? (
          <div className="bg-[#FAF9F6] rounded-2xl p-12 text-center border border-gray-100">
            <Utensils className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-stone-800">Menu tidak ditemukan</h4>
            <p className="text-stone-500 text-xs mt-1">
              Coba cari dengan kata kunci lain atau reset filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const currentQty = cart
                  .filter((c) => c.menuItem.id === item.id)
                  .reduce((sum, c) => sum + c.quantity, 0);

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className={`group p-3.5 sm:p-4 border border-gray-100 bg-[#FAF9F6] hover:bg-white rounded-2xl flex items-center gap-4 relative overflow-hidden transition-all duration-200 hover:border-[#DC2626]/30 hover:shadow-md ${
                      !item.isAvailable ? 'opacity-60 grayscale-[40%]' : ''
                    }`}
                  >
                    {/* Item Image with click to enlarge preview */}
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-xl overflow-hidden shrink-0 relative cursor-pointer group/img"
                      onClick={() => setPreviewItem(item)}
                      title={`Klik untuk memperbesar foto ${item.name}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setPreviewItem(item);
                        }
                      }}
                      aria-label={`Lihat foto besar ${item.name}`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      {/* Zoom indicator on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="w-7 h-7 rounded-full bg-white/95 text-stone-900 flex items-center justify-center shadow-md">
                          <Maximize2 className="w-3.5 h-3.5 text-stone-800" />
                        </div>
                      </div>
                      {item.badge && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider bg-[#DC2626] text-white rounded pointer-events-none">
                          {item.badge}
                        </span>
                      )}
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 pointer-events-none">
                          <span className="text-[9px] font-black text-white uppercase text-center">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 pr-10 sm:pr-12">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <h4 className="text-sm sm:text-base font-bold text-[#111827] leading-tight group-hover:text-[#DC2626] transition-colors">
                          {item.name}
                        </h4>
                      </div>

                      <p className="text-xs text-gray-400 mb-1.5 line-clamp-1 font-medium">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2">
                        <p className="text-sm sm:text-base font-black text-[#DC2626]">
                          {formatRupiah(item.price)}
                        </p>
                        <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">
                          • {item.includedSauceCount > 1 ? `Free ${item.includedSauceCount} Sauces` : 'Free Sauce'}
                        </span>
                      </div>
                    </div>

                    {/* Plus / Quantity Button - Positioned in bottom right like design template */}
                    <button
                      id={`btn-order-item-${item.id}`}
                      disabled={!item.isAvailable}
                      onClick={() => setCustomizingItem(item)}
                      aria-label={`Pilih ${item.name}`}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-sm absolute right-3.5 bottom-3.5 transition-all shadow-xs ${
                        !item.isAvailable
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : currentQty > 0
                          ? 'bg-[#DC2626] text-white shadow-md shadow-red-500/30'
                          : 'bg-black hover:bg-[#DC2626] text-white'
                      }`}
                    >
                      {currentQty > 0 ? currentQty : '+'}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Editorial Order Summary Banner (matching Design HTML) */}
        <div className="mt-12 p-6 sm:p-8 bg-[#DC2626] rounded-3xl text-white flex flex-col relative overflow-hidden shadow-xl shadow-red-600/20">
          <div className="absolute -right-6 -top-6 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">
                Your Order Summary
              </p>
              <h4 className="text-xl sm:text-2xl font-bold">
                {summary.totalItemCount > 0
                  ? `${summary.totalItemCount} Items Selected`
                  : 'MOMSARASA Bag Ready'}
              </h4>
            </div>

            {summary.isEligibleForDiscount ? (
              <div className="px-4 py-2 bg-[#F59E0B] text-[#111827] rounded-xl text-xs font-black uppercase shadow-lg animate-bounce">
                {settings.bulkDiscount.discountPercentage}% Bulk Discount Applied
              </div>
            ) : settings.bulkDiscount.isEnabled ? (
              <div className="px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/20">
                Tambah {settings.bulkDiscount.minItems - summary.totalItemCount} lagi untuk Diskon {settings.bulkDiscount.discountPercentage}%
              </div>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-white/20 pt-6 gap-4 relative z-10">
            <div>
              <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider">
                Total Amount
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl sm:text-3xl font-black">
                  {formatRupiah(summary.finalTotal)}
                </p>
                {summary.isEligibleForDiscount && (
                  <span className="text-sm line-through opacity-60 font-semibold">
                    {formatRupiah(summary.subtotal)}
                  </span>
                )}
              </div>
            </div>

            <button
              id="btn-banner-checkout"
              onClick={() => setIsCartOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-white hover:bg-stone-100 text-[#DC2626] font-black rounded-2xl uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2.5 transition-transform active:scale-95"
            >
              <span>Checkout via WhatsApp</span>
              <MessageCircle className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
