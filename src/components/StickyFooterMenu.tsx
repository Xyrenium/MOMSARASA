import React from 'react';
import { Zap, UtensilsCrossed, MapPin, Bike, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const StickyFooterMenu: React.FC = () => {
  const { cart, setIsCartOpen, settings } = useStore();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuickOrder = () => {
    if (cart.length > 0) {
      setIsCartOpen(true);
    } else {
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#menu';
      }
    }
  };

  return (
    <nav
      id="sticky-footer-menu"
      aria-label="Menu Pintas Bawah"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] transition-all"
    >
      <div className="max-w-md sm:max-w-lg mx-auto px-3 sm:px-6 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around gap-1 sm:gap-2">
        {/* 1. Quick Order */}
        <button
          id="btn-sticky-quick-order"
          type="button"
          onClick={handleQuickOrder}
          className="relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all group active:scale-95"
          aria-label={totalItems > 0 ? `Quick Order (${totalItems} item di keranjang)` : 'Quick Order Menu'}
        >
          <div className="relative w-10 h-10 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center shadow-md shadow-red-500/25 group-hover:bg-[#B91C1C] transition-colors">
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300 shrink-0" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 bg-[#111827] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[11px] font-black text-[#111827] mt-1 whitespace-nowrap tracking-tight group-hover:text-[#DC2626]">
            Quick Order
          </span>
        </button>

        {/* 2. GrabFood (Redirect) */}
        <a
          id="btn-sticky-grabfood"
          href={settings.grabFoodUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all group active:scale-95"
          aria-label="Buka GrabFood MOMSARASA (Tab baru)"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
            <Bike className="w-5 h-5 shrink-0" />
            <ExternalLink className="w-2.5 h-2.5 absolute top-1 right-1 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-[11px] font-bold text-stone-700 mt-1 whitespace-nowrap tracking-tight group-hover:text-emerald-600">
            GrabFood
          </span>
        </a>

        {/* 3. GoFood (Redirect) */}
        <a
          id="btn-sticky-gofood"
          href={settings.goFoodUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all group active:scale-95"
          aria-label="Buka GoFood MOMSARASA (Tab baru)"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-red-50 border border-red-200/70 text-[#DC2626] flex items-center justify-center font-black group-hover:bg-[#DC2626] group-hover:text-white transition-all shadow-xs">
            <UtensilsCrossed className="w-5 h-5 shrink-0" />
            <ExternalLink className="w-2.5 h-2.5 absolute top-1 right-1 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-[11px] font-bold text-stone-700 mt-1 whitespace-nowrap tracking-tight group-hover:text-[#DC2626]">
            GoFood
          </span>
        </a>

        {/* 4. Maps (Redirect) */}
        <a
          id="btn-sticky-maps"
          href={settings.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all group active:scale-95"
          aria-label="Buka Petunjuk Arah Google Maps (Tab baru)"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/70 text-blue-600 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
            <MapPin className="w-5 h-5 shrink-0" />
            <ExternalLink className="w-2.5 h-2.5 absolute top-1 right-1 opacity-60 group-hover:opacity-100" />
          </div>
          <span className="text-[11px] font-bold text-stone-700 mt-1 whitespace-nowrap tracking-tight group-hover:text-blue-600">
            Maps
          </span>
        </a>
      </div>
    </nav>
  );
};
