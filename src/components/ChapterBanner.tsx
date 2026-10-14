import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CHAPTER_CONFIG } from '../data/weddingData';
import { soundManager } from '../services/sound';

interface ChapterBannerProps {
  chapter: number;
  onDismiss: () => void;
}

export const ChapterBanner: React.FC<ChapterBannerProps> = ({ chapter, onDismiss }) => {
  const config = CHAPTER_CONFIG.find(c => c.chapter === chapter) || CHAPTER_CONFIG[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-xs bg-gradient-to-b from-amber-900 via-amber-950 to-amber-900 border-4 border-amber-400 rounded-3xl p-5 text-center text-white shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex flex-col items-center font-['Baloo_2',sans-serif]"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-4xl mb-2 animate-bounce">
          {chapter === 1 ? '🌅' : chapter === 2 ? '🍲' : chapter === 3 ? '🌧️' : chapter === 4 ? '🛕' : chapter === 5 ? '🥁' : '🎊'}
        </div>

        <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500 mb-1">
          Wedding Day 1 • Chapter {chapter}
        </span>

        <h3 className="text-xl font-black text-amber-200 uppercase tracking-wide leading-tight mb-1">
          {config.title}
        </h3>

        <p className="text-xs text-amber-300/90 font-medium mb-3">
          {config.subtitle}
        </p>

        <div className="bg-amber-950/70 border border-amber-500/60 rounded-2xl p-3 text-xs text-amber-100 mb-4 leading-snug">
          {config.description}
        </div>

        <button
          onClick={() => {
            soundManager.playTap();
            soundManager.playDhol('treble');
            onDismiss();
          }}
          className="w-full h-11 bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_4px_0_#78350f] active:translate-y-1 active:shadow-none flex items-center justify-center gap-1.5"
        >
          <span>Continue Planning</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
