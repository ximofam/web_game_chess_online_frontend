import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import Navbar from '../features/home/components/Navbar';
import Footer from '../shared/components/Footer';

/**
 * Layout wrapping routes that require active Registered User authentication (e.g. Profile, Notifications, Create Post).
 * Redirects Guests back to the Login screen.
 */
export const ProtectedLayout = () => {
  const { isRegisteredUser } = useAuth();

  if (!isRegisteredUser) {
    return <Navigate to="/login" replace />;
  }

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

export default ProtectedLayout;
