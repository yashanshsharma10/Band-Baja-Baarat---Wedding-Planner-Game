import React from 'react';
import { X, Clock, AlertTriangle, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';
import { WeddingTask, Worker } from '../types/game';
import { CHARACTERS } from '../data/weddingData';
import { soundManager } from '../services/sound';

interface TaskPopupProps {
  task: WeddingTask;
  workers: Worker[];
  inventory: Record<string, number>;
  onClose: () => void;
  onAssignWorker: (taskId: string, workerId: string) => void;
  onStartMiniGame: () => void;
  onDeliverItem: (taskId: string, itemId: string) => void;
  onSolveCrisis: (taskId: string) => void;
  onOpenStore: () => void;
}

export const TaskPopup: React.FC<TaskPopupProps> = ({
  task,
  workers,
  inventory,
  onClose,
  onAssignWorker,
  onStartMiniGame,
  onDeliverItem,
  onSolveCrisis,
  onOpenStore
}) => {
  const character = Object.values(CHARACTERS).find(c => c.id === task.characterId) || CHARACTERS.planner;
  const isUrgent = task.urgency === 'urgent';

  const assignedWorker = workers.find(w => w.assignedTaskId === task.id);
  const availableWorkers = workers.filter(w => !w.assignedTaskId);

  // Check required item in inventory
  const hasRequiredItem = task.requiredItem ? (inventory[task.requiredItem] || 0) >= (task.requiredItemCount || 1) : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-sm bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-950 rounded-3xl shadow-[0_12px_32px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col font-['Baloo_2',sans-serif]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Wood Banner */}
        <div className={`px-4 py-2.5 flex items-center justify-between border-b-2 border-amber-950 text-white ${
          isUrgent ? 'bg-gradient-to-r from-red-700 via-rose-600 to-red-700' : 'bg-gradient-to-r from-amber-900 to-amber-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <div>
              <h3 className="text-sm font-black tracking-wide uppercase leading-tight">
                {task.title}
              </h3>
              <span className="text-[10px] text-amber-200 font-semibold">{task.locationName}</span>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-amber-100 active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Character Story Panel */}
        <div className="p-4 flex gap-3 bg-amber-50/70 border-b border-amber-300 items-start">
          <div className="relative">
            <img 
              src={character.avatar} 
              alt={character.name} 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-700 shadow"
            />
            <span className="absolute -bottom-1 -right-1 text-xs">💬</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950">{character.name}</span>
              <span className="text-[9px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded-md">
                {character.role}
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-1 leading-snug">
              {task.description}
            </p>
          </div>
        </div>

        {/* Task Details & Instruction */}
        <div className="p-4 flex flex-col gap-3">
          {/* Urgency countdown indicator */}
          {task.timeRemaining !== undefined && (
            <div className={`px-3 py-1.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
              isUrgent ? 'bg-red-100 border-red-400 text-red-900 animate-pulse' : 'bg-amber-100 border-amber-300 text-amber-900'
            }`}>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-red-600" />
                <span>Time Remaining:</span>
              </div>
              <span className="font-mono text-sm font-black">{task.timeRemaining} seconds</span>
            </div>
          )}

          {/* Action Instruction */}
          <div className="bg-amber-900/10 rounded-2xl p-3 border border-amber-400/60 text-xs text-amber-950 font-medium">
            <span className="font-bold text-amber-900 uppercase tracking-wide block mb-0.5">Objective:</span>
            {task.instruction}
          </div>

          {/* If required item (e.g. Chapter 4 missing Sindoor) */}
          {task.requiredItem && (
            <div className="bg-amber-50 rounded-2xl p-2.5 border border-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔴</span>
                <div>
                  <span className="text-xs font-bold text-amber-950 block">Requires: Sindoor Box</span>
                  <span className="text-[10px] text-amber-800">
                    In Storage: {inventory[task.requiredItem] || 0} / {task.requiredItemCount || 1}
                  </span>
                </div>
              </div>

              {!hasRequiredItem && (
                <button
                  onClick={() => {
                    soundManager.playTap();
                    onClose();
                    onOpenStore();
                  }}
                  className="bg-yellow-500 hover:bg-yellow-400 text-amber-950 text-[11px] font-black px-2.5 py-1 rounded-xl shadow active:scale-95"
                >
                  Buy at Shop
                </button>
              )}
            </div>
          )}

          {/* Primary Action Button Based on ActionType */}
          <div className="mt-2 flex flex-col gap-2">
            {/* 1. Mini-Game Trigger (Chapter 2 Buffet) */}
            {task.actionType === 'mini_game' && (
              <button
                onClick={() => {
                  soundManager.playTap();
                  onClose();
                  onStartMiniGame();
                }}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl border-2 border-emerald-400 text-white font-black text-base uppercase tracking-wider shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
              >
                <span>Start Serving Buffet</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {/* 2. Worker Assignment (Chapter 1 Mandap & Seating) */}
            {task.actionType === 'worker_assign' && (
              <div>
                {assignedWorker ? (
                  <div className="bg-emerald-100 border border-emerald-400 rounded-2xl p-2.5 text-center">
                    <span className="text-xs font-bold text-emerald-900 flex items-center justify-center gap-1">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      {assignedWorker.name} is working on this ({Math.floor(assignedWorker.taskProgress)}%)
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-amber-900">Assign a worker to handle this:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {workers.map(w => (
                        <button
                          key={w.id}
                          onClick={() => {
                            soundManager.playTap();
                            onAssignWorker(task.id, w.id);
                            onClose();
                          }}
                          className="bg-gradient-to-b from-amber-50 to-amber-200 border-2 border-amber-600 hover:border-amber-800 rounded-xl p-2 flex items-center gap-2 text-left active:scale-95 transition-transform shadow"
                        >
                          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-sm shadow">
                            👷
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-amber-950 block leading-tight">{w.name}</span>
                            <span className="text-[9px] text-amber-700">{w.assignedTaskId ? 'Busy' : 'Available'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Deliver Item (Chapter 4 Sindoor Delivery) */}
            {task.actionType === 'deliver_item' && (
              <button
                disabled={!hasRequiredItem}
                onClick={() => {
                  soundManager.playVictory();
                  onDeliverItem(task.id, task.requiredItem!);
                  onClose();
                }}
                className={`w-full h-12 rounded-2xl border-2 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 ${
                  hasRequiredItem 
                    ? 'bg-gradient-to-r from-red-600 to-rose-500 border-amber-300 text-white shadow-[0_4px_0_#991b1b] active:translate-y-1'
                    : 'bg-stone-300 border-stone-400 text-stone-600 cursor-not-allowed'
                }`}
              >
                <span>Deliver Sindoor to Mandap</span>
              </button>
            )}

            {/* 4. Crisis Solve (Chapter 3 Rain) */}
            {task.actionType === 'crisis_solve' && (
              <button
                onClick={() => {
                  soundManager.playTap();
                  soundManager.playDhol('bass');
                  onSolveCrisis(task.id);
                  onClose();
                }}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-sky-500 rounded-2xl border-2 border-sky-300 text-white font-black text-base uppercase tracking-wider shadow-[0_4px_0_#1e40af] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
              >
                <span>🛡️ Deploy Rain Covers Over Buffet!</span>
              </button>
            )}

            {/* Later / Close button */}
            <button
              onClick={() => {
                soundManager.playTap();
                onClose();
              }}
              className="w-full py-2 text-center text-xs font-bold text-amber-800 hover:text-amber-950"
            >
              Check Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
