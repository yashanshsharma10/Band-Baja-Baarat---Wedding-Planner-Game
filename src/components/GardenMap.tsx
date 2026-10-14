import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, AlertCircle, Clock, CheckCircle2, MessageCircle } from 'lucide-react';
import { GARDEN_LOCATIONS, ANIMATED_CHARACTERS } from '../data/weddingData';
import { WeddingTask, Worker, GardenLocation } from '../types/game';
import { soundManager } from '../services/sound';

interface GardenMapProps {
  tasks: WeddingTask[];
  workers: Worker[];
  isRainActive: boolean;
  onSelectLocation: (location: GardenLocation) => void;
  onSelectTask: (task: WeddingTask) => void;
}

export const GardenMap: React.FC<GardenMapProps> = ({
  tasks,
  workers,
  isRainActive,
  onSelectLocation,
  onSelectTask
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Default camera centered on Mandap (around 50%, 47%)
  const [zoom, setZoom] = useState(1.15);
  const [pan, setPan] = useState({ x: -280, y: -160 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeSpeechCharId, setActiveSpeechCharId] = useState<string | null>(null);

  // Handle Drag / Touch pan
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    // Bounded camera panning
    setPan({
      x: Math.max(-750, Math.min(100, newX)),
      y: Math.max(-500, Math.min(100, newY))
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Center on Mandap
  const resetCamera = () => {
    soundManager.playTap();
    setPan({ x: -280, y: -160 });
    setZoom(1.15);
  };

  const changeZoom = (delta: number) => {
    soundManager.playTap();
    setZoom(prev => Math.max(0.75, Math.min(1.6, Number((prev + delta).toFixed(2)))));
  };

  // Get active task for a location
  const getTaskForLocation = (locationId: string) => {
    return tasks.find(
      t => t.locationId === locationId && (t.status === 'available' || t.status === 'active' || t.status === 'in_progress')
    );
  };

  // Get worker at a location
  const getWorkerAtLocation = (locationId: string) => {
    const locTask = tasks.find(t => t.locationId === locationId);
    if (!locTask) return null;
    return workers.find(w => w.assignedTaskId === locTask.id);
  };

  const handleCharClick = (charId: string) => {
    soundManager.playTap();
    setActiveSpeechCharId(charId);
    setTimeout(() => {
      setActiveSpeechCharId(prev => prev === charId ? null : prev);
    }, 3500);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-emerald-950 cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Zoom / Camera Controls in Corner */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
        <button
          onClick={() => changeZoom(0.2)}
          className="w-10 h-10 rounded-2xl bg-amber-950/90 backdrop-blur border border-amber-400/80 text-amber-200 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => changeZoom(-0.2)}
          className="w-10 h-10 rounded-2xl bg-amber-950/90 backdrop-blur border border-amber-400/80 text-amber-200 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={resetCamera}
          className="w-10 h-10 rounded-2xl bg-amber-950/90 backdrop-blur border border-amber-400/80 text-amber-200 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          title="Center on Mandap"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Swipe exploration hint banner */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none opacity-85">
        <div className="bg-amber-950/90 text-amber-200 px-3.5 py-1 rounded-full border border-amber-400/60 text-[11px] font-bold shadow-lg backdrop-blur flex items-center gap-1.5 whitespace-nowrap">
          <span>👆 Drag to pan garden</span>
          <span className="text-amber-400">• Tap signs to manage</span>
        </div>
      </div>

      {/* Rain Effect Overlay when Chapter 3 crisis is active */}
      {isRainActive && (
        <div className="absolute inset-0 z-20 pointer-events-none bg-slate-900/40 backdrop-blur-[0.5px]">
          <div className="w-full h-full opacity-65 bg-[radial-gradient(#93c5fd_1.5px,transparent_1.5px)] [background-size:18px_18px] animate-pulse" />
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-red-600/95 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider animate-bounce shadow-xl flex items-center gap-1.5 border border-yellow-300">
            <span>🌧️ Downpour Started! Tap Catering to Deploy Covers!</span>
          </div>
        </div>
      )}

      {/* The Scalable & Pannable Isometric Garden Canvas */}
      <div
        className="absolute origin-top-left transition-transform"
        style={{
          width: '1280px',
          height: '720px',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.1, 0.9, 0.2, 1)'
        }}
      >
        {/* Exact Isometric Wedding Garden Venue Artwork */}
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-4 border-amber-950">
          <img 
            src="/assets/garden_venue.jpg" 
            alt="Isometric Indian Wedding Garden Venue" 
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />

          {/* ANIMATED WEDDING CHARACTERS (Eating at Catering, Chatting near Guest House, Dancing at Stage) */}
          {ANIMATED_CHARACTERS.map(char => {
            const isSpeaking = activeSpeechCharId === char.id;

            // Activity-based animations
            let animClass = '';
            if (char.activity === 'eating') {
              animClass = 'animate-pulse';
            } else if (char.activity === 'dancing') {
              animClass = 'animate-bounce';
            } else if (char.activity === 'walking') {
              animClass = 'animate-pulse';
            }

            return (
              <div
                key={char.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCharClick(char.id);
                }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-15 cursor-pointer group flex flex-col items-center ${animClass}`}
                style={{
                  left: `${char.x}%`,
                  top: `${char.y}%`,
                  animationDuration: char.activity === 'dancing' ? '1.2s' : '2.5s'
                }}
              >
                {/* Speech Bubble */}
                {(isSpeaking || char.activity === 'eating') && (
                  <div className="absolute -top-11 z-30 pointer-events-none whitespace-nowrap bg-amber-950/95 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-xl border border-amber-400 shadow-xl flex items-center gap-1 drop-shadow animate-fade-in">
                    {char.activity === 'eating' && <span>🍽️</span>}
                    {char.activity === 'dancing' && <span>🎵</span>}
                    {char.activity === 'chatting' && <span>💬</span>}
                    <span>{char.dialogue}</span>
                  </div>
                )}

                {/* Character Avatar Token */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-800 shadow-lg flex items-center justify-center text-lg transform group-hover:scale-125 transition-transform">
                    {char.avatar}
                  </div>
                  {/* Activity badge dot */}
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-900 text-[8px] flex items-center justify-center font-bold">
                    {char.activity === 'eating' ? '🍲' : char.activity === 'dancing' ? '💃' : char.activity === 'chatting' ? '🏨' : '👟'}
                  </span>
                </div>

                {/* Small Name Pill on Hover */}
                <span className="text-[9px] font-black text-amber-950 bg-amber-200/90 px-1 rounded shadow-sm opacity-80 group-hover:opacity-100 mt-0.5 whitespace-nowrap">
                  {char.name}
                </span>
              </div>
            );
          })}

          {/* Interactive Touch Zones & Active Task Signboards */}
          {GARDEN_LOCATIONS.map(location => {
            const activeTask = getTaskForLocation(location.id);
            const activeWorker = getWorkerAtLocation(location.id);

            return (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-transform hover:scale-105 active:scale-95"
                style={{
                  left: `${location.x}%`,
                  top: `${location.y}%`
                }}
              >
                {/* 1. ACTIVE TASK SIGNBOARD */}
                {activeTask ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playTap();
                      onSelectTask(activeTask);
                    }}
                    className="cursor-pointer flex flex-col items-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                  >
                    {/* Bouncing signboard banner */}
                    <div className="relative px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border-2 shadow-2xl transition-all bg-gradient-to-r from-red-600 via-rose-600 to-red-600 border-amber-300 text-white animate-bounce">
                      {/* Urgency Alert Icon */}
                      <AlertCircle className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />

                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-black leading-tight tracking-wide drop-shadow">
                          {activeTask.title}
                        </span>
                        {activeTask.timeRemaining !== undefined && (
                          <span className="text-[9px] font-extrabold text-amber-200 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {activeTask.timeRemaining}s left
                          </span>
                        )}
                      </div>

                      {/* Exclamation badge */}
                      <div className="w-5 h-5 rounded-full bg-yellow-400 text-red-950 font-black text-xs flex items-center justify-center shadow">
                        !
                      </div>
                    </div>

                    {/* Worker Progress Bar if assigned */}
                    {activeWorker && (
                      <div className="mt-1 w-32 bg-amber-950/95 rounded-full border-2 border-amber-400 p-0.5 shadow-xl flex items-center gap-1 backdrop-blur">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-[9px] flex items-center justify-center text-white font-bold shadow">
                          👷
                        </div>
                        <div className="flex-1 bg-amber-900 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full transition-all duration-300"
                            style={{ width: `${activeWorker.taskProgress}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-amber-200 font-extrabold pr-1">
                          {Math.floor(activeWorker.taskProgress)}%
                        </span>
                      </div>
                    )}

                    {/* Signboard Post Pin */}
                    <div className="w-1.5 h-3 bg-amber-950 rounded-b shadow" />
                  </div>
                ) : (
                  /* 2. STATIC ZONE PIN (For inspecting areas without active problems) */
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playTap();
                      onSelectLocation(location);
                    }}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div className="px-2.5 py-1 rounded-2xl bg-amber-950/85 hover:bg-amber-900 border border-amber-400/80 text-amber-200 flex items-center gap-1.5 text-xs font-bold shadow-lg backdrop-blur transition-all group-hover:scale-110">
                      <span>{location.icon}</span>
                      <span className="text-[10px] uppercase tracking-wide">{location.name}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
