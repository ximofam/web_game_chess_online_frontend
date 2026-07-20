import { useState, useCallback, useMemo, memo } from 'react';
import { Chessboard } from 'react-chessboard';
import { AnnotationBuilder } from '../engine/annotations/AnnotationBuilder';

const LessonBoard = memo(
  ({
    fen,
    orientation = 'white',
    onMove,
    highlightSquares = [],
    arrows = [],
    lastMove = null,
    arePiecesDraggable = true,
  }) => {
    const [selectedSquare, setSelectedSquare] = useState(null);

    const squareStyles = useMemo(() => {
      return AnnotationBuilder.buildSquareStyles({
        highlightSquares,
        selectedSquare,
        lastMove,
      });
    }, [highlightSquares, selectedSquare, lastMove]);

    const formattedArrows = useMemo(() => {
      return AnnotationBuilder.buildArrows(arrows);
    }, [arrows]);

    const handlePieceDrop = useCallback(
      ({ sourceSquare, targetSquare }) => {
        setSelectedSquare(null);
        if (!onMove || !targetSquare) return false;
        return onMove({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      },
      [onMove]
    );

    const handleSquareClick = useCallback(
      ({ square }) => {
        if (!arePiecesDraggable || !square) return;

        if (selectedSquare) {
          if (selectedSquare !== square) {
            onMove?.({ from: selectedSquare, to: square, promotion: 'q' });
          }
          setSelectedSquare(null);
        } else {
          setSelectedSquare(square);
        }
      },
      [selectedSquare, onMove, arePiecesDraggable]
    );

    const boardOptions = useMemo(
      () => ({
        position: fen || 'start',
        boardOrientation: orientation,
        onPieceDrop: handlePieceDrop,
        onSquareClick: handleSquareClick,
        squareStyles,
        arrows: formattedArrows,
        allowDragging: arePiecesDraggable,
        animationDurationInMs: 250,
        boardStyle: {
          borderRadius: '0.5rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        },
        darkSquareStyle: { backgroundColor: '#2d3748' },
        lightSquareStyle: { backgroundColor: '#cbd5e1' },
      }),
      [
        fen,
        orientation,
        handlePieceDrop,
        handleSquareClick,
        squareStyles,
        formattedArrows,
        arePiecesDraggable,
      ]
    );

    return (
      <div className="relative w-full max-w-[560px] aspect-square mx-auto rounded-xl overflow-hidden shadow-2xl border border-gold-500/20 bg-slate-900/60 p-2">
        <Chessboard options={boardOptions} />
      </div>
    );
  }
);

LessonBoard.displayName = 'LessonBoard';

export default LessonBoard;
