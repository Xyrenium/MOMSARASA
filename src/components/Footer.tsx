import React from 'react';
import { UtensilsCrossed, MessageCircle, MapPin, Clock, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="bg-[#111827] text-white border-t border-[#DC2626]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-red-500/20 shrink-0 border border-stone-700 bg-white flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Logo MOMSARASA"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="font-black text-2xl tracking-tighter text-white">
                MOMSARASA
              </h2>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Spesialis Western Snack & Potato Specialties. Menyajikan Fish And Chips, Quesadilla Fries, Smoke Beef Fries, Potato Wedges, dan aneka saus racikan homemade berkualitas.
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="uppercase text-[10px] tracking-wider">100% Halal & Fresh Ingredients</span>
            </div>
          </div>

          {/* Col 2: Operational Hours & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-widest uppercase text-gray-400">
              Jam Buka & Outlet
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">07:00 - 21:00 WIB</p>
                  <p className="text-stone-400">Buka Setiap Hari (Senin - Minggu)</p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <p className="text-stone-300 leading-relaxed">
                  {settings.addressText}
                </p>
              </div>

              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#F59E0B] hover:underline font-bold pt-1 uppercase tracking-wider text-[10px]"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 3: Channel Delivery */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-widest uppercase text-gray-400">
              Pemesanan Online
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={settings.grabFoodUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-emerald-400 flex items-center gap-2 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>GrabFood MOMSARASA</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href={settings.goFoodUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-red-400 flex items-center gap-2 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>GoFood MOMSARASA</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-amber-400 flex items-center gap-2 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>WhatsApp (+{settings.whatsappNumber})</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-widest uppercase text-gray-400">
              Navigasi
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <a href="#hero-section" className="hover:text-white transition-colors">
                  Beranda MOMSARASA
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Daftar Menu & Harga
                </a>
              </li>
              <li>
                <a href="#delivery-channels" className="hover:text-white transition-colors">
                  Channel Pengantaran
                </a>
              </li>
              <li>
                <a href="#lokasi" className="hover:text-white transition-colors">
                  Petunjuk Arah & Lokasi
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-14 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} MOMSARASA. Western Snack & Potato Specialties. All rights reserved.</p>
          <div className="flex items-center gap-1 text-stone-400 text-[11px]">
            <span>Freshly made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for potato snack lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
