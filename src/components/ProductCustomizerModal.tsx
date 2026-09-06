import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Minus, Check, Utensils, Maximize2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_SAUCES } from '../data/initialData';
import { formatRupiah } from '../utils/formatters';

const SPICE_LEVELS: Array<'Original' | 'Mild Paprika' | 'Spicy Kick' | 'Extra Hot'> = [
  'Original',
  'Mild Paprika',
  'Spicy Kick',
  'Extra Hot',
];

export const ProductCustomizerModal: React.FC = () => {
  const { customizingItem, setCustomizingItem, setPreviewItem, addToCart } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedPrimarySauces, setSelectedPrimarySauces] = useState<string[]>([]);
  const [extraSauces, setExtraSauces] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<'Original' | 'Mild Paprika' | 'Spicy Kick' | 'Extra Hot'>('Original');
  const [specialNotes, setSpecialNotes] = useState('');

  const EXTRA_SAUCE_PRICE = 5000;

  useEffect(() => {
    if (customizingItem) {
      setQuantity(1);
      if (customizingItem.includedSauceCount > 1) {
        setSelectedPrimarySauces([INITIAL_SAUCES[0].name, INITIAL_SAUCES[1].name]);
      } else {
        setSelectedPrimarySauces([INITIAL_SAUCES[0].name]);
      }
      setExtraSauces([]);
      setSpiceLevel('Original');
      setSpecialNotes('');
    }
  }, [customizingItem]);

  if (!customizingItem) return null;

  const maxPrimarySauces = customizingItem.includedSauceCount || 1;

  const handleTogglePrimarySauce = (sauceName: string) => {
    if (selectedPrimarySauces.includes(sauceName)) {
      if (selectedPrimarySauces.length > 1) {
        setSelectedPrimarySauces((prev) => prev.filter((s) => s !== sauceName));
      }
    } else {
      if (selectedPrimarySauces.length < maxPrimarySauces) {
        setSelectedPrimarySauces((prev) => [...prev, sauceName]);
      } else {
        setSelectedPrimarySauces((prev) => [...prev.slice(1), sauceName]);
      }
    }
  };

  const handleToggleExtraSauce = (sauceName: string) => {
    setExtraSauces((prev) =>
      prev.includes(sauceName) ? prev.filter((s) => s !== sauceName) : [...prev, sauceName]
    );
  };

  const extraSauceTotalPrice = extraSauces.length * EXTRA_SAUCE_PRICE;
  const singleItemPrice = customizingItem.price + extraSauceTotalPrice;
  const totalPrice = singleItemPrice * quantity;

  const handleConfirmAddToCart = () => {
    addToCart({
      menuItem: customizingItem,
      quantity,
      selectedSauce: selectedPrimarySauces.join(' & '),
      extraSauces,
      spiceLevel,
      specialNotes: specialNotes.trim() || undefined,
      extraPrice: extraSauceTotalPrice,
    });
    setCustomizingItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        {/* Hero Image Header */}
        <div className="relative h-44 sm:h-52 bg-[#111827] shrink-0 overflow-hidden group/modalimg">
          <img
            src={customizingItem.image}
            alt={customizingItem.name}
            className="w-full h-full object-cover opacity-80 cursor-pointer transition-transform duration-500 hover:scale-105"
            onClick={() => setPreviewItem(customizingItem)}
            title="Klik untuk memperbesar gambar"
            referrerPolicy="no-referrer"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/30 to-transparent cursor-pointer"
            onClick={() => setPreviewItem(customizingItem)}
          />

          {/* Action buttons on top right */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => setPreviewItem(customizingItem)}
              className="px-2.5 py-1 rounded-full bg-black/60 hover:bg-black text-white flex items-center gap-1.5 backdrop-blur-sm border border-white/20 text-xs font-bold transition-all hover:scale-105"
              aria-label="Perbesar foto"
              title="Perbesar foto"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Perbesar Foto</span>
            </button>
            <button
              onClick={() => setCustomizingItem(null)}
              className="w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center backdrop-blur-sm border border-white/20 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title on image */}
          <div className="absolute bottom-4 left-4 right-4">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#F59E0B] text-[#111827]">
              {customizingItem.category.toUpperCase()}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1 uppercase tracking-tight">
              {customizingItem.name}
            </h3>
            <p className="text-amber-400 font-extrabold text-base">
              {formatRupiah(customizingItem.price)}
            </p>
          </div>
        </div>

        {/* Scrollable Customizer Form */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-left bg-[#FAF9F6]">
          {/* Section 1: Included Primary Sauce */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#111827] flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-[#DC2626]" />
                <span>Pilihan Dipping Sauce Utama</span>
              </label>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Termasuk {maxPrimarySauces} Saus
              </span>
            </div>
            <p className="text-stone-500 text-xs mb-3 font-medium">
              {maxPrimarySauces > 1
                ? `Pilih ${maxPrimarySauces} macam saus favorit Anda:`
                : 'Pilih 1 saus pendamping favorit:'}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {INITIAL_SAUCES.map((sauce) => {
                const isSelected = selectedPrimarySauces.includes(sauce.name);
                return (
                  <button
                    key={sauce.id}
                    type="button"
                    onClick={() => handleTogglePrimarySauce(sauce.name)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#DC2626] bg-red-50/70 text-[#DC2626] font-bold shadow-xs'
                        : 'border-gray-200 hover:border-black/30 text-[#111827] bg-[#FAF9F6]'
                    }`}
                  >
                    <span className="text-xs sm:text-sm leading-tight font-medium">{sauce.name}</span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-[#DC2626] border-[#DC2626] text-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Extra Dipping Sauces (+Rp 5.000) */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#111827]">
                Extra Dipping Sauce (+Rp 5.000/cup)
              </label>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Opsional</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-2">
              {INITIAL_SAUCES.map((sauce) => {
                const isExtraSelected = extraSauces.includes(sauce.name);
                return (
                  <button
                    key={`extra-${sauce.id}`}
                    type="button"
                    onClick={() => handleToggleExtraSauce(sauce.name)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isExtraSelected
                        ? 'border-[#F59E0B] bg-amber-50 text-[#111827] font-bold'
                        : 'border-gray-200 text-stone-600 hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <div>
                      <span className="text-xs block leading-tight">{sauce.name}</span>
                      <span className="text-[10px] text-[#DC2626] font-bold">+Rp 5.000</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        isExtraSelected
                          ? 'bg-[#F59E0B] border-[#F59E0B] text-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {isExtraSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Spice Level */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100">
            <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#111827] block mb-2">
              Level Taburan Rempah
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SPICE_LEVELS.map((level) => {
                const isSelected = spiceLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSpiceLevel(level)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center border uppercase tracking-wider transition-all ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 text-stone-600 hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Special Request Notes */}
          <div className="p-4 bg-white rounded-2xl border border-gray-100">
            <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#111827] block mb-1">
              Catatan Khusus (Opsional)
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="Contoh: Saus dipisah, kurangi garam..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#DC2626]"
            />
          </div>
        </div>

        {/* Modal Footer (Quantity & Add to Cart) */}
        <div className="p-4 sm:p-5 bg-white border-t border-gray-100 flex items-center justify-between gap-4 shrink-0">
          {/* Quantity selector */}
          <div className="flex items-center gap-2 bg-[#FAF9F6] border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 hover:bg-white disabled:opacity-30"
              aria-label="Kurangi porsi"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-black text-stone-900 text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 hover:bg-white"
              aria-label="Tambah porsi"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Confirm Button */}
          <button
            id="btn-confirm-add-cart"
            onClick={handleConfirmAddToCart}
            className="flex-1 py-3 px-5 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs uppercase tracking-widest flex items-center justify-between shadow-lg shadow-red-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Tambahkan ({quantity})</span>
            <span className="text-amber-300 font-extrabold">{formatRupiah(totalPrice)}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
