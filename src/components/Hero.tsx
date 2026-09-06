import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ShoppingBag, Flame, Sparkles, ArrowDown, MapPin, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { settings, setIsCartOpen } = useStore();

  return (
    <section
      id="hero-section"
      className="relative pt-28 pb-16 lg:pb-20 bg-[#FAF9F6] text-[#111827] border-b border-[#DC2626]/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col justify-between"
          >
            <div>
              {/* Category & Quality Badges */}
              <div className="mb-4 flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 bg-[#F59E0B] text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                  Premium Quality
                </span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  MOMSARASA Western Specialty
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Open 07:00 - 21:00
                </span>
              </div>

              {/* Massive Editorial Headline */}
              <h2 className="text-4xl sm:text-6xl lg:text-[80px] leading-[0.92] font-black text-[#111827] mb-6 italic tracking-tighter">
                THE<br />
                ULTIMATE<br />
                <span className="text-[#DC2626]">POTATO.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#111827]/70 leading-relaxed max-w-md mb-6 font-medium">
                Elevating the humble potato into a masterclass of flavor. Crispy, golden, and loaded with our signature Western toppings, fresh dory fish fillets, and homemade sauces.
              </p>

              {/* Bulk discount tag */}
              {settings.bulkDiscount.isEnabled && (
                <div className="mb-6 p-4 rounded-2xl bg-white border border-[#DC2626]/20 shadow-xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4 text-[#111827]" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#111827] uppercase tracking-wider">
                      Promo Grosir: Diskon {settings.bulkDiscount.discountPercentage}%
                    </p>
                    <p className="text-[11px] text-[#111827]/70 mt-0.5">
                      Pesan min. {settings.bulkDiscount.minItems} item di menu WhatsApp untuk potongan otomatis!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Editorial Quick Delivery Cards & Outlet Card */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3.5">
                {/* GrabFood card */}
                <a
                  href={settings.grabFoodUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-white border border-gray-100 hover:border-[#DC2626] rounded-2xl shadow-xs transition-colors group"
                >
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl font-bold text-sm shrink-0">
                    GF
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Order via
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[#111827] group-hover:text-emerald-600 transition-colors truncate">
                      GrabFood
                    </p>
                  </div>
                </a>

                {/* GoFood card */}
                <a
                  href={settings.goFoodUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-white border border-gray-100 hover:border-[#DC2626] rounded-2xl shadow-xs transition-colors group"
                >
                  <div className="w-10 h-10 bg-red-50 text-red-600 flex items-center justify-center rounded-xl font-bold text-sm shrink-0">
                    GF
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Order via
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[#111827] group-hover:text-red-600 transition-colors truncate">
                      GoFood
                    </p>
                  </div>
                </a>
              </div>

              {/* Outlet Black Card */}
              <a
                href="#lokasi"
                className="p-4 bg-[#111827] hover:bg-stone-900 text-white rounded-2xl flex items-center justify-between transition-colors shadow-sm group"
              >
                <div>
                  <p className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest mb-0.5">
                    Find Us
                  </p>
                  <p className="text-xs sm:text-sm font-medium">
                    MOMSARASA Outlet Main
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Buka 07:00 - 21:00 WIB
                  </p>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                  <MapPin className="w-5 h-5 text-amber-300" />
                </div>
              </a>

              {/* Direct WhatsApp CTA Button */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="#menu"
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs uppercase tracking-widest text-center shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>Interactive Menu & Order</span>
                </a>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    'Halo MOMSARASA, saya mau tanya menu dan pesan Western Snack & Potato Specialties hari ini. Terima kasih!'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-5 rounded-2xl bg-white border border-stone-200 hover:border-[#DC2626] text-[#111827] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Chat WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 relative flex flex-col items-center"
          >
            <div className="relative w-full max-w-[480px] aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
                alt="MOMSARASA Mix Platter Jumbo Western Snack Specialties"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/90 via-transparent to-black/20" />

              {/* Top Tag */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-[#DC2626] text-white shadow-md">
                  👑 Signature Platter
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-[#F59E0B] text-[#111827] shadow-md">
                  Crispy & Golden
                </span>
              </div>

              {/* Bottom Card Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-[#111827] border border-gray-100 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Signature Feast
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#111827] leading-tight">
                      MIX PLATTER JUMBO
                    </h3>
                    <p className="text-xs text-[#111827]/70 mt-0.5">
                      Fish, Chicken, Wedges, Fries + 2 Homemade Sauces
                    </p>
                  </div>
                  <div className="text-right pl-3 shrink-0">
                    <span className="text-[11px] text-gray-400 line-through block">
                      Rp 75.000
                    </span>
                    <span className="text-lg font-black text-[#DC2626]">
                      Rp 65.000
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Editorial Highlights row beneath image */}
            <div className="mt-5 grid grid-cols-3 gap-3 w-full max-w-[480px]">
              <div className="p-3 bg-white border border-gray-100 rounded-2xl text-center shadow-xs">
                <p className="text-xs font-black text-[#DC2626]">100% Real</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Russet Potato</p>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-2xl text-center shadow-xs">
                <p className="text-xs font-black text-[#F59E0B]">Fresh Fried</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Cooked to Order</p>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-2xl text-center shadow-xs">
                <p className="text-xs font-black text-[#111827]">4 Sauces</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Homemade Taste</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
