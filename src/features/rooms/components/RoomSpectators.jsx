import { Eye, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function RoomSpectators({ spectators = [], hostId }) {
  const { t } = useTranslation(['room']);
  return (
    <div className="bg-[#13161c] border border-[#2d323f] rounded-2xl p-3 space-y-2">
      <div className="flex items-center justify-between border-b border-[#2d323f]/60 pb-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#f3f4f6]">
          <Eye className="w-4 h-4 text-[#38bdf8]" />
          <span>{t('room:spectators', 'Khán giả đang xem')}</span>
        </div>
        <span className="text-xs font-semibold text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded-full border border-[#38bdf8]/30">
          {t('room:spectatorCount', '{{count}} người', { count: spectators.length })}
        </span>
      </div>

      {spectators.length === 0 ? (
        <div className="flex items-center justify-center py-2 text-xs text-[#6b7280]">
          <p>{t('room:noSpectators', 'Chưa có khán giả nào vào xem')}</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto scrollbar-thin">
          {spectators.map((spec, idx) => (
            <div
              key={spec.id || idx}
              className="flex items-center gap-1.5 bg-[#1a1d24] border border-[#2d323f] rounded-xl px-2 py-1 text-xs text-[#f3f4f6]"
            >
              <div className="w-4 h-4 rounded-full bg-[#13161c] flex items-center justify-center text-[9px] text-[#38bdf8] font-bold">
                {spec.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="font-semibold">{spec.username}</span>
              {String(spec.id) === String(hostId) && (
                <Crown className="w-3 h-3 text-[#d4af37] ml-0.5" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
