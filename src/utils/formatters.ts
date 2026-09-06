import { CartItem, OrderCheckoutForm, BulkDiscountConfig } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateCartSummary(
  items: CartItem[],
  bulkConfig: BulkDiscountConfig
) {
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.itemTotalPrice * item.quantity, 0);

  const isEligibleForDiscount =
    bulkConfig.isEnabled && totalItemCount >= bulkConfig.minItems;

  const discountAmount = isEligibleForDiscount
    ? Math.round((subtotal * bulkConfig.discountPercentage) / 100)
    : 0;

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const itemsNeededForDiscount = Math.max(0, bulkConfig.minItems - totalItemCount);

  return {
    totalItemCount,
    subtotal,
    isEligibleForDiscount,
    discountAmount,
    finalTotal,
    itemsNeededForDiscount,
  };
}

export function generateWhatsAppOrderMessage(
  items: CartItem[],
  checkout: OrderCheckoutForm,
  bulkConfig: BulkDiscountConfig
): string {
  const { totalItemCount, subtotal, isEligibleForDiscount, discountAmount, finalTotal } =
    calculateCartSummary(items, bulkConfig);

  const itemsList = items
    .map((item, index) => {
      const sauceDetail = item.selectedSauce ? `• Pilihan Saus: ${item.selectedSauce}` : '';
      const extraDetail =
        item.extraSauces.length > 0 ? `• Saus Tambahan (+Rp 5.000): ${item.extraSauces.join(', ')}` : '';
      const spiceDetail = `• Level Rasa: ${item.spiceLevel}`;
      const notesDetail = item.specialNotes ? `• Catatan: "${item.specialNotes}"` : '';

      const details = [sauceDetail, extraDetail, spiceDetail, notesDetail]
        .filter(Boolean)
        .join('\n   ');

      return `${index + 1}. *${item.menuItem.name}* (x${item.quantity}) - ${formatRupiah(item.itemTotalPrice * item.quantity)}\n   ${details}`;
    })
    .join('\n\n');

  let discountText = '';
  if (isEligibleForDiscount) {
    discountText = `🎁 *Diskon Grosir (${bulkConfig.discountPercentage}% OFF)*: -${formatRupiah(discountAmount)}\n`;
  }

  const message = `*HALO MOMSARASA, SAYA INGIN MEMESAN:*
━━━━━━━━━━━━━━━━━━━━━
📋 *DATA PEMESAN:*
• Nama: ${checkout.customerName || '-'}
• No. WhatsApp: ${checkout.customerPhone || '-'}
• Layanan: ${checkout.orderType.toUpperCase()}
• Alamat Pengiriman: ${checkout.orderType === 'delivery' ? (checkout.deliveryAddress || '-') : 'Ambil di Outlet MOMSARASA'}
• Pembayaran Pilihan: ${checkout.paymentMethod}
${checkout.notes ? `• Catatan Khusus: ${checkout.notes}` : ''}

🍟 *RINCIAN MENU YANG DIPESAN:*
━━━━━━━━━━━━━━━━━━━━━
${itemsList}

━━━━━━━━━━━━━━━━━━━━━
📊 *TOTAL REKAPITULASI:*
• Total Item: ${totalItemCount} porsi
• Subtotal: ${formatRupiah(subtotal)}
${discountText}• *TOTAL PEMBAYARAN: ${formatRupiah(finalTotal)}*
━━━━━━━━━━━━━━━━━━━━━

Mohon info konfirmasi stok & estimasi pengerjaan/ongkos kirim ya MOMSARASA. Terima kasih banyak!`;

  return encodeURIComponent(message);
}
