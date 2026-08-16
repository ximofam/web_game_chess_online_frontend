import { useState } from 'react';
import { Outlet } from 'react-router-dom';
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

  return (
    <div className="w-full h-screen bg-[#0d0e12] text-[#f3f4f6] flex select-none relative overflow-hidden">
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden relative">
        <Header onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        
        <div className="flex-1 overflow-y-auto flex flex-col relative">
          <main className="flex-1 flex flex-col">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      
      <FloatingRoomWidget />
    </div>
  );
};

export default PublicLayout;
