import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, RotateCcw, MapPin, Heart } from 'lucide-react';
import { soundManager } from '../services/sound';

interface ResultsModalProps {
  shaadiMood: number;
  completedCount: number;
  totalTasks: number;
  budgetRemaining: number;
  onReplay: () => void;
  onOpenMap: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  shaadiMood,
  completedCount,
  totalTasks,
  budgetRemaining,
  onReplay,
  onOpenMap
}) => {
  const isSuperstar = shaadiMood >= 75;
  const isKaamChalao = shaadiMood >= 50 && shaadiMood < 75;

  useEffect(() => {
    soundManager.playVictory();
    if (isSuperstar) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isSuperstar]);

  const rankTitle = isSuperstar 
    ? 'Shaadi Superstar!' 
    : isKaamChalao 
    ? 'Kaam Chalao Planner' 
    : 'Shaadi Ka Satyanash!';

  const rankBadgeColor = isSuperstar 
    ? 'bg-amber-400 text-amber-950 border-amber-600' 
    : isKaamChalao 
    ? 'bg-yellow-200 text-yellow-950 border-yellow-500' 
    : 'bg-rose-400 text-rose-950 border-rose-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-sm bg-gradient-to-b from-amber-100 via-amber-50 to-amber-200 border-4 border-amber-950 rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col font-['Baloo_2',sans-serif]"
        onClick={e => e.stopPropagation()}
      >
        {/* Ornate Top Banner */}
        <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white p-4 text-center border-b-2 border-amber-950">
          <span className="text-3xl mb-1 block animate-bounce">🎊 🛕 🎊</span>
          <h2 className="text-2xl font-black uppercase tracking-wider text-amber-100">
            Shaadi Mubarak!
          </h2>
          <span className="text-xs text-amber-200 font-bold uppercase tracking-widest">
            Wedding Day 1 Concluded
          </span>
        </div>

        {/* Rank & Mood Display */}
        <div className="p-4 flex flex-col items-center text-center">
          {/* Trophy Badge */}
          <div className="relative mb-2">
            <div className="w-20 h-20 rounded-3xl bg-amber-200 border-4 border-amber-500 flex items-center justify-center text-4xl shadow-inner">
              {isSuperstar ? '👑' : isKaamChalao ? '🎖️' : '🤦‍♂️'}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 border-2 border-amber-800 flex items-center justify-center text-sm shadow">
              ⭐
            </div>
          </div>

          <div className={`px-4 py-1 rounded-full text-base font-black uppercase tracking-wider border-2 shadow-sm mb-2 ${rankBadgeColor}`}>
            {rankTitle}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-amber-900">Final Shaadi Mood:</span>
            <span className="text-xl font-black text-rose-700">{shaadiMood}%</span>
          </div>

          {/* Fathers' Humorous Verdicts */}
          <div className="w-full bg-white/90 rounded-2xl p-3 border-2 border-amber-400 mb-3 text-left flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span className="text-2xl">👨‍💼</span>
              <div>
                <span className="text-[11px] font-black text-amber-950 block">Sharmaji (Groom&apos;s Father):</span>
                <p className="text-[11px] text-amber-900 italic leading-snug">
                  {isSuperstar 
                    ? '&ldquo;Wah beta! Gulab jamun garam the, baraat time pe aayi aur DJ ne toh aag laga di!&rdquo;'
                    : isKaamChalao
                    ? '&ldquo;Theek tha beta, thoda paneer kam pad gaya tha par humne sambhal liya.&rdquo;'
                    : '&ldquo;Arre bhai fufa-ji ko sofa nahi mila aur baarish mein tent beh gaya! Lekin shaadi toh ho gayi!&rdquo;'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-amber-200">
              <span className="text-2xl">👨‍🦳</span>
              <div>
                <span className="text-[11px] font-black text-amber-950 block">Guptaji (Bride&apos;s Father):</span>
                <p className="text-[11px] text-amber-900 italic leading-snug">
                  {isSuperstar
                    ? '&ldquo;Panditji bol rahe the itna sundar mandap aur shubh muhurat pehle kabhi nahi dekha!&rdquo;'
                    : '&ldquo;Chalo shukr hai bidaai shanti se ho gayi. Next wedding mein thoda aur focus rakhna!&rdquo;'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="w-full grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="bg-amber-100 p-2 rounded-xl border border-amber-300 text-left">
              <span className="text-[10px] text-amber-800 font-bold block">Tasks Done:</span>
              <span className="text-sm font-black text-amber-950">{completedCount} / {totalTasks}</span>
            </div>
            <div className="bg-amber-100 p-2 rounded-xl border border-amber-300 text-left">
              <span className="text-[10px] text-amber-800 font-bold block">Budget Saved:</span>
              <span className="text-sm font-black text-emerald-800">₹{budgetRemaining}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-2">
            <button
              onClick={() => {
                soundManager.playTap();
                onOpenMap();
              }}
              className="w-full h-11 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl border-2 border-amber-200 text-amber-950 text-sm font-black tracking-wider uppercase shadow-[0_3px_0_#78350f] active:translate-y-1 active:shadow-none flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-4 h-4" />
              <span>Explore Bharat Adventure Map</span>
            </button>

            <button
              onClick={() => {
                soundManager.playTap();
                onReplay();
              }}
              className="w-full h-10 bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay This Wedding</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
