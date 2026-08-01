import { ScrollText, Move } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ChessGameSidebar({ room: _room }) {
  const { t } = useTranslation(['room']);
  
  // Later, we can extract move history from room.gameData.pgn or room.gameData.moves
  const moves = [];

  return (
    <div className="bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-5 shadow-lg flex flex-col h-full min-h-[500px]">
      <div className="flex items-center gap-2 border-b border-[#2d323f] pb-3 mb-4">
        <ScrollText className="w-4 h-4 text-[#d4af37]" />
        <h3 className="text-sm font-bold text-[#f3f4f6] uppercase tracking-wider">
          {t('room:moveHistory', 'Move History')}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin flex flex-col">
        {moves.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#6b7280] space-y-3">
            <Move className="w-8 h-8 opacity-50" />
            <p className="text-xs font-semibold">{t('room:noMovesYet', 'No moves yet')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {/* Example of how moves would be rendered */}
            {/* 
            <div className="flex items-center gap-2 px-2 py-1 bg-[#13161c] rounded">
              <span className="text-[#6b7280] text-xs font-mono w-4">1.</span>
              <span className="text-[#f3f4f6] font-semibold">e4</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-[#13161c] rounded">
              <span className="text-[#f3f4f6] font-semibold">e5</span>
            </div>
            */}
          </div>
        )}
      </div>

      {/* Optional: PGN Export or related action buttons can go here at the bottom */}
      <div className="mt-4 pt-4 border-t border-[#2d323f]">
        <button className="w-full py-2 bg-[#13161c] hover:bg-[#2d323f] border border-[#2d323f] text-[#9ca3af] hover:text-[#d4af37] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm">
          {t('room:exportPgn', 'Export PGN')}
        </button>
      </div>
    </div>
  );
}
