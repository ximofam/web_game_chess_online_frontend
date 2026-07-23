import React from 'react';
import { X, Swords, Sparkles, Zap, ShieldCheck, Timer } from 'lucide-react';

export function MatchmakingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0e12]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#1a1d24] border border-[#38bdf8]/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="p-6 text-center border-b border-[#2d323f] bg-gradient-to-b from-[#38bdf8]/10 to-[#13161c]">
          <div className="w-16 h-16 rounded-2xl bg-[#38bdf8]/20 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] mx-auto mb-4 shadow-[0_0_20px_rgba(56,189,248,0.2)] animate-pulse">
            <Swords className="w-8 h-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Tính năng đang phát triển (Tương lai)
          </span>
          <h2 className="font-playfair text-2xl font-bold text-[#f3f4f6]">Ghép Trận Tự Động (Matchmaking)</h2>
          <p className="text-xs text-[#9ca3af] mt-1">
            Hệ thống matchmaking thuật toán Swiss / ELO tự động ghép cặp người chơi tương đồng trình độ.
          </p>
        </div>

        {/* FEATURE PREVIEW HIGHLIGHTS */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 bg-[#13161c] p-3.5 rounded-xl border border-[#2d323f]">
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/15 flex items-center justify-center text-[#38bdf8] shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#f3f4f6]">Ghép Trận Siêu Tốc</h4>
              <p className="text-[11px] text-[#9ca3af]">
                Tìm kiếm đối thủ sẵn sàng trong 1-5 giây bằng một cú click chuột đơn giản.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#13161c] p-3.5 rounded-xl border border-[#2d323f]">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#f3f4f6]">Cân Bằng Chỉ Số ELO</h4>
              <p className="text-[11px] text-[#9ca3af]">
                Tự động thu hẹp hoặc mở rộng biên độ Elo xung quanh vị thứ thi đấu của bạn.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#13161c] p-3.5 rounded-xl border border-[#2d323f]">
            <div className="w-8 h-8 rounded-lg bg-[#10b981]/15 flex items-center justify-center text-[#10b981] shrink-0 mt-0.5">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#f3f4f6]">Đa Dạng Thể Loại</h4>
              <p className="text-[11px] text-[#9ca3af]">
                Hỗ trợ Bullet (1m), Blitz (3m, 5m) và Rapid (10m) thi đấu tính điểm Rank.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="p-4 border-t border-[#2d323f] bg-[#13161c] flex items-center justify-between">
          <span className="text-xs text-[#9ca3af]">Dự kiến ra mắt trong phiên bản tới</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#38bdf8] text-[#0d0e12] font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#0284c7] transition-all cursor-pointer shadow-md"
          >
            ĐÃ HIỂU
          </button>
        </div>
      </div>
    </div>
  );
}
