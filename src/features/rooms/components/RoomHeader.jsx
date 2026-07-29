import { useState } from 'react';
import { Copy, Check, Clock, Shield, Lock, Globe, User, Radio, Minimize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { activeRoomManager } from '../services/activeRoomManager';
import { useTranslation } from 'react-i18next';

export function RoomHeader({ room, onMinimize }) {
  const { t } = useTranslation(['room']);
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!room) return null;

  const { roomId, name, host, settings = {}, status } = room;
  const { timeMinutes = 5, incrementSeconds = 3, rated = true, isPrivate = false } = settings;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast(t('room:copyLinkSuccess', 'Đã sao chép liên kết phòng!'), 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
      return;
    }
    activeRoomManager.setRoom(room);
    showToast(t('room:minimizeRoomSuccess', 'Đã thu nhỏ phòng cờ ở góc màn hình!'), 'info');
    navigate('/dashboard');
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/30">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> {t('room:playing', 'Đang thi đấu')}
          </span>
        );
      case 'FINISHED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9ca3af] bg-[#2d323f]/50 px-3 py-1 rounded-full border border-[#2d323f]">
            {t('room:matchEnded', 'Trận đấu đã kết thúc')}
          </span>
        );
      case 'WAITING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/30">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" /> {t('room:waitingOpponent', 'Đang chờ đối thủ')}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* LEFT: BACK & TITLE */}
      <div className="flex items-center gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-playfair text-xl sm:text-2xl font-bold text-[#f3f4f6] truncate max-w-[280px] sm:max-w-md">
              {name || t('room:defaultRoomName', 'Phòng Cờ #{{id}}', { id: roomId?.slice(0, 8) })}
            </h1>
            {getStatusBadge()}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#9ca3af]">
            <span className="flex items-center gap-1 text-[#f3f4f6] font-medium">
              <User className="w-3.5 h-3.5 text-[#d4af37]" />
              Host: <strong className="text-[#d4af37]">{host?.username || 'Host'}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
              {t('room:timeFormat', '{{minutes}}+{{seconds}} phút', { minutes: timeMinutes, seconds: incrementSeconds })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
              {rated ? 'Rated' : 'Casual'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {isPrivate ? <Lock className="w-3.5 h-3.5 text-[#38bdf8]" /> : <Globe className="w-3.5 h-3.5 text-[#10b981]" />}
              {isPrivate ? t('room:private', 'Riêng tư') : t('room:public', 'Công khai')}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: ACTIONS & SHARE LINK */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          type="button"
          onClick={handleMinimize}
          className="flex items-center gap-1.5 bg-[#13161c] hover:bg-[#2d323f] text-[#f3f4f6] border border-[#2d323f] px-3 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer shadow-sm"
          title={t('room:minimizeToCorner', 'Thu nhỏ phòng chờ xuống góc màn hình')}
        >
          <Minimize2 className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{t('room:minimize', 'Thu nhỏ')}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/40 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? t('room:copied', 'Đã chép') : t('room:copyLink', 'Sao chép link')}</span>
        </button>
      </div>
    </div>
  );
}

