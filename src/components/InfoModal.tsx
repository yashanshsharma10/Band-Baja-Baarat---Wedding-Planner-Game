import React from 'react';
import { X, Heart, Sparkles, BookOpen } from 'lucide-react';
import { soundManager } from '../services/sound';

interface InfoModalProps {
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-sm bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-['Baloo_2',sans-serif]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-amber-950">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-300" />
            <h3 className="text-base font-black uppercase tracking-wide">How to Play</h3>
          </div>
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

        {/* Content */}
        <div className="p-4 flex flex-col gap-3 max-h-80 overflow-y-auto text-xs text-amber-950">
          <div className="bg-white/80 p-3 rounded-2xl border border-amber-400">
            <h4 className="font-black text-amber-900 mb-1 flex items-center gap-1">
              <span>🛕</span> The Goal
            </h4>
            <p className="leading-snug">
              Welcome to <strong>Band Baja Baarat</strong>! As the lead wedding planner, your job is to coordinate the grand wedding lawn, tackle comical crises, keep Maharaj Halwai&apos;s buffet flowing, and ensure the <strong>Shaadi Mood</strong> stays at Superstar levels!
            </p>
          </div>

          <div className="bg-white/80 p-3 rounded-2xl border border-amber-400">
            <h4 className="font-black text-amber-900 mb-1 flex items-center gap-1">
              <span>👆</span> Controls & Navigation
            </h4>
            <ul className="list-disc pl-4 flex flex-col gap-1 leading-snug">
              <li><strong>Swipe or Drag:</strong> Pan the camera across the entire garden from the entrance gate to the mandap.</li>
              <li><strong>Signboard Pins:</strong> Tap any floating alert pin to inspect the crisis and take action.</li>
              <li><strong>Workers Panel:</strong> Ramesh Chacha and Bunty can be assigned to build, decorate, or fix issues.</li>
              <li><strong>General Store:</strong> Run outside the boundary wall to buy emergency sindoor and supplies!</li>
            </ul>
          </div>

          <div className="bg-white/80 p-3 rounded-2xl border border-amber-400">
            <h4 className="font-black text-amber-900 mb-1 flex items-center gap-1">
              <span>🌟</span> Shaadi Mood & Scoring
            </h4>
            <p className="leading-snug">
              Fast crisis resolution increases the mood meter. Failing urgent tasks or delaying hungry guests lowers the mood, leading to humorous verdicts from the bride and groom&apos;s fathers!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-200/60 border-t border-amber-300 text-center">
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="w-full py-2 bg-purple-900 text-purple-100 rounded-xl font-bold text-xs uppercase"
          >
            Got it, Let&apos;s Plan!
          </button>
        </div>
      </div>
    </div>
  );
};
