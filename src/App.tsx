import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from './components/ChessBoard';
import { getBestMove, Difficulty } from './utils/ai';
import { supabase } from './lib/supabaseClient';
import { Monitor, User, Globe, Trophy, RotateCcw, Copy, Swords } from 'lucide-react';
import { clsx } from 'clsx';

type GameMode = 'menu' | 'local' | 'ai' | 'multiplayer_setup' | 'multiplayer_lobby' | 'multiplayer_game';

function App() {
  const [game, setGame] = useState(new Chess());
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [orientation, setOrientation] = useState<'w' | 'b'>('w');
  const [status, setStatus] = useState('');
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  
  // Multiplayer state
  const [roomId, setRoomId] = useState('');
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    updateStatus();
  }, [game]);

  useEffect(() => {
    if (gameMode === 'ai' && game.turn() !== orientation && !game.isGameOver()) {
      const timer = setTimeout(() => {
        const bestMove = getBestMove(game, difficulty);
        if (bestMove) {
          safeMove(bestMove);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [game, gameMode, difficulty, orientation]);

  const safeMove = (move: string | { from: string; to: string; promotion?: string }) => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      if (result) {
        setGame(gameCopy);
        setLastMove({ from: result.from, to: result.to });
        
        if (gameMode === 'multiplayer_game' && channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'move',
            payload: { fen: gameCopy.fen(), lastMove: { from: result.from, to: result.to } },
          });
        }
      }
    } catch (e) {
      console.error("Invalid move", e);
    }
  };

  const handleMove = (from: string, to: string) => {
    if (gameMode === 'ai' && game.turn() !== orientation) return;
    if (gameMode === 'multiplayer_game' && game.turn() !== playerColor) return;

    // Check for promotion (always promote to Queen for simplicity in this demo)
    safeMove({ from, to, promotion: 'q' });
  };

  const updateStatus = () => {
    if (game.isCheckmate()) {
      setStatus(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`);
    } else if (game.isDraw()) {
      setStatus('Draw!');
    } else if (game.isCheck()) {
      setStatus('Check!');
    } else {
      setStatus(`${game.turn() === 'w' ? 'White' : 'Black'}'s turn`);
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setLastMove(null);
    setStatus('');
  };

  const startLocal = () => {
    resetGame();
    setGameMode('local');
    setOrientation('w');
  };

  const startAI = (level: Difficulty) => {
    resetGame();
    setDifficulty(level);
    setGameMode('ai');
    setOrientation('w'); // Player is always white vs AI for simplicity here
  };

  // Multiplayer Logic
  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
    setPlayerColor('w');
    joinRoom(id, 'w');
  };

  const joinRoomInput = (id: string) => {
    setRoomId(id);
    setPlayerColor('b'); // Second joiner is black
    joinRoom(id, 'b');
  };

  const joinRoom = (id: string, color: 'w' | 'b') => {
    if (!supabase) {
      alert('Supabase keys missing. Multiplayer unavailable.');
      return;
    }

    resetGame();
    setOrientation(color);
    setGameMode('multiplayer_game');
    
    const channel = supabase.channel(`room_${id}`);
    
    channel
      .on('broadcast', { event: 'move' }, ({ payload }) => {
        const newGame = new Chess(payload.fen);
        setGame(newGame);
        setLastMove(payload.lastMove);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          console.log(`Joined room ${id} as ${color}`);
        }
      });

    channelRef.current = channel;
  };

  const leaveRoom = () => {
    if (channelRef.current) {
      supabase?.removeChannel(channelRef.current);
    }
    setIsConnected(false);
    setGameMode('menu');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <header className="mb-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
          <Swords size={32} />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          CHESS MASTER
        </h1>
      </header>

      {gameMode === 'menu' && (
        <div className="grid gap-4 w-full max-w-md">
          <button 
            onClick={startLocal} 
            className="flex items-center gap-4 p-6 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all hover:scale-105 border border-slate-700 group"
          >
            <User className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300" />
            <div className="text-left">
              <h3 className="text-xl font-bold">Pass & Play</h3>
              <p className="text-slate-400 text-sm">Two players on one device</p>
            </div>
          </button>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-4 mb-4">
              <Monitor className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="text-xl font-bold">Play vs AI</h3>
                <p className="text-slate-400 text-sm">Challenge the computer</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['Beginner', 'Easy', 'Hard', 'Master'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => startAI(level)}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setGameMode('multiplayer_setup')} 
            className="flex items-center gap-4 p-6 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all hover:scale-105 border border-slate-700 group"
          >
            <Globe className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300" />
            <div className="text-left">
              <h3 className="text-xl font-bold">Online Multiplayer</h3>
              <p className="text-slate-400 text-sm">Play with a friend remotely</p>
            </div>
          </button>
        </div>
      )}

      {gameMode === 'multiplayer_setup' && (
        <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-bold mb-6 text-center">Multiplayer Lobby</h2>
          
          <div className="space-y-4">
            <button 
              onClick={createRoom}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-colors"
            >
              Create New Room
            </button>
            
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-600"></div>
              <span className="flex-shrink mx-4 text-slate-400">OR</span>
              <div className="flex-grow border-t border-slate-600"></div>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter Room Code" 
                id="room-input"
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 uppercase"
              />
              <button 
                onClick={() => {
                  const val = (document.getElementById('room-input') as HTMLInputElement).value;
                  if (val) joinRoomInput(val.toUpperCase());
                }}
                className="px-6 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold transition-colors"
              >
                Join
              </button>
            </div>
          </div>
          <button onClick={() => setGameMode('menu')} className="mt-6 text-slate-400 hover:text-white text-sm w-full text-center">Back to Menu</button>
        </div>
      )}

      {(gameMode === 'local' || gameMode === 'ai' || gameMode === 'multiplayer_game') && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-between w-full max-w-[600px] items-center px-4">
            <div className="flex items-center gap-2">
              {gameMode === 'ai' && <Monitor size={20} className="text-emerald-400" />}
              {gameMode === 'local' && <User size={20} className="text-indigo-400" />}
              {gameMode === 'multiplayer_game' && <Globe size={20} className="text-cyan-400" />}
              <span className="font-bold text-lg">
                {gameMode === 'ai' ? `AI (${difficulty})` : gameMode === 'local' ? 'Local Game' : `Room: ${roomId}`}
              </span>
            </div>
            <button onClick={gameMode === 'multiplayer_game' ? leaveRoom : () => setGameMode('menu')} className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-md transition-colors">
              Exit Game
            </button>
          </div>

          <ChessBoard 
            game={game} 
            onMove={handleMove} 
            orientation={orientation}
            lastMove={lastMove}
            disabled={gameMode === 'ai' && game.turn() !== orientation}
          />

          <div className="w-full max-w-[600px] bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center shadow-lg">
             <div className="flex flex-col">
               <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Status</span>
               <span className="text-xl font-bold text-indigo-300">{status || 'Start playing!'}</span>
             </div>
             <div className="flex gap-2">
               <button onClick={() => setOrientation(prev => prev === 'w' ? 'b' : 'w')} className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Flip Board">
                 <RotateCcw size={20} />
               </button>
               {gameMode === 'multiplayer_game' && (
                 <button onClick={() => navigator.clipboard.writeText(roomId)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Copy Room ID">
                   <Copy size={20} />
                 </button>
               )}
               {(gameMode === 'local' || gameMode === 'ai') && (
                 <button onClick={resetGame} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold text-sm transition-colors">
                   Restart
                 </button>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
