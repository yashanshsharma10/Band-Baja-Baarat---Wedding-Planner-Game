import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GardenMap } from './components/GardenMap';
import { CateringMiniGame } from './components/CateringMiniGame';
import { TaskPopup } from './components/TaskPopup';
import { StorageModal } from './components/StorageModal';
import { WorkersModal } from './components/WorkersModal';
import { GeneralStoreModal } from './components/GeneralStoreModal';
import { TasksModal } from './components/TasksModal';
import { IndiaMapModal } from './components/IndiaMapModal';
import { SettingsModal } from './components/SettingsModal';
import { InfoModal } from './components/InfoModal';
import { ResultsModal } from './components/ResultsModal';
import { LocationDetailsModal } from './components/LocationDetailsModal';
import { ChapterBanner } from './components/ChapterBanner';
import { TopHUD } from './components/TopHUD';
import { BottomNavBar } from './components/BottomNavBar';
import { 
  INITIAL_TASKS, 
  INITIAL_INVENTORY, 
  CHAPTER_CONFIG, 
  GARDEN_LOCATIONS 
} from './data/weddingData';
import { WeddingTask, Worker, GameScreen, GardenLocation } from './types/game';
import { soundManager } from './services/sound';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');
  const [currentChapter, setCurrentChapter] = useState(1);
  // Mood starts strictly at 0%!
  const [shaadiMood, setShaadiMood] = useState(0);
  const [budget, setBudget] = useState(1500);
  const [inventory, setInventory] = useState<Record<string, number>>(INITIAL_INVENTORY);
  const [tasks, setTasks] = useState<WeddingTask[]>(INITIAL_TASKS);
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: 'w1',
      name: 'Ramesh Chacha',
      role: 'Operations Head',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      assignedTaskId: null,
      taskProgress: 0,
      timeTotal: 10,
      timeLeft: 10,
      status: 'idle'
    },
    {
      id: 'w2',
      name: 'Bunty Cousin',
      role: 'Express Logistics',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      assignedTaskId: null,
      taskProgress: 0,
      timeTotal: 10,
      timeLeft: 10,
      status: 'idle'
    }
  ]);

  // Active Modals & Overlays
  const [activeTaskModal, setActiveTaskModal] = useState<WeddingTask | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<GardenLocation | null>(null);
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [isWorkersOpen, setIsWorkersOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [chapterBanner, setChapterBanner] = useState<number | null>(null);
  const [isRainActive, setIsRainActive] = useState(false);

  // Main Game Loop: 30-Second Task Countdown & Worker Progress
  useEffect(() => {
    if (currentScreen !== 'garden') return;

    const interval = setInterval(() => {
      // 1. Worker Progress Tick
      setWorkers(prevWorkers =>
        prevWorkers.map(w => {
          if (!w.assignedTaskId) return w;

          const newProgress = Math.min(100, w.taskProgress + (100 / w.timeTotal));
          const newTimeLeft = Math.max(0, w.timeLeft - 1);

          if (newProgress >= 100) {
            // Task Completed!
            const finishedTaskId = w.assignedTaskId;
            completeTask(finishedTaskId);

            return {
              ...w,
              assignedTaskId: null,
              taskProgress: 0,
              timeLeft: w.timeTotal,
              status: 'idle'
            };
          }

          return {
            ...w,
            taskProgress: newProgress,
            timeLeft: newTimeLeft,
            status: 'working'
          };
        })
      );

      // 2. Active Task 30-Second Countdown Tick
      setTasks(prevTasks =>
        prevTasks.map(t => {
          if (t.status !== 'available' && t.status !== 'in_progress') return t;
          if (t.timeRemaining === undefined) return t;

          const newTime = t.timeRemaining - 1;
          if (newTime <= 0) {
            // 30s Timer Expired!
            handleTaskTimeout(t.id);
            return { ...t, timeRemaining: 30 }; // resets with fresh timer so player can retry!
          }
          return { ...t, timeRemaining: newTime };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [currentScreen, tasks]);

  // Handle 30-Second Timeout
  const handleTaskTimeout = (taskId: string) => {
    soundManager.playAlert();
    // Soft reminder penalty (drops by 1% if mood > 0, resets timer to 30s so user can finish)
    setShaadiMood(m => Math.max(0, m - 1));
  };

  // Complete a Task and Unlock the Next Sequential Task!
  const completeTask = (taskId: string) => {
    soundManager.playVictory();
    soundManager.playDhol('bass');

    const currentIndex = tasks.findIndex(t => t.id === taskId);
    if (currentIndex === -1) return;

    const currentTask = tasks[currentIndex];

    // Increase Shaadi Mood by 4% per task (25 tasks = 100% total!)
    setShaadiMood(m => Math.min(100, m + 4));

    if (currentTask.currencyReward) {
      setBudget(b => b + currentTask.currencyReward!);
    }

    // Unlock next sequential task!
    const nextIndex = currentIndex + 1;
    setTasks(prevTasks =>
      prevTasks.map((t, idx) => {
        if (idx === currentIndex) {
          return { ...t, status: 'completed' };
        }
        if (idx === nextIndex) {
          // Unlock with fresh 30-second timer!
          return { ...t, status: 'available', timeRemaining: 30 };
        }
        return t;
      })
    );

    // Check if next task enters a new Chapter
    if (nextIndex < tasks.length) {
      const nextTask = tasks[nextIndex];
      if (nextTask.chapter !== currentChapter) {
        setCurrentChapter(nextTask.chapter);
        setChapterBanner(nextTask.chapter);
        soundManager.playShehnai();

        if (nextTask.chapter === 3) {
          setIsRainActive(true);
        } else {
          setIsRainActive(false);
        }
      }
    } else {
      // All 25 Tasks Completed! Grand Shaadi Mubarak Celebration!
      setTimeout(() => {
        setCurrentScreen('results');
      }, 1500);
    }
  };

  // Assign a worker to a task
  const handleAssignWorker = (taskId: string, workerId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setWorkers(prevWorkers =>
      prevWorkers.map(w => {
        if (w.id === workerId) {
          return {
            ...w,
            assignedTaskId: taskId,
            taskProgress: 0,
            timeTotal: 8, // fast 8-second execution within 30s window
            timeLeft: 8,
            status: 'working'
          };
        }
        return w;
      })
    );

    setTasks(prevTasks =>
      prevTasks.map(t => (t.id === taskId ? { ...t, status: 'in_progress', workerAssigned: workerId } : t))
    );
  };

  // Deliver item for quest (e.g. Task 10 Sindoor)
  const handleDeliverItem = (taskId: string, itemId: string) => {
    setInventory(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1)
    }));

    completeTask(taskId);
  };

  // Solve Crisis (e.g. Task 9 Rain Tarps)
  const handleSolveCrisis = (taskId: string) => {
    completeTask(taskId);
    setIsRainActive(false);
  };

  // Catering Mini-game completion (Task 6 or Task 19)
  const handleCateringComplete = (served: number, total: number) => {
    setCurrentScreen('garden');
    const activeCateringTask = tasks.find(t => (t.id === 'task_6' || t.id === 'task_19') && (t.status === 'available' || t.status === 'in_progress'));
    if (activeCateringTask) {
      completeTask(activeCateringTask.id);
    }
  };

  // Buy Item in General Store
  const handleBuyItem = (itemId: string, price: number, quantity: number) => {
    if (budget < price) return;
    setBudget(b => b - price);
    setInventory(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + quantity
    }));
  };

  // Reset Wedding from Scratch
  const handleResetGame = () => {
    setCurrentChapter(1);
    // Reset mood to 0%
    setShaadiMood(0);
    setBudget(1500);
    setInventory(INITIAL_INVENTORY);
    setTasks(INITIAL_TASKS.map((t, idx) => ({
      ...t,
      status: idx === 0 ? 'available' : 'locked',
      timeRemaining: 30
    })));
    setWorkers(prev => prev.map(w => ({ ...w, assignedTaskId: null, taskProgress: 0, status: 'idle' })));
    setIsRainActive(false);
    setCurrentScreen('garden');
    setChapterBanner(1);
  };

  const currentPhase = CHAPTER_CONFIG.find(c => c.chapter === currentChapter)?.phase || 'morning';
  const pendingTasksCount = tasks.filter(t => t.status === 'available' || t.status === 'active' || t.status === 'in_progress').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center overflow-hidden">
      {/* Mobile Responsive Frame (390 x 844 Portrait Aspect) */}
      <div className="relative w-full h-full max-w-[430px] max-h-[920px] sm:rounded-3xl sm:border-8 sm:border-amber-950/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col bg-amber-950">
        
        {/* 1. HOME SCREEN */}
        {currentScreen === 'home' && (
          <HomeScreen
            onStartGame={() => {
              setCurrentScreen('garden');
              setChapterBanner(1);
            }}
            onOpenMap={() => setIsMapOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenInfo={() => setIsInfoOpen(true)}
          />
        )}

        {/* 2. CATERING BUFFET MINI-GAME */}
        {currentScreen === 'catering_minigame' && (
          <CateringMiniGame
            onComplete={handleCateringComplete}
            onExit={() => setCurrentScreen('garden')}
          />
        )}

        {/* 3. WEDDING GARDEN EXPLORATION (MAIN GAMEPLAY) */}
        {currentScreen === 'garden' && (
          <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
            {/* Top Status Bar with 0% Initial Mood */}
            <TopHUD
              currentChapter={currentChapter}
              phase={currentPhase}
              shaadiMood={shaadiMood}
              budget={budget}
              workers={workers}
              onGoHome={() => setCurrentScreen('home')}
              onOpenWorkers={() => setIsWorkersOpen(true)}
            />

            {/* Interactive Garden Map Canvas with Animated Moving Characters */}
            <div className="relative flex-1 w-full h-full">
              <GardenMap
                tasks={tasks}
                workers={workers}
                isRainActive={isRainActive}
                onSelectLocation={(loc) => setSelectedLocation(loc)}
                onSelectTask={(task) => setActiveTaskModal(task)}
              />
            </div>

            {/* Bottom Navigation Bar */}
            <BottomNavBar
              pendingTasksCount={pendingTasksCount}
              onOpenTasks={() => setIsTasksOpen(true)}
              onOpenStorage={() => setIsStorageOpen(true)}
              onOpenWorkers={() => setIsWorkersOpen(true)}
              onOpenStore={() => setIsStoreOpen(true)}
              onOpenMap={() => setIsMapOpen(true)}
            />
          </div>
        )}

        {/* 4. RESULTS SCREEN */}
        {currentScreen === 'results' && (
          <ResultsModal
            shaadiMood={shaadiMood}
            completedCount={completedTasksCount}
            totalTasks={tasks.length}
            budgetRemaining={budget}
            onReplay={handleResetGame}
            onOpenMap={() => {
              setCurrentScreen('home');
              setIsMapOpen(true);
            }}
          />
        )}

        {/* MODALS OVER GARDEN */}

        {/* Task Details Popup */}
        {activeTaskModal && (
          <TaskPopup
            task={activeTaskModal}
            workers={workers}
            inventory={inventory}
            onClose={() => setActiveTaskModal(null)}
            onAssignWorker={handleAssignWorker}
            onStartMiniGame={() => setCurrentScreen('catering_minigame')}
            onDeliverItem={handleDeliverItem}
            onSolveCrisis={handleSolveCrisis}
            onOpenStore={() => setIsStoreOpen(true)}
          />
        )}

        {/* Location Details Modal */}
        {selectedLocation && (
          <LocationDetailsModal
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
            onOpenStorage={() => setIsStorageOpen(true)}
            onOpenStore={() => setIsStoreOpen(true)}
            onOpenWorkers={() => setIsWorkersOpen(true)}
          />
        )}

        {/* Storage & Inventory Modal */}
        {isStorageOpen && (
          <StorageModal
            inventory={inventory}
            onClose={() => setIsStorageOpen(false)}
            onOpenStore={() => {
              setIsStorageOpen(false);
              setIsStoreOpen(true);
            }}
          />
        )}

        {/* Workers Modal */}
        {isWorkersOpen && (
          <WorkersModal
            workers={workers}
            tasks={tasks}
            onClose={() => setIsWorkersOpen(false)}
            onReassignWorker={handleAssignWorker}
          />
        )}

        {/* General Store Modal */}
        {isStoreOpen && (
          <GeneralStoreModal
            budget={budget}
            inventory={inventory}
            onClose={() => setIsStoreOpen(false)}
            onBuyItem={handleBuyItem}
          />
        )}

        {/* Tasks Checklist Modal */}
        {isTasksOpen && (
          <TasksModal
            tasks={tasks}
            onClose={() => setIsTasksOpen(false)}
            onSelectTask={(task) => {
              setIsTasksOpen(false);
              setActiveTaskModal(task);
            }}
          />
        )}

        {/* India Adventure Map Modal */}
        {isMapOpen && (
          <IndiaMapModal
            onClose={() => setIsMapOpen(false)}
            onSelectLevel={() => {
              setIsMapOpen(false);
              handleResetGame();
            }}
          />
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
          <SettingsModal
            onClose={() => setIsSettingsOpen(false)}
            onResetGame={handleResetGame}
          />
        )}

        {/* Info & Guide Modal */}
        {isInfoOpen && (
          <InfoModal
            onClose={() => setIsInfoOpen(false)}
          />
        )}

        {/* Chapter Transition Story Banner */}
        {chapterBanner && (
          <ChapterBanner
            chapter={chapterBanner}
            onDismiss={() => setChapterBanner(null)}
          />
        )}
      </div>
    </div>
  );
}
