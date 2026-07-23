import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/context/AuthContext';
import { User, Shield, LogIn, Sparkles } from 'lucide-react';
import { PlayModeCards } from '../rooms/components/PlayModeCards';
import { CreateRoomModal } from '../rooms/components/CreateRoomModal';
import { MatchmakingModal } from '../rooms/components/MatchmakingModal';
import { LobbyList } from '../rooms/components/LobbyList';

export default function Dashboard() {
  const { currentUser, isGuest } = useAuth();

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMatchmakingModalOpen, setIsMatchmakingModalOpen] = useState(false);

  return (
    <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 select-none">
      <div className="w-full max-w-7xl space-y-5">

        {/* GUEST BANNER (COMPACT) */}
        {isGuest && (
          <div className="bg-gradient-to-r from-[#d4af37]/15 via-[#1a1d24] to-[#242834] border border-[#d4af37]/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#f3f4f6]">Chế độ Khách (Guest)</h3>
                <p className="text-xs text-[#9ca3af]">Đăng nhập để khởi tạo phòng chơi và lưu kết quả thi đấu.</p>
              </div>
            </div>

            <Link
              to="/login"
              className="bg-[#d4af37] text-[#0d0e12] hover:bg-[#b59226] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
          </div>
        )}

        {/* LICHESS-STYLE TWO COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT / MAIN COLUMN: REALTIME LOBBY TABLE (lg:col-span-8) */}
          <div className="lg:col-span-8 h-full">
            <LobbyList onCreateRoomClick={() => setIsCreateModalOpen(true)} />
          </div>

          {/* RIGHT SIDEBAR: USER QUICK PROFILE & ACTION CARDS (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            {/* USER QUICK CARD */}
            <div className="bg-[#1a1d24] border border-[#2d323f] p-4.5 rounded-2xl shadow-md">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full border border-[#d4af37] flex items-center justify-center bg-[#13161c] text-[#d4af37] relative overflow-hidden shrink-0">
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                  <span className="absolute bottom-0 right-0 bg-[#d4af37] text-[#0d0e12] rounded-full p-0.5 border border-[#1a1d24]">
                    <Shield className="w-2.5 h-2.5" />
                  </span>
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-base text-[#f3f4f6] truncate">{currentUser?.username || 'Guest Player'}</h3>
                  <span className="inline-block text-[11px] font-semibold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-md border border-[#d4af37]/30 mt-0.5">
                    {currentUser?.role || 'GUEST'}
                  </span>
                </div>
              </div>

              {/* QUICK STATS */}
              <div className="grid grid-cols-3 gap-2 text-center mt-4 pt-3.5 border-t border-[#2d323f]/80">
                <div className="bg-[#13161c] py-2 rounded-lg border border-[#2d323f]">
                  <span className="block text-sm font-bold text-[#10b981]">142</span>
                  <span className="text-[10px] text-[#9ca3af] uppercase">Thắng</span>
                </div>
                <div className="bg-[#13161c] py-2 rounded-lg border border-[#2d323f]">
                  <span className="block text-sm font-bold text-[#38bdf8]">32</span>
                  <span className="text-[10px] text-[#9ca3af] uppercase">Hòa</span>
                </div>
                <div className="bg-[#13161c] py-2 rounded-lg border border-[#2d323f]">
                  <span className="block text-sm font-bold text-[#ef4444]">12</span>
                  <span className="text-[10px] text-[#9ca3af] uppercase">Thua</span>
                </div>
              </div>
            </div>

            {/* 3 ACTION BUTTONS (PLAY MODE STACK) */}
            <div className="bg-[#1a1d24] border border-[#2d323f] p-4.5 rounded-2xl shadow-md">
              <h3 className="font-playfair text-base font-bold text-[#f3f4f6] mb-3">Chế Độ Thi Đấu</h3>
              <PlayModeCards
                onCreateRoomClick={() => setIsCreateModalOpen(true)}
                onMatchmakingClick={() => setIsMatchmakingModalOpen(true)}
              />
            </div>
          </div>

        </div>

      </div>

      {/* MODALS */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <MatchmakingModal
        isOpen={isMatchmakingModalOpen}
        onClose={() => setIsMatchmakingModalOpen(false)}
      />
    </main>
  );
}
