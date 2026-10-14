import React from 'react';
import { X, ClipboardList, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { WeddingTask } from '../types/game';
import { soundManager } from '../services/sound';

interface TasksModalProps {
  tasks: WeddingTask[];
  onClose: () => void;
  onSelectTask: (task: WeddingTask) => void;
}

export const TasksModal: React.FC<TasksModalProps> = ({
  tasks,
  onClose,
  onSelectTask
}) => {
  const activeTasks = tasks.filter(t => t.status === 'available' || t.status === 'active' || t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="relative w-full max-w-sm bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-['Baloo_2',sans-serif]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-amber-950">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-300" />
            <h3 className="text-base font-black uppercase tracking-wide">Wedding Task Checklist</h3>
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

        {/* Task List */}
        <div className="p-4 flex flex-col gap-3 max-h-80 overflow-y-auto">
          {/* Active Tasks Section */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1">
              <span>⚡</span> Active & Urgent Objectives ({activeTasks.length})
            </span>

            {activeTasks.length === 0 ? (
              <div className="bg-white/80 p-3 rounded-2xl border border-amber-400 text-center text-xs text-amber-800">
                All current chapter tasks completed! Preparing next wedding phase...
              </div>
            ) : (
              activeTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => {
                    soundManager.playTap();
                    onClose();
                    onSelectTask(task);
                  }}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all active:scale-95 shadow-sm ${
                    task.urgency === 'urgent'
                      ? 'bg-rose-50 border-rose-500'
                      : 'bg-white/90 border-amber-400 hover:border-amber-600'
                  }`}
                >
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {task.urgency === 'urgent' && (
                        <span className="text-[10px] font-black bg-rose-600 text-white px-1.5 py-0.2 rounded-full uppercase">
                          Urgent
                        </span>
                      )}
                      <span className="text-xs font-black text-amber-950">{task.title}</span>
                    </div>
                    <span className="text-[10px] text-amber-800 font-medium block">
                      📍 {task.locationName}
                    </span>
                    {task.timeRemaining !== undefined && (
                      <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5 mt-0.5">
                        <Clock className="w-3 h-3" /> {task.timeRemaining}s remaining
                      </span>
                    )}
                  </div>

                  <button className="w-8 h-8 rounded-full bg-amber-950/10 flex items-center justify-center text-amber-900">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Completed Tasks Section */}
          {completedTasks.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-amber-300">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Completed Tasks ({completedTasks.length})
              </span>
              {completedTasks.map(task => (
                <div 
                  key={task.id}
                  className="bg-emerald-50/70 border border-emerald-300 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs opacity-80"
                >
                  <span className="text-emerald-950 font-bold line-through">{task.title}</span>
                  <span className="text-[10px] font-bold text-emerald-700">+{task.moodReward} Mood</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-200/60 border-t border-amber-300">
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="w-full py-2 bg-amber-900 text-amber-100 rounded-xl font-bold text-xs uppercase"
          >
            Back to Garden
          </button>
        </div>
      </div>
    </div>
  );
};
