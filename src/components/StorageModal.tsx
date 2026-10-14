import React from 'react';
import { X, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import { STORE_ITEMS } from '../data/weddingData';
import { soundManager } from '../services/sound';

interface StorageModalProps {
  inventory: Record<string, number>;
  onClose: () => void;
  onOpenStore: () => void;
}

export const StorageModal: React.FC<StorageModalProps> = ({
  inventory,
  onClose,
  onOpenStore
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-sm bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-['Baloo_2',sans-serif]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-amber-950">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-300" />
            <h3 className="text-base font-black uppercase tracking-wide">Storage & Supplies</h3>
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

        {/* Subtitle / Depot Info */}
        <div className="px-4 py-2 bg-amber-900/10 border-b border-amber-300 text-xs text-amber-950 flex items-center justify-between">
          <span>Central wedding depot inventory</span>
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
              onOpenStore();
            }}
            className="text-amber-900 font-bold underline flex items-center gap-1 hover:text-amber-700"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Visit General Store
          </button>
        </div>

        {/* Inventory Items Grid */}
        <div className="p-4 grid grid-cols-2 gap-2.5 max-h-80 overflow-y-auto">
          {STORE_ITEMS.map(item => {
            const currentCount = inventory[item.id] || 0;
            const isZero = currentCount === 0;

            return (
              <div 
                key={item.id}
                className={`p-2.5 rounded-2xl border-2 flex flex-col justify-between ${
                  isZero ? 'bg-amber-100/50 border-stone-400 opacity-60' : 'bg-white/80 border-amber-500 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                    isZero ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-200 text-amber-950 border-amber-400'
                  }`}>
                    {currentCount} in stock
                  </span>
                </div>

                <div className="mt-2">
                  <h4 className="text-xs font-black text-amber-950 leading-tight">{item.name}</h4>
                  <p className="text-[10px] text-amber-800 leading-snug line-clamp-2 mt-0.5">{item.description}</p>
                </div>

                {isZero && (
                  <button
                    onClick={() => {
                      soundManager.playTap();
                      onClose();
                      onOpenStore();
                    }}
                    className="mt-2 w-full text-[10px] font-black bg-yellow-500 text-amber-950 py-1 rounded-xl shadow flex items-center justify-center gap-1"
                  >
                    <span>Buy at Shop</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Close footer */}
        <div className="p-3 bg-amber-200/60 border-t border-amber-300">
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="w-full py-2 bg-amber-900 text-amber-100 rounded-xl font-bold text-xs uppercase tracking-wider"
          >
            Close Storage
          </button>
        </div>
      </div>
    </div>
  );
};
