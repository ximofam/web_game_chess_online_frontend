import { useState } from 'react';
import { Copy, Check, Clock, Shield, Lock, Globe, User, Minimize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
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
    showToast(t('room:minimizeRoomSuccess', 'Đã thu nhỏ phòng cờ ở góc màn hình!'), 'info');
    navigate('/dashboard');
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#38bdf8]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38bdf8]"></span>
            </span>
            {t('room:playing', 'Đang thi đấu')}
          </span>
        );
      case 'FINISHED':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#6b7280]">
            <span className="w-2 h-2 rounded-full bg-[#6b7280]"></span>
            {t('room:matchEnded', 'Trận đấu đã kết thúc')}
          </span>
        );
      case 'WAITING':
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#10b981]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </span>
            {t('room:waitingOpponent', 'Đang chờ đối thủ')}
          </span>
        );
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-4 shrink-0 ${status === 'IN_PROGRESS' ? 'justify-end' : 'justify-between pb-3 border-b border-[#2d323f]/60'}`}>
      {/* LEFT: TITLE & META */}
      {status !== 'IN_PROGRESS' && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h1 className="font-playfair text-xl sm:text-2xl font-bold text-[#f3f4f6] truncate max-w-[200px] sm:max-w-[400px] leading-none">
              {name || t('room:defaultRoomName', 'Phòng Cờ #{{id}}', { id: roomId?.slice(0, 8) })}
            </h1>
            {getStatusBadge()}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#9ca3af]">
            <span className="flex items-center gap-1.5 font-semibold text-[#f3f4f6]">
              <User className="w-3.5 h-3.5 text-[#d4af37]" />
              {host?.username || 'Host'}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#4b5563]" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {t('room:timeFormat', '{{minutes}}+{{seconds}}m', { minutes: timeMinutes, seconds: incrementSeconds })}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#4b5563]" />
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              {rated ? 'Rated' : 'Casual'}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#4b5563]" />
            <span className="flex items-center gap-1.5">
              {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              {isPrivate ? t('room:private', 'Riêng tư') : t('room:public', 'Công khai')}
            </span>
          </div>
        </div>
      )}

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-4 self-start sm:self-center shrink-0">
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-2 text-[#9ca3af] hover:text-[#d4af37] transition-colors text-sm font-semibold cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
          <span className="hidden sm:inline">{copied ? t('room:copied', 'Đã chép') : t('room:copyLink', 'Share')}</span>
          <span className="sm:hidden">{copied ? t('room:copied', 'Đã chép') : t('room:copy', 'Copy')}</span>
        </button>
        
        <div className="w-px h-4 bg-[#2d323f]" />

        <button
          type="button"
          onClick={handleMinimize}
          className="flex items-center gap-2 text-[#9ca3af] hover:text-[#f3f4f6] transition-colors text-sm font-semibold cursor-pointer"
          title={t('room:minimizeToCorner', 'Thu nhỏ phòng chờ xuống góc màn hình')}
        >
          <Minimize2 className="w-4 h-4" />
          <span className="hidden sm:inline">{t('room:minimize', 'Thu nhỏ')}</span>
        </button>
      </div>
    </div>
  );
}

