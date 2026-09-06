import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, Utensils, Check, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../utils/formatters';

export const ImageLightboxModal: React.FC = () => {
  const { previewItem, setPreviewItem, setCustomizingItem } = useStore();

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewItem(null);
      }
    };

    if (previewItem) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [previewItem, setPreviewItem]);

  if (!previewItem) return null;

  const handleOrderFromPreview = () => {
    const item = previewItem;
    setPreviewItem(null);
    if (item.isAvailable) {
      setCustomizingItem(item);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="image-lightbox-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={`Preview foto ${previewItem.name}`}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/92 backdrop-blur-md"
        onClick={() => setPreviewItem(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative max-w-3xl w-full max-h-[92vh] flex flex-col bg-[#111827] rounded-2xl sm:rounded-3xl border border-stone-800 shadow-2xl overflow-hidden text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-stone-800/80 bg-[#111827]/80 backdrop-blur-xs shrink-0">
            <div className="flex items-center gap-2.5 min-w-0 pr-4">
              <div className="w-8 h-8 rounded-lg bg-[#DC2626]/20 border border-[#DC2626]/40 flex items-center justify-center text-[#DC2626] shrink-0">
                <ZoomIn className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
                    {previewItem.category}
                  </span>
                  {previewItem.badge && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#DC2626] text-white px-2 py-0.5 rounded-md">
                      {previewItem.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate mt-0.5">
                  {previewItem.name}
                </h3>
              </div>
            </div>

            {/* Close Button */}
            <button
              id="btn-close-image-lightbox"
              onClick={() => setPreviewItem(null)}
              className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors shrink-0 active:scale-95"
              aria-label="Tutup preview gambar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image Container */}
          <div className="relative flex-1 min-h-[220px] max-h-[58vh] bg-black/60 flex items-center justify-center overflow-hidden p-2 sm:p-4">
            <img
              src={previewItem.image}
              alt={previewItem.name}
              className="max-h-[54vh] w-auto max-w-full object-contain rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />

            {!previewItem.isAvailable && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                <div className="px-4 py-2 bg-stone-900/90 border border-red-500/50 rounded-xl text-center">
                  <span className="text-sm sm:text-base font-black text-red-400 uppercase tracking-widest">
                    STOK HABIS (SOLD OUT)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Info & Action Bar */}
          <div className="p-4 sm:p-5 bg-stone-900 border-t border-stone-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shrink-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2.5">
                <span className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  {formatRupiah(previewItem.price)}
                </span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5" />
                  {previewItem.includedSauceCount > 1
                    ? `Gratis ${previewItem.includedSauceCount} Saus Pilihan`
                    : 'Gratis 1 Saus Pilihan'}
                </span>
              </div>

              {previewItem.description && (
                <p className="text-xs sm:text-sm text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                  {previewItem.description}
                </p>
              )}
            </div>

            {/* Quick action button */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              <button
                id="btn-order-from-preview"
                onClick={handleOrderFromPreview}
                disabled={!previewItem.isAvailable}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                  previewItem.isAvailable
                    ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-red-500/25'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{previewItem.isAvailable ? 'Pesan / Kustomisasi' : 'Menu Habis'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
