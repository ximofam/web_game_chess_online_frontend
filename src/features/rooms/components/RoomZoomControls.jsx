import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Sparkles } from 'lucide-react';

/**
 * Component thanh công cụ Phóng to / Thu nhỏ & Tùy chỉnh tỉ lệ giao diện phòng cờ.
 */
export function RoomZoomControls({ zoom = 1, onZoomChange, isMaximized = false, onToggleMaximize }) {
  const ZOOM_MIN = 0.75;
  const ZOOM_MAX = 1.30;
  const ZOOM_STEP = 0.15;

  const handleZoomIn = () => {
    onZoomChange(Math.min(ZOOM_MAX, Number((zoom + ZOOM_STEP).toFixed(2))));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(ZOOM_MIN, Number((zoom - ZOOM_STEP).toFixed(2))));
  };

  const handleReset = () => {
    onZoomChange(1.0);
  };

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="flex items-center gap-1.5 bg-[#13161c]/90 backdrop-blur-md border border-[#2d323f] p-1.5 rounded-xl shadow-lg">
      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#9ca3af] px-2 border-r border-[#2d323f]">
        <Sparkles className="w-3 h-3 text-[#d4af37]" />
        <span>Kích thước</span>
      </span>

      {/* THU NHỎ */}
      <button
        type="button"
        onClick={handleZoomOut}
        disabled={zoom <= ZOOM_MIN}
        className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#2d323f] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
        title="Thu nhỏ (-15%)"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* HIỂN THỊ TỈ LỆ & RESET */}
      <button
        type="button"
        onClick={handleReset}
        className="px-2 py-1 rounded-lg text-xs font-mono font-bold text-[#d4af37] hover:bg-[#d4af37]/10 transition-all cursor-pointer flex items-center gap-1 min-w-[52px] justify-center"
        title="Đặt lại kích thước chuẩn (100%)"
      >
        <span>{zoomPercent}%</span>
        {zoom !== 1.0 && <RotateCcw className="w-3 h-3 text-[#9ca3af]" />}
      </button>

      {/* PHÓNG TO */}
      <button
        type="button"
        onClick={handleZoomIn}
        disabled={zoom >= ZOOM_MAX}
        className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#2d323f] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
        title="Phóng to (+15%)"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* SEPARATOR */}
      <div className="w-[1px] h-4 bg-[#2d323f] mx-0.5" />

      {/* TOÀN MÀN HÌNH / MỞ RỘNG WORKSPACE */}
      {onToggleMaximize && (
        <button
          type="button"
          onClick={onToggleMaximize}
          className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
            isMaximized
              ? 'bg-[#d4af37] text-[#0d0e12] font-bold shadow'
              : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#2d323f]'
          }`}
          title={isMaximized ? 'Thu nhỏ khung nhìn' : 'Mở rộng khung nhìn toàn màn hình'}
        >
          {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
