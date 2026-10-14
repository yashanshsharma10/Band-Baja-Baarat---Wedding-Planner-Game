import React from 'react';
import { X, ShoppingBag, Coins, Check, AlertCircle } from 'lucide-react';
import { STORE_ITEMS } from '../data/weddingData';
import { soundManager } from '../services/sound';

interface GeneralStoreModalProps {
  budget: number;
  inventory: Record<string, number>;
  onClose: () => void;
  onBuyItem: (itemId: string, price: number, quantity: number) => void;
}

export const GeneralStoreModal: React.FC<GeneralStoreModalProps> = ({
  budget,
  inventory,
  onClose,
  onBuyItem
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-sm bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-['Baloo_2',sans-serif]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-yellow-900 to-amber-950 text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-amber-950">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide">Sharma General Store</h3>
              <span className="text-[10px] text-amber-300 font-semibold">जनरल स्टोर व पूजा भंडार</span>
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

        {/* Budget Bar */}
        <div className="px-4 py-2 bg-amber-900/15 border-b border-amber-400 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-950 font-bold">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span>Wedding Budget:</span>
          </div>
          <span className="text-base font-black text-emerald-800">₹{budget}</span>
        </div>

        {/* Shop Items List */}
        <div className="p-4 flex flex-col gap-2.5 max-h-80 overflow-y-auto">
          {STORE_ITEMS.map(item => {
            const canAfford = budget >= item.price;
            const currentStock = inventory[item.id] || 0;

            return (
              <div 
                key={item.id}
                className="bg-white/90 border-2 border-amber-400 rounded-2xl p-2.5 flex items-center justify-between shadow-sm gap-2"
              >
                <div className="flex items-center gap-2.5 flex-1">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-amber-950 leading-tight">{item.name}</h4>
                    <span className="text-[10px] text-amber-800 font-medium block leading-snug">
                      {item.hindiName}
                    </span>
                    <span className="text-[9px] text-amber-600 font-bold">
                      In storage: {currentStock}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-black text-amber-950">₹{item.price}</span>
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      soundManager.playCoin();
                      onBuyItem(item.id, item.price, item.quantity);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow transition-all ${
                      canAfford 
                        ? 'bg-yellow-500 hover:bg-yellow-400 text-amber-950 active:scale-95' 
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    Buy
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-200/60 border-t border-amber-300 flex items-center justify-between">
          <span className="text-[10px] text-amber-900 font-medium">Delivered straight to storage</span>
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="px-4 py-1.5 bg-amber-900 text-amber-100 rounded-xl font-bold text-xs uppercase"
          >
            Back to Garden
          </button>
        </div>
      </div>
    </div>
  );
};
