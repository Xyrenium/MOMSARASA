import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  MessageCircle,
  MapPin,
  User,
  Phone,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { calculateCartSummary, formatRupiah, generateWhatsAppOrderMessage } from '../utils/formatters';
import { OrderCheckoutForm } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    settings,
  } = useStore();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');
  const [formData, setFormData] = useState<OrderCheckoutForm>({
    customerName: '',
    customerPhone: '',
    orderType: 'delivery',
    deliveryAddress: '',
    paymentMethod: 'QRIS',
    notes: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const summary = calculateCartSummary(cart, settings.bulkDiscount);

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep('checkout');
    setFormError(null);
  };

  const handleDispatchWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName.trim()) {
      setFormError('Silakan masukkan Nama Anda terlebih dahulu.');
      return;
    }

    if (!formData.customerPhone.trim()) {
      setFormError('Silakan masukkan Nomor WhatsApp Anda.');
      return;
    }

    if (formData.orderType === 'delivery' && !formData.deliveryAddress.trim()) {
      setFormError('Silakan masukkan Alamat Pengiriman lengkap untuk pesanan Delivery.');
      return;
    }

    const encodedMessage = generateWhatsAppOrderMessage(
      cart,
      formData,
      settings.bulkDiscount
    );

    const targetUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodedMessage}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#DC2626]/10 bg-[#FAF9F6] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#DC2626] text-white flex items-center justify-center font-black shadow-md shadow-red-500/20">
                <ShoppingBag className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-[#111827] uppercase tracking-tight leading-tight">
                  {checkoutStep === 'cart' ? 'MOMSARASA Bag' : 'Order Checkout'}
                </h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {summary.totalItemCount} Items Selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {checkoutStep === 'checkout' && (
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="px-2.5 py-1 text-xs font-black uppercase text-[#111827] hover:text-[#DC2626] mr-1"
                >
                  Back
                </button>
              )}
              <button
                id="btn-close-cart"
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-[#111827] hover:bg-stone-200/60"
                aria-label="Tutup Keranjang"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dynamic Bulk Discount Ticker / Progress Bar */}
          {settings.bulkDiscount.isEnabled && cart.length > 0 && (
            <div className="p-3.5 bg-[#FAF9F6] border-b border-gray-200">
              <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                <span className="flex items-center gap-1.5 text-[#111827] uppercase text-[10px] tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Promo Grosir {settings.bulkDiscount.discountPercentage}% OFF
                </span>
                {summary.isEligibleForDiscount ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#F59E0B] text-[#111827] text-[9px] uppercase font-black tracking-wider">
                    Diskon Aktif!
                  </span>
                ) : (
                  <span className="text-gray-400 text-[10px] font-bold uppercase">
                    Min. {settings.bulkDiscount.minItems} Items
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    summary.isEligibleForDiscount
                      ? 'bg-emerald-500'
                      : 'bg-[#DC2626]'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (summary.totalItemCount / settings.bulkDiscount.minItems) * 100
                    )}%`,
                  }}
                />
              </div>

              <p className="text-[11px] text-[#111827]/80 mt-1.5 font-medium">
                {summary.isEligibleForDiscount ? (
                  <span className="text-emerald-700 font-bold">
                    🎉 Hemat {formatRupiah(summary.discountAmount)} untuk pesanan ini!
                  </span>
                ) : (
                  <span>
                    Tambah <strong className="text-[#DC2626] font-bold">{summary.itemsNeededForDiscount} item lagi</strong> untuk diskon {settings.bulkDiscount.discountPercentage}%!
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-white">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF9F6] text-[#DC2626] border border-gray-100 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="text-base font-bold text-[#111827]">Keranjang masih kosong</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  Silakan pilih menu Western Snack & Potato favorit Anda di daftar menu MOMSARASA.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-5 py-2.5 rounded-2xl bg-[#DC2626] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-500/20"
                >
                  Lihat Menu Sekarang
                </button>
              </div>
            ) : checkoutStep === 'cart' ? (
              /* Step 1: Cart Items List */
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
                  <span>Selected Items</span>
                  <button
                    onClick={clearCart}
                    className="text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-3.5 rounded-2xl border border-gray-100 bg-[#FAF9F6] flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 bg-gray-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h5 className="font-bold text-[#111827] text-sm leading-tight">
                              {item.menuItem.name}
                            </h5>
                            <p className="text-xs font-black text-[#DC2626] mt-0.5">
                              {formatRupiah(item.itemTotalPrice)}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-stone-300 hover:text-red-600 p-1 transition-colors"
                          title="Hapus menu ini"
                          aria-label="Hapus menu ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item Customizations Details */}
                      <div className="text-[11px] text-[#111827]/80 bg-white rounded-xl p-2.5 space-y-0.5 border border-gray-100">
                        {item.selectedSauce && (
                          <p>
                            <span className="font-bold">Saus Utama:</span>{' '}
                            {item.selectedSauce}
                          </p>
                        )}
                        {item.extraSauces.length > 0 && (
                          <p>
                            <span className="font-bold text-[#DC2626]">Extra:</span>{' '}
                            {item.extraSauces.join(', ')}
                          </p>
                        )}
                        <p>
                          <span className="font-bold">Rasa:</span> {item.spiceLevel}
                        </p>
                        {item.specialNotes && (
                          <p className="italic text-gray-400">
                            &quot;{item.specialNotes}&quot;
                          </p>
                        )}
                      </div>

                      {/* Quantity row */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-stone-700 hover:bg-gray-100"
                            aria-label="Kurangi"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-xs text-[#111827]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-stone-700 hover:bg-gray-100"
                            aria-label="Tambah"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-black text-sm text-[#111827]">
                          {formatRupiah(item.itemTotalPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Step 2: Checkout Form */
              <form id="form-checkout-momsarasa" onSubmit={handleDispatchWhatsApp} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Service Type Selection */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1.5">
                    Layanan Pesanan
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['delivery', 'takeaway', 'dine-in'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, orderType: type })}
                        className={`py-2 px-1 text-xs font-bold rounded-xl border uppercase tracking-wider transition-all ${
                          formData.orderType === type
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 text-[#111827] bg-[#FAF9F6] hover:bg-white'
                        }`}
                      >
                        {type === 'delivery' && '🛵 Delivery'}
                        {type === 'takeaway' && '🥡 Takeaway'}
                        {type === 'dine-in' && '🍽️ Dine-In'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Name */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1">
                    Nama Pemesan <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1">
                    Nomor WhatsApp <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="Contoh: 0812XXXXXXXX"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>
                </div>

                {/* Address (for delivery) */}
                {formData.orderType === 'delivery' && (
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1">
                      Alamat Pengiriman Lengkap <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <textarea
                        required
                        rows={2}
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                        placeholder="Nama jalan, nomor rumah, patokan lokasi..."
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#DC2626]"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1.5">
                    Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['QRIS', 'BCA Transfer', 'Cash / COD'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method })}
                        className={`py-2 px-1 text-xs font-bold rounded-xl border uppercase tracking-wider transition-all ${
                          formData.paymentMethod === method
                            ? 'border-[#DC2626] bg-red-50 text-[#DC2626]'
                            : 'border-gray-200 text-[#111827] bg-[#FAF9F6] hover:bg-white'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extra Notes */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1">
                    Catatan Pesanan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Contoh: Titip di pos satpam..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:border-[#DC2626]"
                  />
                </div>
              </form>
            )}
          </div>

          {/* Footer & Pricing Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#FAF9F6] border-t border-gray-200 shrink-0 space-y-3">
              <div className="space-y-1.5 text-xs text-[#111827]">
                <div className="flex justify-between">
                  <span>Subtotal ({summary.totalItemCount} porsi)</span>
                  <span className="font-bold">
                    {formatRupiah(summary.subtotal)}
                  </span>
                </div>

                {summary.isEligibleForDiscount && (
                  <div className="flex justify-between text-[#111827] font-bold bg-[#F59E0B]/20 border border-[#F59E0B]/40 px-2 py-1 rounded-md">
                    <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                      Diskon Grosir ({settings.bulkDiscount.discountPercentage}%)
                    </span>
                    <span>-{formatRupiah(summary.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base sm:text-lg font-black text-[#111827] pt-1.5 border-t border-gray-200">
                  <span className="uppercase tracking-wider text-xs font-black">Total</span>
                  <span className="text-[#DC2626]">{formatRupiah(summary.finalTotal)}</span>
                </div>
              </div>

              {checkoutStep === 'cart' ? (
                <button
                  id="btn-proceed-checkout"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all hover:scale-[1.01]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="form-checkout-momsarasa"
                  id="btn-send-whatsapp-order"
                  className="w-full py-3.5 px-4 rounded-2xl bg-black hover:bg-[#DC2626] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Pesanan ke WhatsApp</span>
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
