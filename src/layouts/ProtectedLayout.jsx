import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

/**
 * Layout wrapping routes that require active authentication (e.g. Dashboard/Lobby).
 * Redirects guests back to the Login screen.
 */
export const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="w-full min-h-screen bg-[#0d0e12] text-[#f3f4f6] flex flex-col">
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
