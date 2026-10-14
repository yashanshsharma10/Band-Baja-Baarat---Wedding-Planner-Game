import React, { useState, useEffect } from 'react';
import { Clock, Users, ArrowLeft, RefreshCw, Check, X, Award, AlertTriangle, Sparkles } from 'lucide-react';
import { CATERING_DISHES } from '../data/weddingData';
import { CateringDish } from '../types/game';
import { soundManager } from '../services/sound';

interface GuestQueueItem {
  id: string;
  name: string;
  avatar: string;
  requested: string[]; // dish ids
  served: string[];
  speech: string;
}

const GUEST_TEMPLATES: GuestQueueItem[] = [
  {
    id: 'g1',
    name: 'Sharma Auntie',
    avatar: '👩',
    requested: ['paneer', 'roti'],
    served: [],
    speech: 'Beta, paneer fresh hai na? Aur roti garam dena!'
  },
  {
    id: 'g2',
    name: 'Gupta Uncle',
    avatar: '👨‍💼',
    requested: ['dal', 'rice', 'salad'],
    served: [],
    speech: 'Dal makhani mein thoda desi ghee aur daalo!'
  },
  {
    id: 'g3',
    name: 'Bunty Kid',
    avatar: '🧒',
    requested: ['gulab_jamun', 'chole'],
    served: [],
    speech: 'Mujhe do gulab jamun chahiye pehle!'
  },
  {
    id: 'g4',
    name: 'Pooja Sister',
    avatar: '👱‍♀️',
    requested: ['paneer', 'rice', 'salad'],
    served: [],
    speech: 'Healthy salad aur tasty paneer please!'
  },
  {
    id: 'g5',
    name: 'Chaddha Ji',
    avatar: '👳',
    requested: ['chole', 'roti'],
    served: [],
    speech: 'Oye hoye! Bhature jaise crispy tandoori roti lagao!'
  },
  {
    id: 'g6',
    name: 'Dadi Ji',
    avatar: '👵',
    requested: ['dal', 'roti'],
    served: [],
    speech: 'Thoda sa naram roti aur peeli dal de do beta.'
  },
  {
    id: 'g7',
    name: 'Cousin Rohan',
    avatar: '🧑',
    requested: ['paneer', 'gulab_jamun'],
    served: [],
    speech: 'Bhai wedding buffet ka main event toh yehi hai!'
  },
  {
    id: 'g8',
    name: 'Fufa-ji',
    avatar: '👨‍🦰',
    requested: ['dal', 'chole', 'roti'],
    served: [],
    speech: 'Dekhein catering wale ne kaisa intezam kiya hai...'
  }
];

interface CateringMiniGameProps {
  onComplete: (servedCount: number, totalCount: number) => void;
  onExit: () => void;
}

export const CateringMiniGame: React.FC<CateringMiniGameProps> = ({
  onComplete,
  onExit
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [timeLeft, setTimeLeft] = useState(40);
  const [guestQueue, setGuestQueue] = useState<GuestQueueItem[]>(GUEST_TEMPLATES);
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const [dishesStock, setDishesStock] = useState<Record<string, number>>(() => {
    const stockMap: Record<string, number> = {};
    CATERING_DISHES.forEach(d => { stockMap[d.id] = d.stock; });
    return stockMap;
  });
  const [servedTotal, setServedTotal] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);

  const currentGuest = guestQueue[currentGuestIndex];
  const totalGuests = GUEST_TEMPLATES.length;

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, servedTotal]);

  const startGame = () => {
    soundManager.playTap();
    soundManager.playDhol('bass');
    setGameState('playing');
  };

  const finishGame = () => {
    setGameState('result');
    if (servedTotal >= 6) {
      soundManager.playVictory();
    } else {
      soundManager.playWrong();
    }
  };

  // Serve a dish to current guest
  const handleServeDish = (dishId: string) => {
    if (!currentGuest || gameState !== 'playing') return;

    // Check stock
    const currentStock = dishesStock[dishId] || 0;
    if (currentStock <= 0) {
      soundManager.playWrong();
      setFeedback({ text: 'Out of Stock! Refill from kitchen!', isCorrect: false });
      setTimeout(() => setFeedback(null), 1200);
      return;
    }

    // Check if guest requested this dish and hasn't received it yet
    const remainingNeeded = currentGuest.requested.filter(
      d => !currentGuest.served.includes(d)
    );

    if (remainingNeeded.includes(dishId)) {
      // Correct dish!
      soundManager.playDishServed();
      // Decrement stock
      setDishesStock(prev => ({ ...prev, [dishId]: prev[dishId] - 1 }));

      const updatedServed = [...currentGuest.served, dishId];
      currentGuest.served = updatedServed;

      setFeedback({ text: 'Wah! Perfect choice!', isCorrect: true });
      setTimeout(() => setFeedback(null), 1000);

      // Check if current guest is completely served
      if (updatedServed.length === currentGuest.requested.length) {
        soundManager.playDhol('treble');
        const nextServedTotal = servedTotal + 1;
        setServedTotal(nextServedTotal);

        if (currentGuestIndex + 1 < totalGuests) {
          setTimeout(() => {
            setCurrentGuestIndex(prev => prev + 1);
          }, 400);
        } else {
          // Finished all guests!
          setTimeout(() => {
            finishGame();
          }, 600);
        }
      }
    } else {
      // Wrong dish!
      soundManager.playWrong();
      setFeedback({ text: 'Guest did not order this!', isCorrect: false });
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  // Quick Restock Dish from kitchen
  const handleRestock = (dishId: string) => {
    soundManager.playTap();
    soundManager.playCoin();
    setDishesStock(prev => ({
      ...prev,
      [dishId]: (prev[dishId] || 0) + 6
    }));
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-gradient-to-b from-amber-950 via-rose-950 to-amber-950 text-white select-none overflow-hidden font-['Baloo_2',sans-serif]">
      {/* Background festive ambient art */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80')`
        }}
      />

      {/* TOP HUD BAR */}
      <div className="relative z-10 bg-amber-900/90 border-b-2 border-amber-500/60 px-4 py-2 flex items-center justify-between shadow-md">
        <button
          onClick={() => {
            soundManager.playTap();
            onExit();
          }}
          className="flex items-center gap-1 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-400 text-amber-200 text-xs font-bold active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>

        {/* Served count */}
        <div className="flex items-center gap-1.5 bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-400">
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-amber-200">Served:</span>
          <span className="text-sm font-black text-white">{servedTotal}/{totalGuests}</span>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border ${
          timeLeft <= 10 ? 'bg-red-700 border-yellow-300 animate-pulse' : 'bg-amber-950/80 border-amber-400'
        }`}>
          <Clock className="w-4 h-4 text-amber-300" />
          <span className="text-sm font-mono font-black text-amber-100">00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
        </div>
      </div>

      {/* 1. INTRO START SCREEN */}
      {gameState === 'intro' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-xs bg-amber-900/95 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
            <div className="text-5xl mb-2 animate-bounce">🍲</div>
            <h2 className="text-2xl font-black text-amber-300 tracking-wider uppercase mb-1">
              SERVE THE GUESTS!
            </h2>
            <p className="text-amber-100 text-xs font-medium mb-4">
              Help clear the grand wedding buffet queue before hungry relatives get impatient!
            </p>

            <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-600 mb-5 text-left flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">👆</span>
                <span className="text-amber-200">Tap dishes to match each guest&apos;s plate.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⏱️</span>
                <span className="text-amber-200">Serve 8 guests before the 40s timer runs out.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">👨‍🍳</span>
                <span className="text-amber-200">Tap Restock if any chafing dish runs dry.</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl border-2 border-emerald-300 text-white text-lg font-black tracking-wider uppercase shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none transition-all"
            >
              Start Serving!
            </button>
          </div>
        </div>
      )}

      {/* 2. LIVE GAMEPLAY SCREEN */}
      {gameState === 'playing' && currentGuest && (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-3">
          {/* Guest Area (Top) */}
          <div className="bg-amber-900/90 border-2 border-amber-400/80 rounded-3xl p-3 shadow-xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-800 border-2 border-amber-300 flex items-center justify-center text-3xl shadow">
                  {currentGuest.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-200 leading-tight">{currentGuest.name}</h3>
                  <p className="text-[11px] text-amber-300 italic">&ldquo;{currentGuest.speech}&rdquo;</p>
                </div>
              </div>

              <div className="text-[10px] font-bold bg-amber-950 px-2 py-0.5 rounded-full text-amber-300 border border-amber-600">
                Guest {currentGuestIndex + 1} of {totalGuests}
              </div>
            </div>

            {/* Requested Order Dishes Bubble */}
            <div className="bg-amber-950/90 rounded-2xl p-2 border border-amber-500 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">Wants on Plate:</span>
              <div className="flex items-center gap-2">
                {currentGuest.requested.map((dishId, idx) => {
                  const dish = CATERING_DISHES.find(d => d.id === dishId);
                  const isServed = currentGuest.served.includes(dishId);

                  return (
                    <div 
                      key={idx} 
                      className={`relative px-2.5 py-1 rounded-xl flex items-center gap-1.5 border ${
                        isServed ? 'bg-emerald-900/90 border-emerald-400 text-emerald-200' : 'bg-amber-900 border-amber-400 text-amber-100'
                      }`}
                    >
                      <span className="text-base">{dish?.icon}</span>
                      <span className="text-xs font-bold">{dish?.name}</span>
                      {isServed ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transient Floating Feedback Banner */}
            {feedback && (
              <div className={`text-center py-1 rounded-xl text-xs font-black shadow flex items-center justify-center gap-1.5 ${
                feedback.isCorrect ? 'bg-emerald-600 text-white animate-bounce' : 'bg-red-600 text-white animate-shake'
              }`}>
                {feedback.isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                {feedback.text}
              </div>
            )}
          </div>

          {/* Buffet Counter Dishes (Bottom Table) */}
          <div className="bg-amber-950/95 border-2 border-amber-500 rounded-3xl p-3 shadow-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <span>🍽️</span> Buffet Counter (Tap dish to serve)
              </span>
              <span className="text-[10px] text-amber-400 font-semibold">Stock in Chafing Dishes</span>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-4 gap-2">
              {CATERING_DISHES.map(dish => {
                const stock = dishesStock[dish.id] || 0;
                const isOutOfStock = stock <= 0;

                return (
                  <button
                    key={dish.id}
                    onClick={() => handleServeDish(dish.id)}
                    className={`relative p-2 rounded-2xl border-2 flex flex-col items-center justify-between transition-all cursor-pointer ${
                      isOutOfStock 
                        ? 'bg-rose-950/60 border-rose-800 opacity-70' 
                        : 'bg-amber-900/90 hover:bg-amber-800 border-amber-400 active:scale-95 shadow-lg'
                    }`}
                  >
                    {/* Dish Icon */}
                    <span className="text-2xl filter drop-shadow">{dish.icon}</span>

                    {/* Dish Name */}
                    <span className="text-[11px] font-bold text-amber-100 leading-tight text-center mt-1">
                      {dish.name}
                    </span>

                    {/* Stock pill */}
                    <div className="mt-1 flex items-center gap-1">
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full border ${
                        stock <= 2 ? 'bg-red-600 border-red-300 text-white' : 'bg-amber-950 border-amber-600 text-amber-300'
                      }`}>
                        {stock} left
                      </span>
                    </div>

                    {/* Quick Restock button when low */}
                    {stock <= 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestock(dish.id);
                        }}
                        className="mt-1 w-full text-[9px] font-black bg-yellow-500 hover:bg-yellow-400 text-amber-950 py-0.5 rounded-lg shadow flex items-center justify-center gap-0.5"
                      >
                        <RefreshCw className="w-2.5 h-2.5" /> +6 Refill
                      </button>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. RESULT VERDICT SCREEN (Catering Champ, Saved Situation, Buffet Hungama) */}
      {gameState === 'result' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-xs bg-amber-900/95 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
            {/* Outcome Icon & Title */}
            {servedTotal >= 7 ? (
              <>
                <div className="text-5xl mb-2 animate-bounce">🏆</div>
                <h2 className="text-2xl font-black text-amber-300 tracking-wider uppercase mb-1">
                  CATERING CHAMP!
                </h2>
                <div className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400 mb-3">
                  Buffet Queue Cleared! (+25 Shaadi Mood)
                </div>
                <p className="text-amber-100 text-xs mb-4">
                  Maharaj Halwai is singing your praises! All the guests are happily licking their fingers.
                </p>
              </>
            ) : servedTotal >= 4 ? (
              <>
                <div className="text-5xl mb-2 animate-pulse">🍲</div>
                <h2 className="text-2xl font-black text-amber-300 tracking-wider uppercase mb-1">
                  SAVED THE SITUATION!
                </h2>
                <div className="bg-yellow-800 text-yellow-200 text-xs font-bold px-3 py-1 rounded-full border border-yellow-400 mb-3">
                  Partial Success (+10 Shaadi Mood)
                </div>
                <p className="text-amber-100 text-xs mb-4">
                  A few aunties grumbled about slow rotis, but everyone got a plate. Crisis averted!
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-2 animate-shake">😱</div>
                <h2 className="text-2xl font-black text-rose-300 tracking-wider uppercase mb-1">
                  BUFFET HUNGAMA!
                </h2>
                <div className="bg-rose-900 text-rose-200 text-xs font-bold px-3 py-1 rounded-full border border-rose-400 mb-3">
                  Queue Escalated (-15 Shaadi Mood)
                </div>
                <p className="text-amber-100 text-xs mb-4">
                  Fufa-ji created a scene because the paneer ran out! But don&apos;t worry, the wedding continues!
                </p>
              </>
            )}

            {/* Scorecard */}
            <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-600 mb-5 flex justify-between items-center text-xs">
              <span className="text-amber-300 font-bold">Guests Satisfied:</span>
              <span className="text-base font-black text-white">{servedTotal} / {totalGuests}</span>
            </div>

            <button
              onClick={() => {
                soundManager.playTap();
                onComplete(servedTotal, totalGuests);
              }}
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl border-2 border-amber-200 text-amber-950 text-base font-black tracking-wider uppercase shadow-[0_4px_0_#78350f] active:translate-y-1 active:shadow-none transition-all"
            >
              Return to Garden
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
