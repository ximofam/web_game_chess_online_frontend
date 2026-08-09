import { useMemo, useEffect, useRef, useState } from 'react';
import { ScrollText, Move } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Chess } from 'chess.js';

export function ChessGameSidebar({ room }) {
  const { t } = useTranslation(['room']);
  const scrollRef = useRef(null);

  const { gameData } = room || {};
  const initialFen = gameData?.initialFen || 'start';

  const moveHistory = useMemo(() => {
    const movesUci = gameData?.moves || [];
    try {
      const chess = new Chess(initialFen);
      const history = [];
      for (const m of movesUci) {
        if (!m) continue;
        // UCI format e.g. e2e4, e7e8q
        const from = m.slice(0, 2);
        const to = m.slice(2, 4);
        const promotion = m.length > 4 ? m[4] : undefined;
        try {
          const result = chess.move({ from, to, promotion });
          if (result) {
            history.push(result.san);
          } else {
            history.push(m);
          }
        } catch {
          history.push(m); // fallback if chess.js throws
        }
      }
      return history;
    } catch {
      return gameData?.moves || []; // ultimate fallback
    }
  }, [gameData?.moves, initialFen]);

  const movePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      pairs.push({
        white: moveHistory[i],
        black: moveHistory[i + 1]
      });
    }
    return pairs;
  }, [moveHistory]);

  const [displayCount, setDisplayCount] = useState(20);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const previousScrollHeight = useRef(0);
  const prevMoveCount = useRef(movePairs.length);

  const movePairsToDisplay = useMemo(() => {
    if (movePairs.length <= displayCount) return movePairs;
    return movePairs.slice(movePairs.length - displayCount);
  }, [movePairs, displayCount]);

  const startingIndex = Math.max(0, movePairs.length - displayCount);

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && displayCount < movePairs.length) {
      previousScrollHeight.current = e.target.scrollHeight;
      setIsLoadingOlder(true);
      setDisplayCount(prev => prev + 20);
    }
  };

  // Restore scroll position after loading older moves
  useEffect(() => {
    if (isLoadingOlder && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight - previousScrollHeight.current;
      setIsLoadingOlder(false);
    }
  }, [displayCount, isLoadingOlder]);

  // Auto-scroll to bottom when new moves arrive
  useEffect(() => {
    if (scrollRef.current) {
      if (movePairs.length > prevMoveCount.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
    prevMoveCount.current = movePairs.length;
  }, [movePairs.length]);

  return (
    <div className="bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-5 shadow-lg flex flex-col h-full min-h-[300px] lg:min-h-0 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[#2d323f] pb-3 mb-4">
        <ScrollText className="w-4 h-4 text-[#d4af37]" />
        <h3 className="text-sm font-bold text-[#f3f4f6] uppercase tracking-wider">
          {t('room:moveHistory', 'Move History')}
        </h3>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto pr-2 scrollbar-thin flex flex-col"
      >
        {movePairsToDisplay.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#6b7280] space-y-3">
            <Move className="w-8 h-8 opacity-50" />
            <p className="text-xs font-semibold">{t('room:noMovesYet', 'No moves yet')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-[30px_1fr_1fr] gap-x-2 gap-y-0.5 text-xs font-mono">
            {displayCount < movePairs.length && (
              <div className="col-span-3 text-center text-[#9ca3af] py-1 italic opacity-50">
                {t('room:loadingOlderMoves', 'Loading older moves...')}
              </div>
            )}
            {movePairsToDisplay.map((pair, idx) => {
              const globalIdx = startingIndex + idx;
              const isLatestWhite = !pair.black && globalIdx === movePairs.length - 1;
              const isLatestBlack = pair.black && globalIdx === movePairs.length - 1;
              return (
                <div key={globalIdx} className="contents group">
                  <div className="flex items-center justify-end pr-2 text-[#6b7280]">
                    {globalIdx + 1}.
                  </div>
                  <div className={`flex items-center px-2 py-0.5 rounded transition-colors ${isLatestWhite ? 'bg-[#d4af37] text-[#0d0e12] font-bold' : 'bg-[#13161c] text-[#f3f4f6] group-hover:bg-[#2d323f]'}`}>
                    {pair.white}
                  </div>
                  {pair.black ? (
                    <div className={`flex items-center px-2 py-0.5 rounded transition-colors ${isLatestBlack ? 'bg-[#d4af37] text-[#0d0e12] font-bold' : 'bg-[#13161c] text-[#f3f4f6] group-hover:bg-[#2d323f]'}`}>
                      {pair.black}
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[#2d323f]">
        <button className="w-full py-2 bg-[#13161c] hover:bg-[#2d323f] border border-[#2d323f] text-[#9ca3af] hover:text-[#d4af37] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm">
          {t('room:exportPgn', 'Export PGN')}
        </button>
      </div>
    </div>
  );
}
