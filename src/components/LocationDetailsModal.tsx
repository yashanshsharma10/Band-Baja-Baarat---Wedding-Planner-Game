import React from 'react';
import { X, MapPin, ArrowRight } from 'lucide-react';
import { GardenLocation } from '../types/game';
import { soundManager } from '../services/sound';

interface LocationDetailsModalProps {
  location: GardenLocation;
  onClose: () => void;
  onOpenStorage: () => void;
  onOpenStore: () => void;
  onOpenWorkers: () => void;
}

export const LocationDetailsModal: React.FC<LocationDetailsModalProps> = ({
  location,
  onClose,
  onOpenStorage,
  onOpenStore,
  onOpenWorkers
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-xs bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-['Baloo_2',sans-serif]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-amber-950">
          <div className="flex items-center gap-2">
            <span className="text-xl">{location.icon}</span>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide leading-tight">
                {location.name}
              </h3>
              <span className="text-[10px] text-amber-200 font-bold">{location.hindiName}</span>
            </div>
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
        <div className="p-4 flex flex-col gap-3">
          <div className="bg-white/80 p-3 rounded-2xl border border-amber-400">
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {location.description}
            </p>
          </div>

          {/* Quick Contextual Action button */}
          {location.id === 'storage' && (
            <button
              onClick={() => {
                soundManager.playTap();
                onClose();
                onOpenStorage();
              }}
              className="w-full py-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Open Storage Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {location.id === 'general_store' && (
            <button
              onClick={() => {
                soundManager.playTap();
                onClose();
                onOpenStore();
              }}
              className="w-full py-2 bg-gradient-to-r from-yellow-600 to-amber-500 text-amber-950 text-xs font-black uppercase tracking-wider rounded-xl shadow flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Enter General Store</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {location.id === 'mandap' && (
            <button
              onClick={() => {
                soundManager.playTap();
                onClose();
                onOpenWorkers();
              }}
              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Assign Workers to Mandap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-amber-200/60 border-t border-amber-300">
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="w-full py-1.5 bg-amber-900 text-amber-100 rounded-xl font-bold text-xs uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
