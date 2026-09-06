import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ShoppingBag, ShieldCheck, Zap, Percent, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const DeliveryChannels: React.FC = () => {
  const { settings } = useStore();

  return (
    <section id="delivery-channels" className="py-16 sm:py-20 bg-[#FAF9F6] border-b border-[#DC2626]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#F59E0B] text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                Official Channels
              </span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                MOMSARASA Order Delivery
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-[#111827]">
              Order Channels
            </h3>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md">
            Pesan langsung lewat GrabFood, GoFood, atau gunakan WhatsApp resmi MOMSARASA untuk mendapatkan promo diskon grosir.
          </p>
        </div>

        {/* 3 Channels Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: GrabFood */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="p-6 bg-white border border-gray-100 hover:border-[#DC2626]/30 rounded-3xl shadow-xs flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                  GF
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Instant Delivery
                </span>
              </div>

              <h4 className="text-xl font-bold text-[#111827] mb-1">
                GrabFood
              </h4>
              <p className="text-stone-500 text-xs leading-relaxed mb-6">
                Pesan menu MOMSARASA praktis melalui aplikasi Grab. Pengantaran cepat oleh mitra driver GrabFood langsung ke lokasi Anda.
              </p>
            </div>

            <a
              id="btn-link-grabfood"
              href={settings.grabFoodUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Buka di GrabFood</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* Card 2: GoFood */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="p-6 bg-white border border-gray-100 hover:border-[#DC2626]/30 rounded-3xl shadow-xs flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg">
                  GF
                </div>
                <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Partner Resmi
                </span>
              </div>

              <h4 className="text-xl font-bold text-[#111827] mb-1">
                GoFood
              </h4>
              <p className="text-stone-500 text-xs leading-relaxed mb-6">
                Temukan outlet resmi MOMSARASA di aplikasi Gojek. Pembayaran mudah via GoPay / GoPayLater dengan promo ongkir.
              </p>
            </div>

            <a
              id="btn-link-gofood"
              href={settings.goFoodUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Buka di GoFood</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* Card 3: WhatsApp Direct (Best Savings & Bulk Discount) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="p-6 bg-[#111827] text-white rounded-3xl shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#F59E0B] flex items-center justify-center font-bold text-lg">
                  WA
                </div>
                <span className="text-[10px] font-black text-[#111827] bg-[#F59E0B] px-3 py-1 rounded-full uppercase tracking-tighter">
                  Hemat & Diskon Grosir
                </span>
              </div>

              <h4 className="text-xl font-bold text-white mb-1">
                WhatsApp Direct
              </h4>
              <p className="text-stone-300 text-xs leading-relaxed mb-6">
                Pesan langsung dengan sistem checkout terstruktur. Bebas custom saus dan otomatis dapat diskon grosir 10% untuk 5+ porsi!
              </p>
            </div>

            <button
              id="btn-cta-whatsapp-channel"
              onClick={() => {
                const menuElem = document.getElementById('menu');
                if (menuElem) {
                  menuElem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full py-3 px-4 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-red-500/30"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>Buka Menu & Pesan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
