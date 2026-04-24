import { useState, useRef, useEffect } from 'react';
import { TRACKS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  return (
    <div className="bg-[#111] p-6 border border-[#222] rounded-sm w-full max-w-sm flex flex-col gap-6 shadow-[20px_20px_0_rgba(0,0,0,1)]">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500">System Audio</h3>
        <div className="flex gap-4 items-center">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-2 border-neon-green p-1 rounded-full flex-shrink-0"
          >
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-full mix-blend-luminosity brightness-150"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="overflow-hidden">
            <h4 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">{currentTrack.title}</h4>
            <p className="text-neon-green text-[10px] font-bold uppercase italic mt-1">{currentTrack.artist} // AI_GEN</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-1 bg-[#222] w-full relative">
          <motion.div 
            className="h-full bg-neon-green shadow-[0_0_8px_#00FF41]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between font-bold text-[9px] text-gray-600 uppercase tracking-widest">
          <span>{isPlaying ? 'ACTIVE' : 'IDLE'}</span>
          <span className="text-neon-green italic">Syncing...</span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-10">
        <button onClick={prevTrack} className="text-white hover:text-neon-green transition-colors">
          <SkipBack size={20} fill="currentColor" />
        </button>
        <button
          onClick={togglePlay}
          className="w-16 h-16 bg-white text-black flex items-center justify-center rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={nextTrack} className="text-white hover:text-neon-green transition-colors">
          <SkipForward size={20} fill="currentColor" />
        </button>
      </div>

      <div className="pt-4 border-t border-dashed border-[#333]">
        <div className="flex items-center justify-between text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">
          <span>Output: Balanced</span>
          <Volume2 size={12} className="opacity-50" />
        </div>
      </div>
    </div>
  );
}
