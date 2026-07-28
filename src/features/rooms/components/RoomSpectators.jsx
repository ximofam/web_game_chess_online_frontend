import { Eye, Users } from 'lucide-react';

export function RoomSpectators({ spectators = [] }) {
  return (
    <div className="bg-[#13161c] border border-[#2d323f] rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#2d323f]/60 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#f3f4f6]">
          <Eye className="w-4 h-4 text-[#38bdf8]" />
          <span>Khán giả đang xem</span>
        </div>
        <span className="text-xs font-semibold text-[#38bdf8] bg-[#38bdf8]/10 px-2.5 py-0.5 rounded-full border border-[#38bdf8]/30">
          {spectators.length} người
        </span>
      </div>

      {spectators.length === 0 ? (
        <div className="py-4 text-center text-xs text-[#9ca3af] space-y-1">
          <Users className="w-5 h-5 mx-auto text-[#4b5563]" />
          <p>Chưa có khán giả nào vào xem</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 pt-1 max-h-28 overflow-y-auto">
          {spectators.map((spec, idx) => (
            <div
              key={spec.id || idx}
              className="flex items-center gap-2 bg-[#1a1d24] border border-[#2d323f] rounded-xl px-2.5 py-1 text-xs text-[#f3f4f6]"
            >
              <div className="w-5 h-5 rounded-full bg-[#13161c] flex items-center justify-center text-[10px] text-[#38bdf8] font-bold">
                {spec.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="font-semibold">{spec.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
