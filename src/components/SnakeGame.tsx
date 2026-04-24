import { useCallback, useEffect, useRef, useState } from 'react';
import { GRID_SIZE, INITIAL_DIRECTION, INITIAL_SNAKE, TICK_RATE } from '../constants';
import { GameStatus, Point } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const lastTickTime = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(p => p.x === newFood.x && p.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setStatus(GameStatus.PLAYING);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = useCallback((time: number) => {
    if (status !== GameStatus.PLAYING) return;

    if (time - lastTickTime.current > TICK_RATE) {
      lastTickTime.current = time;

      setSnake(prev => {
        const head = prev[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check self-collision
        if (prev.some(p => p.x === newHead.x && p.y === newHead.y)) {
          setStatus(GameStatus.GAME_OVER);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }

    requestAnimationFrame(update);
  }, [direction, food, status, generateFood]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      const frameId = requestAnimationFrame(update);
      return () => cancelAnimationFrame(frameId);
    }
  }, [status, update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid points (Grid Pattern)
    ctx.fillStyle = '#1a1a1a';
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        ctx.beginPath();
        ctx.arc(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF00FF';
    ctx.fillStyle = '#FF00FF';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    snake.forEach((p, i) => {
      if (i === 0) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.shadowColor = '#00FF41';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#00FF41';
      }
      ctx.fillRect(
        p.x * cellSize + 1,
        p.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute top-[-4rem] right-0 flex gap-12 pointer-events-none">
        <div className="text-right">
          <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase font-bold">Current Score</p>
          <p className="text-5xl font-black text-neon-green tabular-nums leading-none">{score.toString().padStart(5, '0')}</p>
        </div>
      </div>

      <div className="relative p-1 bg-[#1a1a1a] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <canvas
          ref={canvasRef}
          width={440}
          height={440}
          className="bg-[#0a0a0a]"
        />

        <AnimatePresence>
          {status !== GameStatus.PLAYING && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm z-10 p-8 text-center"
            >
              <h2 className="text-6xl font-black mb-4 text-white tracking-tighter uppercase leading-tight">
                {status === GameStatus.IDLE ? 'START_PROT' : 'SYSTEM_ERR'}
              </h2>
              {status === GameStatus.GAME_OVER && (
                <p className="text-neon-magenta text-sm mb-8 font-black tracking-widest uppercase">CONNECTION TERMINATED // SCORE: {score}</p>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="flex items-center gap-2 px-12 py-4 bg-white text-black font-black uppercase tracking-tighter text-lg glow-green"
              >
                {status === GameStatus.IDLE ? 'Initialize' : 'Reconnect'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 left-4">
          <p className="text-[10px] font-mono text-neon-green opacity-50 uppercase tracking-widest font-bold">GRID_LINK // v4.2</p>
        </div>
      </div>
    </div>
  );
}
