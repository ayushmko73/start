import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { Pawn, Rook, Knight, Bishop, Queen, King } from '../assets/PieceIcons';
import clsx from 'clsx';

interface ChessBoardProps {
  game: Chess;
  onMove: (from: string, to: string) => void;
  orientation?: 'w' | 'b';
  lastMove?: { from: string; to: string } | null;
  disabled?: boolean;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const ChessBoard: React.FC<ChessBoardProps> = ({
  game,
  onMove,
  orientation = 'w',
  lastMove,
  disabled = false,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

  const board = game.board();
  // If playing as black, we might want to flip the board visually
  // But chess.js board() always returns rank 8 to 1. 
  // We handle orientation by reversing our rendering loops if needed.

  const handleSquareClick = (square: string) => {
    if (disabled) return;

    // If clicking the same square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    // If a piece is already selected, try to move
    if (selectedSquare) {
      const moveAttempt = { from: selectedSquare, to: square };
      
      // Check if valid move
      try {
        // Just check validity using game logic without mutating yet (handled by parent)
        const moves = game.moves({ verbose: true });
        const validMove = moves.find(m => m.from === selectedSquare && m.to === square);
        
        if (validMove) {
          onMove(selectedSquare, square);
          setSelectedSquare(null);
          setPossibleMoves([]);
          return;
        }
      } catch (e) {
        // Invalid move
      }
    }

    // Select new piece if it belongs to current turn
    const piece = game.get(square as Square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square: square as Square, verbose: true });
      setPossibleMoves(moves.map(m => m.to));
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const renderSquare = (rIndex: number, cIndex: number) => {
    // Adjust indices based on orientation
    const rankIndex = orientation === 'w' ? rIndex : 7 - rIndex;
    const fileIndex = orientation === 'w' ? cIndex : 7 - cIndex;

    const rank = RANKS[rankIndex];
    const file = FILES[fileIndex];
    const square = `${file}${rank}` as Square;
    const isBlack = (rankIndex + fileIndex) % 2 === 1;
    const piece = game.get(square);
    
    const isSelected = selectedSquare === square;
    const isLastMoveFrom = lastMove?.from === square;
    const isLastMoveTo = lastMove?.to === square;
    const isPossibleMove = possibleMoves.includes(square);
    const isCapture = isPossibleMove && piece;

    let PieceComponent = null;
    if (piece) {
      switch (piece.type) {
        case 'p': PieceComponent = Pawn; break;
        case 'r': PieceComponent = Rook; break;
        case 'n': PieceComponent = Knight; break;
        case 'b': PieceComponent = Bishop; break;
        case 'q': PieceComponent = Queen; break;
        case 'k': PieceComponent = King; break;
      }
    }

    return (
      <div
        key={square}
        onClick={() => handleSquareClick(square)}
        className={clsx(
          'w-full h-full flex justify-center items-center relative cursor-pointer',
          isBlack ? 'bg-slate-600' : 'bg-slate-300',
          (isSelected || isLastMoveFrom || isLastMoveTo) && 'bg-yellow-200/50',
          isPossibleMove && !isCapture && 'highlight-move',
          isCapture && 'highlight-capture'
        )}
      >
        {/* Rank/File Notation */}
        {fileIndex === (orientation === 'w' ? 0 : 7) && (
           <span className={clsx("absolute top-0.5 left-0.5 text-[10px] font-bold", isBlack ? "text-slate-300" : "text-slate-600")}>{rank}</span>
        )}
        {rankIndex === (orientation === 'w' ? 7 : 0) && (
           <span className={clsx("absolute bottom-0 right-1 text-[10px] font-bold", isBlack ? "text-slate-300" : "text-slate-600")}>{file}</span>
        )}

        {PieceComponent && (
          <PieceComponent 
            color={piece.color} 
            className={clsx(
              "w-4/5 h-4/5 pointer-events-none drop-shadow-md transition-transform", 
              piece.color === 'w' ? 'text-white' : 'text-black'
            )} 
          />
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-8 grid-rows-8 border-4 border-slate-800 w-full max-w-[600px] aspect-square shadow-2xl rounded-sm overflow-hidden bg-slate-800">
      {Array.from({ length: 8 }).map((_, r) => 
        Array.from({ length: 8 }).map((_, c) => renderSquare(r, c))
      )}
    </div>
  );
};
