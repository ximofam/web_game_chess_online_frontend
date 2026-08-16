import { ChessGameUI } from './ChessGameUI';
import { RoomChat } from './RoomChat';
import { RoomSpectators } from './RoomSpectators';
import { ChessGameSidebar } from './ChessGameSidebar';

export function RoomPlaying({ room, roomId, handleReady, handleConfirmLeave, isReadyPending, onAcknowledgeGameOver }) {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-1 gap-4 h-full min-h-0 pb-0">
      {/* LEFT COLUMN: Spectators + Chat */}
      <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
        {/* Spectators */}
        <div className="flex-none">
          <RoomSpectators spectators={room.spectators || []} hostId={room.host?.id} />
        </div>
        
        {/* Chat */}
        <div className="flex-1 min-h-0 flex flex-col">
          <RoomChat roomId={roomId} room={room} />
        </div>
      </div>

      {/* CENTER COLUMN: Chess Board */}
      <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-0">
        <div className="w-full h-full max-w-full flex flex-col items-center justify-center min-h-0">
          <ChessGameUI 
            room={room} 
            handleReady={handleReady} 
            handleConfirmLeave={handleConfirmLeave} 
            isReadyPending={isReadyPending} 
            onAcknowledgeGameOver={onAcknowledgeGameOver}
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Game Info (PGN, Moves, etc.) */}
      <div className="lg:col-span-3 flex flex-col min-h-0">
        <ChessGameSidebar room={room} />
      </div>
    </div>
  );
}
