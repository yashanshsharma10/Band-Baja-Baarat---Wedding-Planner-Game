import React from 'react';
import { X, Users, HardHat, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Worker, WeddingTask } from '../types/game';
import { soundManager } from '../services/sound';

interface WorkersModalProps {
  workers: Worker[];
  tasks: WeddingTask[];
  onClose: () => void;
  onReassignWorker: (workerId: string, newTaskId: string) => void;
}

export const WorkersModal: React.FC<WorkersModalProps> = ({
  workers,
  tasks,
  onClose,
  onReassignWorker
}) => {
  const availableTasks = tasks.filter(
    t => (t.status === 'available' || t.status === 'active') && t.actionType === 'worker_assign'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-sm bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-['Baloo_2',sans-serif]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-amber-950">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-300" />
            <h3 className="text-base font-black uppercase tracking-wide">Wedding Crew (Workers)</h3>
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

        {/* Worker Cards */}
        <div className="p-4 flex flex-col gap-3 max-h-96 overflow-y-auto">
          {workers.map(worker => {
            const currentTask = tasks.find(t => t.id === worker.assignedTaskId);

            return (
              <div 
                key={worker.id}
                className="bg-white/90 border-2 border-amber-500 rounded-2xl p-3 shadow-md flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-200 border-2 border-amber-600 flex items-center justify-center text-2xl shadow">
                    👷
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-amber-950">{worker.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        worker.assignedTaskId 
                          ? 'bg-amber-100 text-amber-900 border-amber-400' 
                          : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      }`}>
                        {worker.assignedTaskId ? 'Working' : 'Idle & Ready'}
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-800 font-semibold">{worker.role}</span>
                  </div>
                </div>

                {/* Current assignment status */}
                {currentTask ? (
                  <div className="bg-amber-50 rounded-xl p-2 border border-amber-300">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-amber-950">Active Task:</span>
                      <span className="text-[11px] text-amber-800 font-medium">{currentTask.title}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden border border-amber-400">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${worker.taskProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-amber-900 font-bold mt-1">
                      <span>{Math.floor(worker.taskProgress)}% Completed</span>
                      <span>{worker.timeLeft}s remaining</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-300 text-center text-xs text-emerald-800 font-medium">
                    Waiting for assignment. Assign to mandap decor or seating!
                  </div>
                )}

                {/* Available Tasks to Assign */}
                {!worker.assignedTaskId && availableTasks.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wide">Assign to Open Task:</span>
                    <div className="grid grid-cols-1 gap-1">
                      {availableTasks.map(t => (
                        <button
                          key={t.id}
                          onClick={() => {
                            soundManager.playTap();
                            onReassignWorker(worker.id, t.id);
                          }}
                          className="w-full py-1.5 px-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg text-xs font-bold shadow flex items-center justify-between active:scale-95"
                        >
                          <span>{t.title}</span>
                          <span className="text-[10px] bg-emerald-800 px-1.5 py-0.5 rounded">Assign</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-200/60 border-t border-amber-300">
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="w-full py-2 bg-amber-900 text-amber-100 rounded-xl font-bold text-xs uppercase tracking-wider"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
