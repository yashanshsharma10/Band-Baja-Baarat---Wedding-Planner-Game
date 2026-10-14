import React from 'react';
import { Home, Sparkles, Coins, Users, Heart, Volume2, VolumeX } from 'lucide-react';
import { WeddingPhase, Worker } from '../types/game';
import { CHAPTER_CONFIG } from '../data/weddingData';
import { soundManager } from '../services/sound';

interface TopHUDProps {
  currentChapter: number;
  phase: WeddingPhase;
  shaadiMood: number;
  budget: number;
  workers: Worker[];
  onGoHome: () => void;
  onOpenWorkers: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  currentChapter,
  phase,
  shaadiMood,
  budget,
  workers,
  onGoHome,
  onOpenWorkers
}) => {
  const currentConfig = CHAPTER_CONFIG.find(c => c.chapter === currentChapter) || CHAPTER_CONFIG[0];
  const [muted, setMuted] = React.useState(!soundManager.sfxEnabled);

  const toggleSound = () => {
    soundManager.sfxEnabled = !soundManager.sfxEnabled;
    soundManager.musicEnabled = !soundManager.musicEnabled;
    if (soundManager.musicEnabled) {
      soundManager.startFestiveMusic();
    } else {
      soundManager.stopFestiveMusic();
    }
    setMuted(!soundManager.sfxEnabled);
    soundManager.playTap();
  };

  // Shaadi Mood color
  const moodColor = shaadiMood >= 70 ? 'bg-emerald-500' : shaadiMood >= 45 ? 'bg-amber-400' : 'bg-red-500';
  const moodEmoji = shaadiMood >= 75 ? '🤩' : shaadiMood >= 50 ? '😊' : '😰';

  const idleWorkersCount = workers.filter(w => !w.assignedTaskId).length;

  return (
    <div className="relative z-30 w-full bg-gradient-to-b from-amber-950/95 via-amber-950/85 to-transparent px-3 pt-2 pb-1 flex flex-col gap-1.5 select-none font-['Baloo_2',sans-serif]">
      {/* Top row: Home, Chapter, Audio */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundManager.playTap();
            onGoHome();
          }}
          className="w-9 h-9 rounded-2xl bg-amber-900/90 border border-amber-400/60 text-amber-200 flex items-center justify-center shadow active:scale-95 transition-transform"
          title="Return to Menu"
        >
          <Home className="w-4 h-4" />
        </button>

        {/* Chapter pill */}
        <div className="flex items-center gap-1.5 bg-amber-900/90 backdrop-blur px-3 py-1 rounded-full border border-amber-400/80 shadow-md">
          <span className="text-sm">🏵️</span>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-amber-300 uppercase tracking-widest font-extrabold leading-none">
              Ch {currentChapter}: {currentConfig.title}
            </span>
            <span className="text-[9px] text-amber-200 font-semibold leading-tight">
              {currentConfig.phase.toUpperCase()} PHASE
            </span>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="w-9 h-9 rounded-2xl bg-amber-900/90 border border-amber-400/60 text-amber-200 flex items-center justify-center shadow active:scale-95 transition-transform"
          title="Toggle Sound"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Middle row: Shaadi Mood Meter, Budget, Worker Pill */}
      <div className="flex items-center gap-2">
        {/* Shaadi Mood Gauge */}
        <div className="flex-1 bg-amber-950/90 backdrop-blur border border-amber-400/80 rounded-2xl px-2.5 py-1 shadow-md flex items-center gap-2">
          <span className="text-base">{moodEmoji}</span>
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center text-[9px] font-bold text-amber-200 uppercase tracking-wider">
              <span>Shaadi Mood</span>
              <span className="font-black text-white">{shaadiMood}%</span>
            </div>
            <div className="w-full bg-amber-900/80 rounded-full h-2 overflow-hidden border border-amber-600/60 mt-0.5">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${moodColor}`}
                style={{ width: `${Math.min(100, Math.max(5, shaadiMood))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Budget ₹ */}
        <div className="bg-amber-950/90 backdrop-blur border border-amber-400/80 rounded-2xl px-2.5 py-1 shadow-md flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs font-black text-amber-100">₹{budget}</span>
        </div>

        {/* Workers Quick Status */}
        <button
          onClick={() => {
            soundManager.playTap();
            onOpenWorkers();
          }}
          className="bg-amber-950/90 backdrop-blur border border-amber-400/80 rounded-2xl px-2.5 py-1 shadow-md flex items-center gap-1 active:scale-95 transition-transform"
          title="Workers"
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold text-amber-200">
            {idleWorkersCount > 0 ? `${idleWorkersCount} Free` : '2 Busy'}
          </span>
        </button>
      </div>
    </div>
  );
};
