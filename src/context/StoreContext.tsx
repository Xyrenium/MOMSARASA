import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, StoreSettings, BulkDiscountConfig } from '../types';
import { INITIAL_MENU, INITIAL_SETTINGS } from '../data/initialData';

interface AddToCartPayload {
  menuItem: MenuItem;
  quantity: number;
  selectedSauce: string;
  extraSauces: string[];
  spiceLevel: 'Original' | 'Mild Paprika' | 'Spicy Kick' | 'Extra Hot';
  specialNotes?: string;
  extraPrice: number;
}

interface StoreContextType {
  menu: MenuItem[];
  settings: StoreSettings;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  customizingItem: MenuItem | null;
  setCustomizingItem: (item: MenuItem | null) => void;
  previewItem: MenuItem | null;
  setPreviewItem: (item: MenuItem | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  addToCart: (payload: AddToCartPayload) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  updateMenuItem: (updatedItem: MenuItem) => void;
  addMenuItem: (newItem: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemStock: (id: string) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  updateBulkDiscount: (bulk: Partial<BulkDiscountConfig>) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MENU: 'momsarasa_menu_v2',
  SETTINGS: 'momsarasa_settings_v2',
  CART: 'momsarasa_cart_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_MENU;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return INITIAL_SETTINGS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [previewItem, setPreviewItem] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cross-tab synchronization via storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.MENU && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setMenu(parsed);
        } catch {
          // ignore
        }
      }
      if (e.key === STORAGE_KEYS.SETTINGS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch {
          // ignore
        }
      }
      if (e.key === STORAGE_KEYS.CART && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setCart(parsed);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
    } catch (err) {
      console.error('Failed to save menu to localStorage', err);
    }
  }, [menu]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings to localStorage', err);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const addToCart = (payload: AddToCartPayload) => {
    const itemUnitPrice = payload.menuItem.price + payload.extraPrice;
    const cartItemId = `${payload.menuItem.id}-${payload.selectedSauce}-${payload.extraSauces.sort().join('_')}-${payload.spiceLevel}-${payload.specialNotes || ''}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += payload.quantity;
        return updated;
      }
      return [
        ...prevCart,
        {
          cartItemId,
          menuItem: payload.menuItem,
          quantity: payload.quantity,
          selectedSauce: payload.selectedSauce,
          extraSauces: payload.extraSauces,
          spiceLevel: payload.spiceLevel,
          specialNotes: payload.specialNotes,
          itemTotalPrice: itemUnitPrice,
        },
      ];
    });

    showToast(`✓ "${payload.menuItem.name}" berhasil ditambahkan ke keranjang!`);
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.cartItemId !== cartItemId);
      }
      return prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item));
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item dihapus dari keranjang.');
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenu((prev) => {
      const updated = prev.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      try {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving updated menu to localStorage', err);
      }
      return updated;
    });

    // Also update current cart items if they match this updated item
    setCart((prevCart) =>
      prevCart.map((cartItem) => {
        if (cartItem.menuItem.id === updatedItem.id) {
          const extraPrice = cartItem.itemTotalPrice - cartItem.menuItem.price;
          return {
            ...cartItem,
            menuItem: updatedItem,
            itemTotalPrice: updatedItem.price + (extraPrice > 0 ? extraPrice : 0),
          };
        }
        return cartItem;
      })
    );

    showToast(`Menu "${updatedItem.name}" berhasil diperbarui!`);
  };

  const addMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    const id = `item-${Date.now()}`;
    const fullItem: MenuItem = { ...newItem, id };
    setMenu((prev) => {
      const updated = [fullItem, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving new menu to localStorage', err);
      }
      return updated;
    });
    showToast(`Menu baru "${newItem.name}" ditambahkan!`);
  };

  const deleteMenuItem = (id: string) => {
    setMenu((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(updated));
      } catch (err) {
        console.error('Error deleting menu from localStorage', err);
      }
      return updated;
    });
    setCart((prev) => prev.filter((item) => item.menuItem.id !== id));
    showToast('Item menu berhasil dihapus.');
  };

  const toggleItemStock = (id: string) => {
    setMenu((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      );
      try {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving stock toggle to localStorage', err);
      }
      return updated;
    });
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving settings to localStorage', err);
      }
      return updated;
    });
    showToast('Pengaturan MOMSARASA berhasil disimpan.');
  };

  const updateBulkDiscount = (bulk: Partial<BulkDiscountConfig>) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        bulkDiscount: { ...prev.bulkDiscount, ...bulk },
      };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving bulk discount to localStorage', err);
      }
      return updated;
    });
    showToast('Pengaturan Diskon Grosir diperbarui.');
  };

  const resetToDefaults = () => {
    setMenu(INITIAL_MENU);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    showToast('Data berhasil di-reset ke pengaturan standar MOMSARASA.');
  };

  return (
    <StoreContext.Provider
      value={{
        menu,
        settings,
        cart,
        isCartOpen,
        setIsCartOpen,
        isAdminOpen,
        setIsAdminOpen,
        customizingItem,
        setCustomizingItem,
        previewItem,
        setPreviewItem,
        toastMessage,
        showToast,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        toggleItemStock,
        updateSettings,
        updateBulkDiscount,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
