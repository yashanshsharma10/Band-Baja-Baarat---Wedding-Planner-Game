import React, { useState } from 'react';
import { ArrowLeft, Lock, Unlock, Compass, MapPin, Sparkles } from 'lucide-react';
import { INDIA_REGIONS } from '../data/weddingData';
import { soundManager } from '../services/sound';

interface IndiaMapModalProps {
  onClose: () => void;
  onSelectLevel: (levelId: string) => void;
}

export const IndiaMapModal: React.FC<IndiaMapModalProps> = ({
  onClose,
  onSelectLevel
}) => {
  const [selectedRegion, setSelectedRegion] = useState(INDIA_REGIONS[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-amber-950/80 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-sm h-[90vh] max-h-[720px] bg-[#fbf5e6] border-4 border-amber-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-['Baloo_2',sans-serif]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header matching reference */}
        <div className="relative bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 p-2.5 flex items-center justify-between text-white border-b-2 border-amber-900 shadow">
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-amber-950/40 flex items-center justify-center text-amber-200 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-sm font-black tracking-wider uppercase text-amber-100">
              Band Baaja Bharat
            </span>
            <span className="text-[10px] text-amber-200 tracking-widest uppercase font-bold">
              Adventure Map
            </span>
          </div>

          <div className="w-8 h-8 flex items-center justify-center text-amber-200">
            <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
        </div>

        {/* Parchment Styled Map Area with Regional Markers */}
        <div className="relative flex-1 p-3 overflow-y-auto flex flex-col gap-3">
          {/* India Map Graphic Banner */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-amber-600 shadow-md">
            <img 
              src={selectedRegion.image} 
              alt={selectedRegion.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3 text-white">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">{selectedRegion.region}</span>
              </div>
              <h3 className="text-base font-black leading-tight">{selectedRegion.name}</h3>
              <p className="text-[11px] text-amber-100 line-clamp-1">{selectedRegion.theme}</p>
            </div>
          </div>

          {/* Regional Weddings List */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black text-amber-950 uppercase tracking-wide px-1">
              Select Wedding Expedition:
            </span>

            {INDIA_REGIONS.map(reg => {
              const isSelected = selectedRegion.id === reg.id;

              return (
                <div
                  key={reg.id}
                  onClick={() => {
                    soundManager.playTap();
                    setSelectedRegion(reg);
                  }}
                  className={`p-2.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-amber-100 border-amber-800 shadow-md scale-[1.01]' 
                      : 'bg-white/80 border-amber-300 hover:border-amber-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow ${
                      reg.unlocked ? 'bg-amber-600' : 'bg-stone-500'
                    }`}>
                      {reg.unlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-amber-950 leading-tight">
                        Level {reg.level}: {reg.name}
                      </h4>
                      <span className="text-[10px] text-amber-700 font-semibold">{reg.region}</span>
                    </div>
                  </div>

                  <div>
                    {reg.unlocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playTap();
                          onSelectLevel(reg.id);
                        }}
                        className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-[11px] font-black rounded-xl uppercase shadow"
                      >
                        Play
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full border border-stone-300">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-200/80 border-t border-amber-300 text-center">
          <p className="text-[10px] text-amber-900 font-medium">
            Complete Level 1 &quot;Shaadi Mein Hungama&quot; to unlock royal destinations across India!
          </p>
        </div>
      </div>
    </div>
  );
};
