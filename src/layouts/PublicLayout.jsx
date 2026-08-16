import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../shared/components/Sidebar/Sidebar';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import FloatingRoomWidget from '../features/rooms/components/FloatingRoomWidget';

/**
 * Public Layout accessible to both Guest and Registered Users.
 * Includes Left Sidebar, page Outlet, Footer and FloatingRoomWidget.
 */
export const PublicLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const isRoomRoute = location.pathname.startsWith('/room/');

  return (
    <div className="w-full h-screen bg-[#0d0e12] text-[#f3f4f6] flex select-none relative overflow-hidden">
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden relative">
        {!isRoomRoute && <Header onOpenSidebar={() => setIsMobileSidebarOpen(true)} />}
        
        <div className={`flex-1 flex flex-col relative ${isRoomRoute ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <main className="flex-1 flex flex-col">
            <Outlet />
          </main>
          {!isRoomRoute && <Footer />}
        </div>
      </div>
      
      <FloatingRoomWidget />
    </div>
  );
};

export default PublicLayout;
