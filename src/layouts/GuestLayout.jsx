import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

/**
 * Layout wrapping routes only accessible to unauthenticated players (e.g. Login, Register).
 * Redirects logged-in users to the main dashboard lobby.
 */
export const GuestLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full min-h-screen bg-[#0d0e12] text-[#f3f4f6] flex flex-col justify-between">
      <Outlet />
    </div>
  );
};

export default GuestLayout;
