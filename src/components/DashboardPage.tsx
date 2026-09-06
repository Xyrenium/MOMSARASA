import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UtensilsCrossed,
  Settings,
  Percent,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Image,
  Upload,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
  LogOut,
  Store,
  Lock,
  User,
  AlertCircle,
  Clock,
  Phone,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  Maximize2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MenuItem } from '../types';
import { formatRupiah } from '../utils/formatters';
import { navigateTo } from '../utils/navigation';

const AUTH_STORAGE_KEY = 'momsarasa_admin_auth_token';

export const DashboardPage: React.FC = () => {
  const {
    menu,
    settings,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    toggleItemStock,
    updateSettings,
    updateBulkDiscount,
    resetToDefaults,
    showToast,
    setPreviewItem,
  } = useStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'authenticated' ||
        sessionStorage.getItem(AUTH_STORAGE_KEY) === 'authenticated';
    } catch {
      return false;
    }
  });

  // Login Form State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dashboard Tab State
  const [activeTab, setActiveTab] = useState<'menu' | 'discount' | 'store'>('menu');
  const [menuFilterCategory, setMenuFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Item Edit / Create Form State
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'file'>('url');
  const [itemForm, setItemForm] = useState<{
    name: string;
    category: 'specialties' | 'potatoes' | 'platters' | 'sauces';
    price: number;
    description: string;
    image: string;
    badge: string;
    isAvailable: boolean;
    includedSauceCount: number;
  }>({
    name: '',
    category: 'specialties',
    price: 30000,
    description: '',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    badge: '',
    isAvailable: true,
    includedSauceCount: 1,
  });

  // Store Settings Form State
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    // Verify credentials: momsarasa / 101101.Mom
    setTimeout(() => {
      const validUsername = 'momsarasa';
      const validPassword = '101101.Mom';

      if (usernameInput.trim() === validUsername && passwordInput === validPassword) {
        if (rememberMe) {
          localStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
        } else {
          sessionStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
        }
        setIsAuthenticated(true);
        showToast('Selamat datang di Dashboard Admin MOMSARASA!');
      } else {
        setLoginError('Username atau password salah. Silakan coba lagi.');
      }
      setIsSubmitting(false);
    }, 300);
  };

  // Logout Handler
  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    showToast('Anda telah keluar dari dashboard admin.');
  };

  const handleStartCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
    setItemForm({
      name: '',
      category: 'specialties',
      price: 30000,
      description: '',
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1000&q=80',
      badge: 'BARU',
      isAvailable: true,
      includedSauceCount: 1,
    });
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsCreating(false);
    setItemForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: item.image,
      badge: item.badge || '',
      isAvailable: item.isAvailable,
      includedSauceCount: item.includedSauceCount,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use Canvas to resize and compress photos so they fit within localStorage reliably
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setItemForm((prev) => ({ ...prev, image: compressed }));
          showToast('Foto berhasil diproses dan dikompresi siap simpan.');
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveItemForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name.trim()) return;

    if (isCreating) {
      addMenuItem({
        name: itemForm.name.trim(),
        category: itemForm.category,
        price: Number(itemForm.price),
        description: itemForm.description.trim(),
        image: itemForm.image,
        badge: itemForm.badge.trim() || undefined,
        isAvailable: itemForm.isAvailable,
        includedSauceCount: Number(itemForm.includedSauceCount),
      });
      showToast(`Menu "${itemForm.name}" berhasil ditambahkan!`);
      setIsCreating(false);
    } else if (editingItem) {
      updateMenuItem({
        id: editingItem.id,
        name: itemForm.name.trim(),
        category: itemForm.category,
        price: Number(itemForm.price),
        description: itemForm.description.trim(),
        image: itemForm.image,
        badge: itemForm.badge.trim() || undefined,
        isAvailable: itemForm.isAvailable,
        includedSauceCount: Number(itemForm.includedSauceCount),
      });
      showToast(`Menu "${itemForm.name}" berhasil diperbarui!`);
      setEditingItem(null);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      whatsappNumber: tempSettings.whatsappNumber.replace(/\D/g, ''),
      addressText: tempSettings.addressText,
      mapsUrl: tempSettings.mapsUrl,
      grabFoodUrl: tempSettings.grabFoodUrl,
      goFoodUrl: tempSettings.goFoodUrl,
    });
    showToast('Pengaturan outlet & kontak WhatsApp berhasil disimpan!');
  };

  // Filter menu items for dashboard
  const filteredMenu = menu.filter((item) => {
    const matchesCategory =
      menuFilterCategory === 'all' || item.category === menuFilterCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /* -------------------------------------------------------------
     VIEW 1: ADMIN LOGIN SCREEN (Unauthenticated)
     ------------------------------------------------------------- */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between text-[#111827] px-4 py-8 sm:py-12">
        {/* Top brand header */}
        <div className="w-full max-w-md mx-auto flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-red-500/20 shrink-0 border border-stone-200 bg-white flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="Logo MOMSARASA"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight leading-none text-[#111827]">
                MOMSARASA
              </h1>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Admin Portal
              </span>
            </div>
          </div>

          <button
            onClick={() => navigateTo('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-stone-700 hover:text-[#DC2626] text-xs font-bold transition-colors shadow-xs"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Lihat Toko</span>
          </button>
        </div>

        {/* Login Card (Mobile-First) */}
        <div className="w-full max-w-md mx-auto my-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-stone-200/50"
          >
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200/60 text-[#DC2626] text-[10px] font-black uppercase tracking-wider mb-2">
                <Lock className="w-3 h-3" />
                <span>Restricted Access</span>
              </div>
              <h2 className="text-2xl font-black text-[#111827] tracking-tight">
                Masuk ke Dashboard
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Akses khusus pengelola outlet MOMSARASA untuk mengelola menu, harga, dan diskon.
              </p>
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 mb-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#111827] mb-1.5">
                  Username Admin
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-admin-username"
                    type="text"
                    required
                    autoFocus
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-[#FAF9F6] text-sm text-[#111827] placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#DC2626] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#111827] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-[#FAF9F6] text-sm text-[#111827] placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#DC2626] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#DC2626] focus:ring-[#DC2626]"
                  />
                  <span>Ingat sesi di perangkat ini</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                id="btn-admin-login"
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Quick back link */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigateTo('/')}
              className="text-xs font-bold text-stone-500 hover:text-[#DC2626] transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Kembali ke Halaman Utama Pelanggan</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="w-full max-w-md mx-auto text-center mt-8 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} MOMSARASA Food Management System</p>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     VIEW 2: DEDICATED ADMIN DASHBOARD (Authenticated)
     ------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111827] flex flex-col">
      {/* 1. Dashboard Top Header Bar (Mobile-First) */}
      <header className="sticky top-0 z-40 bg-[#111827] text-white border-b border-stone-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-red-500/20 shrink-0 border border-stone-700 bg-white flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="Logo MOMSARASA"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg text-white tracking-tight">
                  MOMSARASA
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-black bg-[#F59E0B] text-[#111827] uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden xs:block">
                User: <span className="text-amber-400 font-bold">momsarasa</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Live Store */}
            <button
              id="btn-admin-view-store"
              onClick={() => navigateTo('/')}
              className="px-3 sm:px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-stone-700"
              title="Buka Halaman Pelanggan"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Lihat Toko</span>
            </button>

            {/* Logout */}
            <button
              id="btn-admin-logout"
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-red-800/40"
              title="Keluar dari Dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 border-t border-stone-800 overflow-x-auto flex gap-1 sm:gap-2 py-2 no-scrollbar">
          <button
            onClick={() => {
              setActiveTab('menu');
              setIsCreating(false);
              setEditingItem(null);
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'menu'
                ? 'bg-[#DC2626] text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Manajemen Menu ({menu.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('discount');
              setIsCreating(false);
              setEditingItem(null);
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'discount'
                ? 'bg-[#DC2626] text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Diskon Grosir ({settings.bulkDiscount.discountPercentage}%)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('store');
              setIsCreating(false);
              setEditingItem(null);
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'store'
                ? 'bg-[#DC2626] text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Info Outlet & WhatsApp</span>
          </button>
        </div>
      </header>

      {/* 2. Main Dashboard Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {/* Quick Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
              Total Menu
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#111827]">
              {menu.length}
            </span>
            <span className="text-[11px] text-emerald-600 block mt-0.5 font-semibold">
              {menu.filter((m) => m.isAvailable).length} Tersedia
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
              Menu Habis
            </span>
            <span className="text-xl sm:text-2xl font-black text-red-600">
              {menu.filter((m) => !m.isAvailable).length}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5 font-medium">
              Stok Kosong
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
              Diskon Grosir
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#F59E0B]">
              {settings.bulkDiscount.isEnabled ? `${settings.bulkDiscount.discountPercentage}%` : 'OFF'}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5 font-medium">
              Min {settings.bulkDiscount.minItems} Porsi
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
              WhatsApp Order
            </span>
            <span className="text-xs sm:text-sm font-black text-[#111827] truncate block mt-1">
              +{settings.whatsappNumber}
            </span>
            <span className="text-[11px] text-emerald-600 block font-semibold">
              Siap Menerima Chat
            </span>
          </div>
        </div>

        {/* TAB 1: MANAJEMEN MENU */}
        {activeTab === 'menu' && (
          <div>
            {/* If Adding or Editing an Item */}
            {isCreating || editingItem ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-100 shadow-sm max-w-3xl mx-auto mb-8"
              >
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                  <div>
                    <h3 className="font-black text-lg sm:text-xl text-[#111827]">
                      {isCreating ? 'Tambah Menu Baru' : `Edit Menu: ${editingItem?.name}`}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Perbarui foto, harga, nama, dan opsi saus produk
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingItem(null);
                    }}
                    className="p-2 text-stone-400 hover:text-stone-700 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveItemForm} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1">
                        Nama Menu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={itemForm.name}
                        onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                        placeholder="Contoh: Fish And Chips"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] text-xs sm:text-sm text-[#111827] focus:bg-white focus:outline-none focus:border-[#DC2626]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1">
                        Kategori Menu
                      </label>
                      <select
                        value={itemForm.category}
                        onChange={(e) =>
                          setItemForm({
                            ...itemForm,
                            category: e.target.value as any,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] text-xs sm:text-sm text-[#111827] focus:bg-white focus:outline-none focus:border-[#DC2626]"
                      >
                        <option value="specialties">Western Specialties</option>
                        <option value="potatoes">Crispy Potatoes</option>
                        <option value="platters">Sharing Platter</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1">
                        Harga (Rupiah) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min={1000}
                        step={1000}
                        value={itemForm.price}
                        onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] text-xs sm:text-sm text-[#111827] focus:bg-white focus:outline-none focus:border-[#DC2626]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1">
                        Badge Label
                      </label>
                      <input
                        type="text"
                        value={itemForm.badge}
                        onChange={(e) => setItemForm({ ...itemForm, badge: e.target.value })}
                        placeholder="BEST SELLER, BARU..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] text-xs sm:text-sm text-[#111827] focus:bg-white focus:outline-none focus:border-[#DC2626]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1">
                        Termasuk Saus
                      </label>
                      <select
                        value={itemForm.includedSauceCount}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, includedSauceCount: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] text-xs sm:text-sm text-[#111827] focus:bg-white focus:outline-none focus:border-[#DC2626]"
                      >
                        <option value={1}>1 Macam Saus</option>
                        <option value={2}>2 Macam Saus (Platter)</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1">
                      Deskripsi Menu
                    </label>
                    <textarea
                      rows={2}
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      placeholder="Jelaskan kelezatan hidangan ini..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FAF9F6] text-xs sm:text-sm text-[#111827] focus:bg-white focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>

                  {/* Image Options */}
                  <div className="p-4 rounded-2xl border border-gray-200 bg-[#FAF9F6]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-black uppercase tracking-wider text-[#111827]">
                        Foto Menu
                      </label>
                      <div className="flex gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setImageUploadMethod('url')}
                          className={`px-2.5 py-1 rounded-lg font-bold ${
                            imageUploadMethod === 'url'
                              ? 'bg-white shadow-xs text-[#DC2626]'
                              : 'text-stone-500'
                          }`}
                        >
                          Gunakan URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageUploadMethod('file')}
                          className={`px-2.5 py-1 rounded-lg font-bold ${
                            imageUploadMethod === 'file'
                              ? 'bg-white shadow-xs text-[#DC2626]'
                              : 'text-stone-500'
                          }`}
                        >
                          Upload File
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div
                        className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-200 border border-gray-200 shrink-0 shadow-xs cursor-pointer relative group/prev"
                        onClick={() => {
                          if (itemForm.image) {
                            setPreviewItem({
                              id: 'temp-preview',
                              name: itemForm.name || 'Preview Menu Baru',
                              category: itemForm.category,
                              price: Number(itemForm.price) || 0,
                              description: itemForm.description,
                              image: itemForm.image,
                              badge: itemForm.badge,
                              isAvailable: itemForm.isAvailable,
                              includedSauceCount: Number(itemForm.includedSauceCount) || 1,
                            });
                          }
                        }}
                        title="Klik untuk memperbesar pratinjau"
                      >
                        <img
                          src={itemForm.image}
                          alt="Preview"
                          className="w-full h-full object-cover group-hover/prev:scale-105 transition-transform"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/prev:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 w-full">
                        {imageUploadMethod === 'url' ? (
                          <input
                            type="url"
                            value={itemForm.image}
                            onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-[#111827] focus:outline-none focus:border-[#DC2626]"
                          />
                        ) : (
                          <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-xl bg-white hover:bg-stone-50 cursor-pointer">
                            <Upload className="w-5 h-5 text-stone-400 mb-1" />
                            <span className="text-xs text-stone-600 font-bold">
                              Pilih Foto dari Galeri / Kamera HP
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stock Status checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="item-available"
                      checked={itemForm.isAvailable}
                      onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-[#DC2626] focus:ring-[#DC2626]"
                    />
                    <label htmlFor="item-available" className="text-xs font-bold text-stone-700 cursor-pointer">
                      Tersedia untuk Dipesan (Stok Tersedia)
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingItem(null);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 text-stone-600 text-xs font-bold hover:bg-stone-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-red-500/20"
                    >
                      {isCreating ? 'Simpan Menu Baru' : 'Perbarui Menu'}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : null}

            {/* Menu Header & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#111827] uppercase tracking-tight">
                  Daftar Menu MOMSARASA
                </h3>
                <p className="text-xs text-stone-500">
                  Ubah status stok, edit harga, atau tambahkan varian baru
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama menu..."
                  className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs text-[#111827] focus:outline-none focus:border-[#DC2626] w-full sm:w-48"
                />

                <button
                  id="btn-add-new-menu"
                  onClick={handleStartCreate}
                  className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-md shadow-red-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Menu</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
              {[
                { id: 'all', label: 'Semua Menu' },
                { id: 'specialties', label: 'Western Specialties' },
                { id: 'potatoes', label: 'Crispy Potatoes' },
                { id: 'platters', label: 'Platter' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setMenuFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    menuFilterCategory === cat.id
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'bg-white text-stone-600 border border-gray-200 hover:bg-stone-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Menu Cards Grid (Mobile First: 1 col on mobile, 2 on md, 3 on xl) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all bg-white shadow-xs flex flex-col justify-between ${
                    item.isAvailable
                      ? 'border-gray-100'
                      : 'border-red-200 bg-red-50/20 opacity-80'
                  }`}
                >
                  <div>
                    {/* Top image & info */}
                    <div className="flex gap-3 items-start mb-3">
                      <div
                        className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-gray-100 cursor-pointer group/admimg"
                        onClick={() => setPreviewItem(item)}
                        title="Klik untuk memperbesar foto"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover/admimg:scale-110 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/admimg:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        {!item.isAvailable && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="text-[9px] font-black text-white uppercase tracking-wider bg-red-600 px-1.5 py-0.5 rounded">
                              Habis
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-stone-100 text-stone-700">
                            {item.category}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#F59E0B] text-[#111827]">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-[#111827] truncate">
                          {item.name}
                        </h4>

                        <p className="text-xs font-black text-[#DC2626] mt-0.5">
                          {formatRupiah(item.price)}
                        </p>

                        <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card bottom actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    {/* Stock Switch button */}
                    <button
                      onClick={() => toggleItemStock(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        item.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {item.isAvailable ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersedia</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Habis</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-[#111827] text-stone-700 hover:text-white transition-colors"
                        title="Edit Menu"
                        aria-label="Edit Menu"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus menu "${item.name}"?`)) {
                            deleteMenuItem(item.id);
                            showToast(`Menu "${item.name}" berhasil dihapus.`);
                          }
                        }}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition-colors"
                        title="Hapus Menu"
                        aria-label="Hapus Menu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: DISKON GROSIR & WHATSAPP */}
        {activeTab === 'discount' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#111827] uppercase tracking-tight">
                  Diskon Pembelian Grosir
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Atur potongan harga otomatis ketika pelanggan memesan dalam jumlah banyak melalui website atau WhatsApp.
                </p>
              </div>

              {/* Toggle Enable */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#111827]">
                    Aktifkan Promo Diskon Grosir
                  </h4>
                  <p className="text-xs text-stone-500">
                    Promo akan tampil di keranjang belanja & pesan WhatsApp
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.bulkDiscount.isEnabled}
                  onChange={(e) =>
                    updateBulkDiscount({ isEnabled: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-[#DC2626] focus:ring-[#DC2626]"
                />
              </div>

              {/* Discount Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1.5">
                    Minimal Pembelian (Porsi)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={50}
                    value={settings.bulkDiscount.minItems}
                    onChange={(e) =>
                      updateBulkDiscount({ minItems: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-[#111827] focus:outline-none focus:border-[#DC2626]"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Pelanggan beli minimal {settings.bulkDiscount.minItems} porsi
                  </span>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1.5">
                    Persentase Diskon (%)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={settings.bulkDiscount.discountPercentage}
                    onChange={(e) =>
                      updateBulkDiscount({ discountPercentage: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-[#DC2626] focus:outline-none focus:border-[#DC2626]"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Potongan otomatis {settings.bulkDiscount.discountPercentage}% dari subtotal
                  </span>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/60">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase mb-1">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>Preview Teks di WhatsApp Order:</span>
                </div>
                <p className="text-xs text-amber-800 font-mono italic">
                  &quot;🎉 Diskon Grosir ({settings.bulkDiscount.discountPercentage}%): -Rp ...&quot;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PENGATURAN TOKO & OUTLET */}
        {activeTab === 'store' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <form
              onSubmit={handleSaveSettings}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-5"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#111827] uppercase tracking-tight">
                  Informasi Toko & Kontak
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Kontak WhatsApp tujuan pesanan, alamat outlet, dan tautan online food delivery
                </p>
              </div>

              {/* WhatsApp Phone */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1.5">
                  Nomor WhatsApp Penerima Order <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={tempSettings.whatsappNumber}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })
                    }
                    placeholder="Contoh: 6285892809180"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-[#111827] focus:outline-none focus:border-[#DC2626]"
                  />
                </div>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Gunakan format internasional tanpa tanda + (contoh: 6285892809180)
                </span>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1.5">
                  Alamat Lengkap Outlet <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={3}
                    required
                    value={tempSettings.addressText}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, addressText: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#111827] focus:outline-none focus:border-[#DC2626]"
                  />
                </div>
              </div>

              {/* Google Maps Link */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1.5">
                  Link Google Maps
                </label>
                <input
                  type="url"
                  value={tempSettings.mapsUrl}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, mapsUrl: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#111827] focus:outline-none focus:border-[#DC2626]"
                />
              </div>

              {/* GrabFood Link */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1.5">
                  Link GrabFood Store
                </label>
                <input
                  type="url"
                  value={tempSettings.grabFoodUrl}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, grabFoodUrl: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#111827] focus:outline-none focus:border-[#DC2626]"
                />
              </div>

              {/* GoFood Link */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#111827] block mb-1.5">
                  Link GoFood Store
                </label>
                <input
                  type="url"
                  value={tempSettings.goFoodUrl}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, goFoodUrl: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#111827] focus:outline-none focus:border-[#DC2626]"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Kembalikan seluruh data menu & kontak ke pengaturan awal pabrik?')) {
                      resetToDefaults();
                      showToast('Data berhasil di-reset ke default awal.');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Reset Default
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-red-500/20 transition-all hover:scale-[1.01]"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
