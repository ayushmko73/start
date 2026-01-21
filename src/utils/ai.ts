import { Chess, Move } from 'chess.js';

export type Difficulty = 'Beginner' | 'Easy' | 'Hard' | 'Master';

const PIECE_VALUES: Record<string, number> = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 900,
};

const evaluateBoard = (game: Chess, color: 'w' | 'b'): number => {
  let total = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = PIECE_VALUES[piece.type] || 0;
        total += piece.color === color ? val : -val;
      }
    }
  }
  return total;
};

const minimax = (
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  playerColor: 'w' | 'b'
): number => {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game, playerColor);
  }

  const moves = game.moves();

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const ev = minimax(game, depth - 1, alpha, beta, false, playerColor);
      game.undo();
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const ev = minimax(game, depth - 1, alpha, beta, true, playerColor);
      game.undo();
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

export const getBestMove = (game: Chess, difficulty: Difficulty): string | null => {
  const moves = game.moves();
  if (moves.length === 0) return null;

  // Beginner: Random Move
  if (difficulty === 'Beginner') {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  let depth = 1;
  if (difficulty === 'Easy') depth = 2;
  if (difficulty === 'Hard') depth = 3;
  if (difficulty === 'Master') depth = 3; // JavaScript limitation on main thread, keep at 3 for responsiveness

  let bestMove = '';
  let bestValue = -Infinity;
  const playerColor = game.turn();

  // Simple randomization for opening variety
  moves.sort(() => Math.random() - 0.5);

  for (const move of moves) {
    game.move(move);
    const boardValue = minimax(game, depth - 1, -Infinity, Infinity, false, playerColor);
    game.undo();

    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = move;
    }
  }

  return bestMove || moves[0];
};