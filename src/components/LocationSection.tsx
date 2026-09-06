import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, ExternalLink, Check, Copy, Car, Utensils, Bike } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LocationSection: React.FC = () => {
  const { settings, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(settings.addressText);
    setCopied(true);
    showToast('Alamat outlet MOMSARASA berhasil disalin!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="lokasi" className="py-16 sm:py-20 bg-[#FAF9F6] border-b border-[#DC2626]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#F59E0B] text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                Find Our Outlet
              </span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                MOMSARASA Location
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-[#111827]">
              Visit Our Store
            </h3>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md">
            Nikmati aroma kentang goreng renyah dan menu lezat langsung di tempat kami, atau gunakan layanan Takeaway dan ojek online.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Outlet Details & Direct Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Primary Address Card */}
              <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/20">
                    <MapPin className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111827] text-base sm:text-lg">
                      MOMSARASA Outlet Main
                    </h4>
                    <p className="text-stone-500 text-xs sm:text-sm mt-1 leading-relaxed">
                      {settings.addressText}
                    </p>
                  </div>
                </div>

                {/* Copy address button */}
                <button
                  onClick={handleCopyAddress}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-200 hover:border-gray-400 bg-white text-stone-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Alamat Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-400" />
                      <span>Salin Alamat Lengkap</span>
                    </>
                  )}
                </button>
              </div>

              {/* Operating Hours & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
                  <div className="flex items-center gap-2 text-[#111827] font-bold text-xs mb-1">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Jam Buka</span>
                  </div>
                  <p className="text-xs text-stone-600 font-bold">
                    07:00 - 21:00 WIB
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Buka Setiap Hari
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
                  <div className="flex items-center gap-2 text-[#111827] font-bold text-xs mb-1">
                    <Phone className="w-4 h-4 text-[#DC2626]" />
                    <span>WhatsApp Order</span>
                  </div>
                  <p className="text-xs text-stone-600 font-bold">
                    +{settings.whatsappNumber}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Fast Response
                  </span>
                </div>
              </div>

              {/* Facilities Pill List */}
              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
                <p className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2.5">
                  Fasilitas Outlet:
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-gray-100 text-[#111827]">
                    <Utensils className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Dine-In</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-gray-100 text-[#111827]">
                    <Bike className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Takeaway</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-gray-100 text-[#111827]">
                    <Car className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Parkir</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Google Maps Navigation Button */}
            <a
              id="btn-direct-google-maps"
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-[#111827] hover:bg-black text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-md transition-all hover:scale-[1.01]"
            >
              <Navigation className="w-4 h-4 text-[#F59E0B]" />
              <span>Petunjuk Arah Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>
          </div>

          {/* Right Column: Interactive Map Frame / Visual Preview */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-full min-h-[380px] rounded-3xl overflow-hidden border border-gray-200 shadow-sm bg-stone-100 flex flex-col justify-between">
              <div className="relative w-full h-full min-h-[340px] bg-stone-200">
                <iframe
                  title="Peta Lokasi MOMSARASA"
                  src="https://maps.google.com/maps?q=-6.2300,106.9200&z=15&output=embed"
                  className="w-full h-full min-h-[360px] border-0"
                  loading="lazy"
                />

                {/* Floating Map Pin Badge */}
                <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-gray-200 text-left max-w-xs pointer-events-none">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#DC2626] text-white flex items-center justify-center font-black text-xs">
                      M
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#111827]">MOMSARASA Outlet</h4>
                      <p className="text-[10px] text-stone-500">Western Snack & Potatoes</p>
                    </div>
                  </div>
                </div>

                {/* Overlay link button */}
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 px-4 py-2.5 rounded-xl bg-[#111827] text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>Buka Peta Asli</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
