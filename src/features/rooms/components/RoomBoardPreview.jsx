import React from 'react';
import { Chessboard } from 'react-chessboard';

export function RoomBoardPreview({ zoom = 1.0, isMaximized = false }) {
  // Base board size calculations scaled by zoom ratio
  const baseSize = isMaximized ? 560 : 420;
  const boardWidth = Math.round(baseSize * zoom);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full overflow-hidden transition-all duration-300">
      <div
        className="relative rounded-2xl p-3 bg-[#13161c] border border-[#2d323f] shadow-2xl transition-all duration-300 flex flex-col items-center"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          maxWidth: '100%',
        }}
      >
        <div style={{ width: baseSize, maxWidth: '100%' }} className="aspect-square rounded-xl overflow-hidden shadow-inner border border-[#2d323f]">
          <Chessboard
            position="start"
            arePiecesDraggable={false}
            customBoardStyle={{
              borderRadius: '8px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
            }}
            customDarkSquareStyle={{ backgroundColor: '#769656' }}
            customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
          />
        </div>
      </div>
    </div>
  );
}
