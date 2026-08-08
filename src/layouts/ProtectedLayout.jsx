import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import Sidebar from '../shared/components/Sidebar/Sidebar';
import MobileTopBar from '../shared/components/Sidebar/MobileTopBar';
import Footer from '../shared/components/Footer';

/**
 * Layout wrapping routes that require active Registered User authentication (e.g. Profile, Notifications, Create Post).
 * Redirects Guests back to the Login screen.
 */
export const ProtectedLayout = () => {
  const { isRegisteredUser } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isRegisteredUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="w-full h-screen bg-[#0d0e12] text-[#f3f4f6] flex select-none overflow-hidden">
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden relative">
        <MobileTopBar onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        
        <div className="flex-1 overflow-y-auto flex flex-col relative">
          <main className="flex-1 flex flex-col">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
