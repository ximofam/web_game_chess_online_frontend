import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Swords, Bot, Sparkles, ChevronRight } from 'lucide-react';

export function PlayModeCards({ onCreateRoomClick, onMatchmakingClick }) {
  return (
    <div className="space-y-3">
      {/* 1. TẠO PHÒNG CHƠI */}
      <button
        type="button"
        onClick={onCreateRoomClick}
        className="w-full group relative overflow-hidden bg-[#1a1d24] hover:bg-[#20242e] border border-[#2d323f] hover:border-[#d4af37]/60 p-4 rounded-xl text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_4px_16px_rgba(212,175,55,0.12)] flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#0d0e12] transition-colors shrink-0">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#f3f4f6] group-hover:text-[#d4af37] transition-colors flex items-center gap-2">
              Tạo Phòng Chơi
            </h3>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all shrink-0" />
      </button>

      {/* 2. GHÉP TRẬN (TƯƠNG LAI) */}
      <button
        type="button"
        onClick={onMatchmakingClick}
        className="w-full group relative overflow-hidden bg-[#1a1d24] hover:bg-[#20242e] border border-[#2d323f] hover:border-[#38bdf8]/60 p-4 rounded-xl text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_4px_16px_rgba(56,189,248,0.12)] flex items-center justify-between"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] group-hover:bg-[#38bdf8] group-hover:text-[#0d0e12] transition-colors shrink-0">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-[#f3f4f6] group-hover:text-[#38bdf8] transition-colors">
                Ghép Trận Nhanh
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30">
                <Sparkles className="w-2.5 h-2.5" /> Tương lai
              </span>
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#38bdf8] group-hover:translate-x-1 transition-all shrink-0" />
      </button>

      {/* 3. ĐÁNH VỚI MÁY */}
      <Link
        to="/learn/play-bot"
        className="w-full group relative overflow-hidden bg-[#1a1d24] hover:bg-[#20242e] border border-[#2d323f] hover:border-[#10b981]/60 p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-[0_4px_16px_rgba(16,185,129,0.12)]"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] group-hover:bg-[#10b981] group-hover:text-[#0d0e12] transition-colors shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#f3f4f6] group-hover:text-[#10b981] transition-colors">
              Đánh Với Máy
            </h3>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#10b981] group-hover:translate-x-1 transition-all shrink-0" />
      </Link>
    </div>
  );
}
