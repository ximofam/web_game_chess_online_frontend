import React, { useState } from 'react';
import { X, Clock, Shield, Lock, Globe, Sparkles, Loader2, Play } from 'lucide-react';
import { roomService } from '../services/roomService';
import { useAuth } from '../../auth/context/AuthContext';
import { useSocket } from '../../../socket/useSocket';

export function CreateRoomModal({ isOpen, onClose, onCreated }) {
  const { showToast } = useAuth();
  const { connectionStatus } = useSocket();

  const [name, setName] = useState('');
  const [timeMinutes, setTimeMinutes] = useState(5);
  const [incrementSeconds, setIncrementSeconds] = useState(3);
  const [variant, setVariant] = useState('STANDARD');
  const [rated, setRated] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if WebSocket is online as per API spec rule:
    // "Người dùng phải đang Online (có kết nối WebSocket) thì mới được phép gọi API này."
    if (connectionStatus === 'DISCONNECTED') {
      showToast('Bạn cần có kết nối trực tuyến (Realtime WebSocket) để tạo phòng!', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        settings: {
          timeMinutes: Number(timeMinutes),
          incrementSeconds: Number(incrementSeconds),
          variant,
          rated,
          isPrivate,
        },
      };

      const result = await roomService.createRoom(payload);
      showToast('Tạo phòng chơi thành công!', 'success');
      
      if (onCreated) {
        onCreated(result);
      }
      onClose();
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'Không thể tạo phòng. Vui lòng thử lại sau.';
      
      if (status === 403) {
        showToast('Tạo phòng thất bại: Bạn phải duy trì kết nối WebSocket để khởi tạo phòng.', 'error');
      } else {
        showToast(msg, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const presetTimes = [
    { label: '3m (Bullet)', time: 3, inc: 0 },
    { label: '3m + 2s (Blitz)', time: 3, inc: 2 },
    { label: '5m + 3s (Blitz)', time: 5, inc: 3 },
    { label: '10m (Rapid)', time: 10, inc: 0 },
    { label: '15m + 10s (Rapid)', time: 15, inc: 10 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0e12]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#1a1d24] border border-[#2d323f] rounded-2xl shadow-2xl overflow-hidden">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-[#2d323f] bg-[#13161c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-playfair text-lg font-bold text-[#f3f4f6]">Cấu Hình Phòng Chơi mới</h2>
              <p className="text-xs text-[#9ca3af]">Thiết lập luật đấu & thời gian thi đấu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#2d323f]/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* TÊN PHÒNG */}
          <div>
            <label className="block text-xs font-semibold text-[#f3f4f6] uppercase tracking-wider mb-2">
              Tên phòng chơi (Không bắt buộc)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Giao lưu cờ chớp 3m, Thách đấu GM..."
              className="w-full bg-[#13161c] border border-[#2d323f] focus:border-[#d4af37] text-[#f3f4f6] text-sm rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-all placeholder-[#4b5563]"
            />
          </div>

          {/* QUICK PRESETS */}
          <div>
            <label className="block text-xs font-semibold text-[#f3f4f6] uppercase tracking-wider mb-2">
              Mẫu thời gian nhanh
            </label>
            <div className="flex flex-wrap gap-2">
              {presetTimes.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTimeMinutes(preset.time);
                    setIncrementSeconds(preset.inc);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    timeMinutes === preset.time && incrementSeconds === preset.inc
                      ? 'bg-[#d4af37] text-[#0d0e12] border-[#d4af37] font-bold shadow-md'
                      : 'bg-[#13161c] text-[#9ca3af] border-[#2d323f] hover:border-[#d4af37]/40 hover:text-[#f3f4f6]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* TIME CONTROL CUSTOMIZATION */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#f3f4f6] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" /> Thời gian (Phút)
              </label>
              <select
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(e.target.value)}
                className="w-full bg-[#13161c] border border-[#2d323f] focus:border-[#d4af37] text-[#f3f4f6] text-sm rounded-xl p-3 focus:outline-none transition-all cursor-pointer"
              >
                <option value={1}>1 phút (Bullet)</option>
                <option value={3}>3 phút (Blitz)</option>
                <option value={5}>5 phút (Blitz)</option>
                <option value={10}>10 phút (Rapid)</option>
                <option value={15}>15 phút (Rapid)</option>
                <option value={30}>30 phút (Classical)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#f3f4f6] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" /> Cộng giây / Nước đi
              </label>
              <select
                value={incrementSeconds}
                onChange={(e) => setIncrementSeconds(e.target.value)}
                className="w-full bg-[#13161c] border border-[#2d323f] focus:border-[#d4af37] text-[#f3f4f6] text-sm rounded-xl p-3 focus:outline-none transition-all cursor-pointer"
              >
                <option value={0}>+0 giây</option>
                <option value={1}>+1 giây</option>
                <option value={2}>+2 giây</option>
                <option value={3}>+3 giây</option>
                <option value={5}>+5 giây</option>
                <option value={10}>+10 giây</option>
              </select>
            </div>
          </div>

          {/* RATED & PRIVACY TOGGLES */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#2d323f]">
            <button
              type="button"
              onClick={() => setRated(!rated)}
              className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                rated
                  ? 'bg-[#d4af37]/10 border-[#d4af37]/50 text-[#d4af37]'
                  : 'bg-[#13161c] border-[#2d323f] text-[#9ca3af]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <div>
                  <span className="block text-xs font-bold text-[#f3f4f6]">Tính điểm Elo</span>
                  <span className="text-[10px] opacity-80">{rated ? 'Trận Rated' : 'Không tính điểm'}</span>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                isPrivate
                  ? 'bg-[#38bdf8]/10 border-[#38bdf8]/50 text-[#38bdf8]'
                  : 'bg-[#13161c] border-[#2d323f] text-[#9ca3af]'
              }`}
            >
              <div className="flex items-center gap-2">
                {isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                <div>
                  <span className="block text-xs font-bold text-[#f3f4f6]">Chế độ phòng</span>
                  <span className="text-[10px] opacity-80">{isPrivate ? 'Phòng Riêng tư' : 'Hiện ở Sảnh'}</span>
                </div>
              </div>
            </button>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2d323f]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#2d323f] text-[#9ca3af] hover:text-[#f3f4f6] text-xs font-semibold transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#d4af37] text-[#0d0e12] hover:bg-[#b59226] font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-[#0d0e12]" />
                  <span>TẠO PHÒNG NGAY</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
