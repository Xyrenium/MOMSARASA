import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { calculateCartSummary, formatRupiah } from '../utils/formatters';

export const FloatingCartPill: React.FC = () => {
  const { cart, setIsCartOpen, settings } = useStore();

  const summary = calculateCartSummary(cart, settings.bulkDiscount);

  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-22 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center">
      <motion.button
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        onClick={() => setIsCartOpen(true)}
        className="pointer-events-auto max-w-md w-full py-3 px-5 rounded-2xl bg-[#111827] text-white shadow-2xl shadow-black/40 border border-stone-800 flex items-center justify-between gap-3 hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center font-black shrink-0 shadow-md">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[10px] font-black bg-[#F59E0B] text-[#111827] rounded-md">
              {summary.totalItemCount}
            </span>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-300">
                {summary.totalItemCount} Items Selected
              </span>
              {summary.isEligibleForDiscount && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#F59E0B] text-[#111827] uppercase tracking-wider">
                  Diskon {settings.bulkDiscount.discountPercentage}%
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base font-black text-white">
              {formatRupiah(summary.finalTotal)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-black text-[#DC2626] bg-white py-2 px-3.5 rounded-xl uppercase tracking-wider shrink-0 shadow-xs">
          <span>Checkout WA</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </motion.button>
    </div>
  );
};
