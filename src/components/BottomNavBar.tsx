import React from 'react';
import { ClipboardList, Package, Users, ShoppingBag, Map } from 'lucide-react';
import { soundManager } from '../services/sound';

interface BottomNavBarProps {
  pendingTasksCount: number;
  onOpenTasks: () => void;
  onOpenStorage: () => void;
  onOpenWorkers: () => void;
  onOpenStore: () => void;
  onOpenMap: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  pendingTasksCount,
  onOpenTasks,
  onOpenStorage,
  onOpenWorkers,
  onOpenStore,
  onOpenMap
}) => {
  const handleClick = (action: () => void) => {
    soundManager.playTap();
    action();
  };

  return (
    <div className="relative z-30 w-full bg-gradient-to-t from-amber-950 via-amber-950/95 to-amber-950/40 border-t-2 border-amber-500/70 px-2 py-2 select-none font-['Baloo_2',sans-serif]">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1.5">
        {/* 1. TASKS */}
        <button
          onClick={() => handleClick(onOpenTasks)}
          className="relative bg-amber-900/90 hover:bg-amber-800 border border-amber-400/80 rounded-2xl py-1.5 flex flex-col items-center justify-center text-amber-200 active:scale-95 shadow-md"
        >
          {pendingTasksCount > 0 && (
            <span className="absolute -top-1.5 -right-1 w-5 h-5 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center border-2 border-amber-300 animate-pulse shadow">
              {pendingTasksCount}
            </span>
          )}
          <ClipboardList className="w-5 h-5 text-amber-300" />
          <span className="text-[10px] font-bold mt-0.5 leading-none">Tasks</span>
        </button>

        {/* 2. STORAGE */}
        <button
          onClick={() => handleClick(onOpenStorage)}
          className="bg-amber-900/90 hover:bg-amber-800 border border-amber-400/80 rounded-2xl py-1.5 flex flex-col items-center justify-center text-amber-200 active:scale-95 shadow-md"
        >
          <Package className="w-5 h-5 text-amber-300" />
          <span className="text-[10px] font-bold mt-0.5 leading-none">Storage</span>
        </button>

        {/* 3. WORKERS */}
        <button
          onClick={() => handleClick(onOpenWorkers)}
          className="bg-amber-900/90 hover:bg-amber-800 border border-amber-400/80 rounded-2xl py-1.5 flex flex-col items-center justify-center text-amber-200 active:scale-95 shadow-md"
        >
          <Users className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-bold mt-0.5 leading-none">Workers</span>
        </button>

        {/* 4. GENERAL STORE */}
        <button
          onClick={() => handleClick(onOpenStore)}
          className="bg-amber-900/90 hover:bg-amber-800 border border-amber-400/80 rounded-2xl py-1.5 flex flex-col items-center justify-center text-amber-200 active:scale-95 shadow-md"
        >
          <ShoppingBag className="w-5 h-5 text-yellow-400" />
          <span className="text-[10px] font-bold mt-0.5 leading-none">Store</span>
        </button>

        {/* 5. INDIA MAP */}
        <button
          onClick={() => handleClick(onOpenMap)}
          className="bg-amber-900/90 hover:bg-amber-800 border border-amber-400/80 rounded-2xl py-1.5 flex flex-col items-center justify-center text-amber-200 active:scale-95 shadow-md"
        >
          <Map className="w-5 h-5 text-sky-400" />
          <span className="text-[10px] font-bold mt-0.5 leading-none">Map</span>
        </button>
      </div>
    </div>
  );
};
