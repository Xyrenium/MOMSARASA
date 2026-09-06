import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DeliveryChannels } from './components/DeliveryChannels';
import { MenuSection } from './components/MenuSection';
import { WhyMomsarasa } from './components/WhyMomsarasa';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { ProductCustomizerModal } from './components/ProductCustomizerModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { CartDrawer } from './components/CartDrawer';
import { FloatingCartPill } from './components/FloatingCartPill';
import { StickyFooterMenu } from './components/StickyFooterMenu';
import { Toast } from './components/Toast';
import { DashboardPage } from './components/DashboardPage';
import { getRoute, AppRoute } from './utils/navigation';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getRoute);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(getRoute());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('route-change', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('route-change', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  return (
    <StoreProvider>
      {currentRoute === 'dashboard' ? (
        <DashboardPage />
      ) : (
        <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#111827] font-sans selection:bg-[#DC2626] selection:text-white pb-20 sm:pb-24">
          {/* Public Customer Navigation */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1">
            {/* 1. Hero Section with MOMSARASA branding & Store Status */}
            <Hero />

            {/* 2. Official Delivery Channels (GrabFood, GoFood, WhatsApp) */}
            <DeliveryChannels />

            {/* 3. Interactive Menu Grid & Sauce Customizer */}
            <MenuSection />

            {/* 4. Culinary Highlights & 4 Signature Dipping Sauces */}
            <WhyMomsarasa />

            {/* 5. Location & Outlet (Google Maps) */}
            <LocationSection />
          </main>

          {/* Public Footer */}
          <Footer />

          {/* Customer Interactive Modals & Drawers */}
          <ProductCustomizerModal />
          <CartDrawer />
          <FloatingCartPill />

          {/* Customer Sticky Bottom Navigation Menu */}
          <StickyFooterMenu />
        </div>
      )}
      <ImageLightboxModal />
      <Toast />
    </StoreProvider>
  );
}

