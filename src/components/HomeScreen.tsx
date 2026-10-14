import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../services/sound';

interface HomeScreenProps {
  onStartGame: () => void;
  onOpenMap: () => void;
  onOpenSettings: () => void;
  onOpenInfo: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onOpenMap,
  onOpenSettings,
  onOpenInfo
}) => {
  const [muted, setMuted] = useState(!soundManager.sfxEnabled);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);

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

  const handleStart = () => {
    setPressedBtn('start');
    soundManager.playDhol('bass');
    soundManager.playShehnai();
    setTimeout(() => {
      setPressedBtn(null);
      onStartGame();
    }, 180);
  };

  const handleAction = (btn: string, cb: () => void) => {
    setPressedBtn(btn);
    soundManager.playTap();
    setTimeout(() => {
      setPressedBtn(null);
      cb();
    }, 150);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-amber-950 select-none">
      {/* Exact 9:16 Portrait Menu Artwork */}
      <div className="relative w-full h-full max-w-[430px] max-h-[920px] overflow-hidden shadow-2xl">
        <img
          src="/assets/exact_home_menu.jpg"
          alt="Band Baja Baarat - Wedding Planner Game Menu"
          className="w-full h-full object-fill select-none pointer-events-none"
          draggable={false}
        />

        {/* Floating Sound Toggle Button in Top Corner */}
        <div className="absolute top-3 right-3 z-30">
          <button
            onClick={toggleSound}
            className="w-9 h-9 rounded-2xl bg-amber-950/70 backdrop-blur border border-amber-400/80 text-amber-200 flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
            title="Toggle Sound"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>
        </div>

        {/* Floating Festive Flower Petals Drift */}
        <div className="absolute top-[26%] left-6 text-sm pointer-events-none opacity-75 animate-bounce" style={{ animationDuration: '4.2s' }}>
          🌸
        </div>
        <div className="absolute top-[38%] right-7 text-base pointer-events-none opacity-80 animate-bounce" style={{ animationDuration: '3.5s' }}>
          🌼
        </div>
        <div className="absolute top-[54%] left-8 text-sm pointer-events-none opacity-70 animate-bounce" style={{ animationDuration: '5s' }}>
          🏵️
        </div>

        {/* INTERACTIVE TAP TARGETS OVER THE EXACT 4 BUTTONS */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
          
          {/* 1. START BUTTON (Red Pill) */}
          <button
            onClick={handleStart}
            aria-label="Start Game"
            className={`absolute left-[16%] w-[68%] top-[62.4%] h-[7.8%] rounded-full cursor-pointer transition-all duration-100 ${
              pressedBtn === 'start'
                ? 'scale-[0.96] ring-4 ring-yellow-400/80 bg-red-600/20'
                : 'hover:scale-[1.01] hover:bg-white/10 active:scale-[0.96] active:bg-red-600/30'
            }`}
          />

          {/* 2. MAP BUTTON (Golden Yellow Pill) */}
          <button
            onClick={() => handleAction('map', onOpenMap)}
            aria-label="Adventure Map"
            className={`absolute left-[16%] w-[68%] top-[71.0%] h-[7.8%] rounded-full cursor-pointer transition-all duration-100 ${
              pressedBtn === 'map'
                ? 'scale-[0.96] ring-4 ring-amber-400/80 bg-amber-500/20'
                : 'hover:scale-[1.01] hover:bg-white/10 active:scale-[0.96] active:bg-amber-500/30'
            }`}
          />

          {/* 3. SETTINGS BUTTON (Teal Pill) */}
          <button
            onClick={() => handleAction('settings', onOpenSettings)}
            aria-label="Settings"
            className={`absolute left-[16%] w-[68%] top-[79.6%] h-[7.8%] rounded-full cursor-pointer transition-all duration-100 ${
              pressedBtn === 'settings'
                ? 'scale-[0.96] ring-4 ring-teal-300/80 bg-teal-500/20'
                : 'hover:scale-[1.01] hover:bg-white/10 active:scale-[0.96] active:bg-teal-500/30'
            }`}
          />

          {/* 4. INFO BUTTON (Purple Pill) */}
          <button
            onClick={() => handleAction('info', onOpenInfo)}
            aria-label="Info"
            className={`absolute left-[16%] w-[68%] top-[88.2%] h-[7.8%] rounded-full cursor-pointer transition-all duration-100 ${
              pressedBtn === 'info'
                ? 'scale-[0.96] ring-4 ring-purple-300/80 bg-purple-500/20'
                : 'hover:scale-[1.01] hover:bg-white/10 active:scale-[0.96] active:bg-purple-500/30'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
