import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Activity, Radio, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="w-full h-screen flex flex-col p-8 overflow-hidden bg-[#050505]">
      {/* Header Section */}
      <header className="flex justify-between items-end mb-8 border-b border-[#1a1a1a] pb-6">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.4em] text-neon-green font-bold uppercase mb-2">Arcade System v4.2</span>
          <h1 className="text-7xl font-black tracking-tighter leading-none text-white uppercase">
            SYNTH<span className="text-neon-green">SNAKE</span>
          </h1>
        </div>
        <div className="hidden md:flex gap-12">
          <div className="text-right">
            <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase font-bold">Session Time</p>
            <p className="text-5xl font-black text-white tabular-nums">00:42</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase font-bold">System Status</p>
            <p className="text-5xl font-black text-neon-green uppercase italic">Online</p>
          </div>
        </div>
      </header>

      {/* Main Content: Split Grid */}
      <main className="flex-1 grid grid-cols-12 gap-8 items-start min-h-0">
        
        {/* Left Sidebar: Playlist Info */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-4 flex items-center">
            <span className="w-2 h-2 bg-neon-green rounded-full mr-2"></span>
            Live Stream
          </h3>
          <div className="space-y-4">
            <div className="p-3 border-l-2 border-neon-green bg-[#111]">
              <p className="text-xs text-gray-500 mb-1 font-mono">CH_01</p>
              <p className="font-bold text-white tracking-tight uppercase">AI Synthetic Audio</p>
              <p className="text-[10px] text-neon-green italic">Syncing via Gemini Protocol</p>
            </div>
            <div className="p-4 border border-dashed border-[#333] text-center mt-8">
              <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Input Method</p>
              <p className="text-xs font-bold text-white mt-1 font-mono uppercase">WASD / ARROW KEYS</p>
            </div>
          </div>
        </div>

        {/* Center: Snake Board */}
        <div className="col-span-12 lg:col-span-6 flex justify-center">
          <SnakeGame />
        </div>

        {/* Right Sidebar: Music Player */}
        <div className="col-span-12 lg:col-span-3 flex justify-center lg:justify-end">
          <MusicPlayer />
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="mt-8 flex justify-between items-center text-[9px] uppercase tracking-[0.3em] font-bold text-gray-600 pt-6 border-t border-[#1a1a1a]">
        <div className="flex gap-6">
          <span>Session Source: Remote</span>
          <span className="text-neon-green">Protocol: SECURE</span>
        </div>
        <div>
          <span>&copy; 2026 NEON ARCADE CORE</span>
        </div>
      </footer>
    </div>
  );
}
