import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

/**
 * Layout wrapping routes only accessible to unauthenticated or guest players (e.g. Login, Register).
 * Redirects logged-in registered users to the main home lobby.
 */
export const GuestLayout = () => {
  const { isRegisteredUser } = useAuth();

  if (isRegisteredUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full min-h-screen bg-[#0d0e12] text-[#f3f4f6] flex flex-col justify-between">
      <Outlet />
    </div>
  );
};

export default GuestLayout;
