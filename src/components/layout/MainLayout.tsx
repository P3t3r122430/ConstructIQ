import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
};

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F9FAFB] flex flex-col selection:bg-amber-500 selection:text-black font-sans">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 w-full bg-[#0A0B0D]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
