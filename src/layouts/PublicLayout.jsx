import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../features/home/components/Navbar';
import Footer from '../shared/components/Footer';

/**
 * Public Layout accessible to both Guest and Registered Users.
 * Includes top Navbar header, page Outlet, and Footer.
 */
export const PublicLayout = () => {
  return (
    <div className="w-full min-h-screen bg-[#0d0e12] text-[#f3f4f6] flex flex-col justify-between select-none">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
