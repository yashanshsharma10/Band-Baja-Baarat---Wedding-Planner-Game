import React from 'react';
import { X, Volume2, VolumeX, Music, Globe, RotateCcw } from 'lucide-react';
import { soundManager } from '../services/sound';

interface SettingsModalProps {
  onClose: () => void;
  onResetGame: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onResetGame
}) => {
  const [sfx, setSfx] = React.useState(soundManager.sfxEnabled);
  const [music, setMusic] = React.useState(soundManager.musicEnabled);
  const [language, setLanguage] = React.useState<'en' | 'hinglish' | 'hi'>('hinglish');

  const toggleSfx = () => {
    soundManager.sfxEnabled = !sfx;
    setSfx(!sfx);
    if (!sfx) soundManager.playTap();
  };

  const toggleMusic = () => {
    soundManager.musicEnabled = !music;
    setMusic(!music);
    if (!music) {
      soundManager.startFestiveMusic();
    } else {
      soundManager.stopFestiveMusic();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-xs bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-['Baloo_2',sans-serif]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-amber-950">
          <h3 className="text-base font-black uppercase tracking-wide">Settings</h3>
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-amber-200 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-4 flex flex-col gap-3">
          {/* Sound SFX */}
          <div className="bg-white/90 p-3 rounded-2xl border border-amber-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {sfx ? <Volume2 className="w-5 h-5 text-teal-700" /> : <VolumeX className="w-5 h-5 text-stone-400" />}
              <span className="text-xs font-bold text-amber-950">Sound Effects (SFX)</span>
            </div>
            <button
              onClick={toggleSfx}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border ${
                sfx ? 'bg-teal-600 border-teal-800' : 'bg-stone-300 border-stone-400'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                sfx ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Dhol & Shehnai Festive Music */}
          <div className="bg-white/90 p-3 rounded-2xl border border-amber-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-teal-700" />
              <div>
                <span className="text-xs font-bold text-amber-950 block">Festive Dhol Music</span>
                <span className="text-[9px] text-amber-800">Wedding rhythm loop</span>
              </div>
            </div>
            <button
              onClick={toggleMusic}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border ${
                music ? 'bg-teal-600 border-teal-800' : 'bg-stone-300 border-stone-400'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                music ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Language Selector */}
          <div className="bg-white/90 p-3 rounded-2xl border border-amber-400 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-amber-950">Game Language</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'hinglish', label: 'Hinglish' },
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'हिन्दी' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    soundManager.playTap();
                    setLanguage(item.id as any);
                  }}
                  className={`py-1 rounded-xl text-xs font-bold border transition-colors ${
                    language === item.id 
                      ? 'bg-teal-700 text-white border-teal-900 shadow-sm' 
                      : 'bg-amber-50 text-amber-900 border-amber-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Wedding Level */}
          <button
            onClick={() => {
              soundManager.playTap();
              if (window.confirm('Reset this wedding from Chapter 1?')) {
                onResetGame();
                onClose();
              }
            }}
            className="mt-2 w-full py-2 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-xl text-xs font-bold text-rose-800 flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart Level 1
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-200/60 border-t border-amber-300 text-center">
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="w-full py-2 bg-amber-900 text-amber-100 rounded-xl font-bold text-xs uppercase"
          >
            Save & Return
          </button>
        </div>
      </div>
    </div>
  );
};
