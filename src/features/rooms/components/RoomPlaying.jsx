import { ChessGameUI } from './ChessGameUI';
import { RoomChat } from './RoomChat';
import { RoomSpectators } from './RoomSpectators';
import { ChessGameSidebar } from './ChessGameSidebar';

export function RoomPlaying({ room, roomId }) {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0 pb-4">
      {/* LEFT COLUMN: Spectators + Chat */}
      <div className="lg:col-span-3 flex flex-col gap-6 h-full">
        {/* Spectators */}
        <div className="flex-none">
          <RoomSpectators spectators={room.spectators || []} />
        </div>
        
        {/* Chat */}
        <div className="flex-1 min-h-0">
          <RoomChat roomId={roomId} room={room} />
        </div>
      </div>

      {/* CENTER COLUMN: Chess Board */}
      <div className="lg:col-span-6 h-full flex flex-col items-center justify-center">
        <div className="w-full max-w-[550px]">
          <ChessGameUI room={room} />
        </div>
      </div>

      {/* RIGHT COLUMN: Game Info (PGN, Moves, etc.) */}
      <div className="lg:col-span-3 h-full">
        <ChessGameSidebar room={room} />
      </div>
    </div>
  );
}
