export type MenuCategory = 'all' | 'specialties' | 'potatoes' | 'platters' | 'sauces';

export interface DippingSauceOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'specialties' | 'potatoes' | 'platters' | 'sauces';
  price: number;
  description: string;
  image: string;
  badge?: string;
  isAvailable: boolean;
  includedSauceCount: number;
}

export interface SelectedSauce {
  sauceName: string;
  isExtra: boolean;
  extraPrice: number;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedSauce: string;
  extraSauces: string[];
  spiceLevel: 'Original' | 'Mild Paprika' | 'Spicy Kick' | 'Extra Hot';
  specialNotes?: string;
  itemTotalPrice: number;
}

export interface BulkDiscountConfig {
  isEnabled: boolean;
  minItems: number;
  discountPercentage: number;
  bannerNotice: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string; // e.g. "6281234567890"
  addressText: string;
  openingHoursText: string;
  mapsUrl: string;
  grabFoodUrl: string;
  goFoodUrl: string;
  bulkDiscount: BulkDiscountConfig;
}

export interface OrderCheckoutForm {
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'takeaway' | 'dine-in';
  deliveryAddress: string;
  paymentMethod: 'BCA Transfer' | 'QRIS' | 'Cash / COD';
  notes: string;
}

export interface ImagePreviewData {
  item: MenuItem;
}

