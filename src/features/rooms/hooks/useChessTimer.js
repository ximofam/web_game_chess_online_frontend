import { useState, useEffect } from 'react';

export function useChessTimer(room) {
  const { gameData, settings, status } = room || {};
  const initialTimeMillis = (settings?.timeMinutes || 5) * 60 * 1000;
  
  const [whiteRemaining, setWhiteRemaining] = useState(gameData?.whiteRemainingMillis ?? initialTimeMillis);
  const [blackRemaining, setBlackRemaining] = useState(gameData?.blackRemainingMillis ?? initialTimeMillis);

  useEffect(() => {
    const wTime = gameData?.whiteRemainingMillis ?? initialTimeMillis;
    const bTime = gameData?.blackRemainingMillis ?? initialTimeMillis;

    if (status !== 'IN_PROGRESS') {
      setWhiteRemaining(wTime);
      setBlackRemaining(bTime);
      return;
    }

    const activeTurn = gameData?.turn || 'white';
    const turnStartedAt = gameData?.turnStartedAt || Date.now();

    const updateTimers = () => {
      const elapsed = Math.max(0, Date.now() - turnStartedAt);
      if (activeTurn === 'white') {
        setWhiteRemaining(Math.max(0, wTime - elapsed));
        setBlackRemaining(bTime);
      } else {
        setWhiteRemaining(wTime);
        setBlackRemaining(Math.max(0, bTime - elapsed));
      }
    };

    updateTimers(); // Immediate update
    const interval = setInterval(updateTimers, 100);
    return () => clearInterval(interval);
  }, [status, gameData?.turn, gameData?.turnStartedAt, gameData?.whiteRemainingMillis, gameData?.blackRemainingMillis, initialTimeMillis]);

  return { whiteRemaining, blackRemaining };
}
