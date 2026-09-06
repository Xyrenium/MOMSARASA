import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Clock, UtensilsCrossed, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../utils/formatters';

export const Navbar: React.FC = () => {
  const { cart, setIsCartOpen, settings } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotalPrice * item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#DC2626]/10 py-3.5'
          : 'bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#DC2626]/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-md shadow-red-500/15 group-hover:scale-105 transition-transform shrink-0 border border-stone-200/80 bg-white flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="Logo MOMSARASA"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.classList.add('bg-[#DC2626]', 'text-white');
                  target.parentElement.innerHTML = '<span class="font-black text-sm text-white">M</span>';
                }
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-[#DC2626]">
                MOMSARASA
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 bg-[#F59E0B] text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                Premium
              </span>
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden xs:block">
              Western Potato Specialties
            </p>
          </div>
        </a>

        {/* Center: Hours & Status + Editorial Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-green-700">
              Open 07:00 - 21:00
            </span>
          </div>

          <nav className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-[#111827]/60">
            <a
              href="#"
              className="text-[#DC2626] border-b-2 border-[#DC2626] pb-0.5 transition-colors"
            >
              Home
            </a>
            <a href="#menu" className="hover:text-[#DC2626] transition-colors">
              Menu
            </a>
            <a href="#delivery-channels" className="hover:text-[#DC2626] transition-colors">
              Delivery
            </a>
            <a href="#lokasi" className="hover:text-[#DC2626] transition-colors">
              Location
            </a>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Cart Button */}
          <button
            id="btn-nav-cart"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs uppercase tracking-widest shadow-md shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Bag</span>
            {totalItems > 0 ? (
              <span className="flex items-center gap-1 ml-0.5">
                <span className="px-1.5 py-0.5 text-[11px] font-black bg-white text-[#DC2626] rounded-md">
                  {totalItems}
                </span>
                <span className="hidden md:inline text-white/90 text-xs font-bold normal-case">
                  ({formatRupiah(cartSubtotal)})
                </span>
              </span>
            ) : (
              <span className="text-[11px] opacity-80">(0)</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
