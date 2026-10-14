export type WeddingPhase = 'morning' | 'afternoon' | 'evening' | 'night';

export type TaskStatus = 'locked' | 'available' | 'active' | 'in_progress' | 'completed' | 'failed';

export type UrgencyLevel = 'normal' | 'urgent';

export interface WeddingTask {
  id: string;
  chapter: number;
  title: string;
  hindiTitle: string;
  locationId: string;
  locationName: string;
  characterId: string;
  characterName: string;
  description: string;
  instruction: string;
  status: TaskStatus;
  urgency: UrgencyLevel;
  durationSeconds?: number;
  timeRemaining?: number;
  workerAssigned?: string | null;
  requiredItem?: string;
  requiredItemCount?: number;
  moodReward: number;
  moodPenalty: number;
  currencyReward?: number;
  actionType: 'worker_assign' | 'mini_game' | 'deliver_item' | 'crisis_solve';
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  avatar: string;
  assignedTaskId: string | null;
  taskProgress: number; // 0 to 100
  timeTotal: number;
  timeLeft: number;
  status: 'idle' | 'working' | 'resting';
}

export interface InventoryItem {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  category: 'decor' | 'food' | 'pooja' | 'equipment';
  quantity: number;
  price: number;
  description: string;
}

export interface GuestOrder {
  id: string;
  guestType: 'auntie' | 'uncle' | 'young_guest' | 'kid';
  guestName: string;
  requestedDishes: string[];
  servedDishes: string[];
  patience: number; // in seconds
  maxPatience: number;
  dialogue: string;
}

export interface CateringDish {
  id: string;
  name: string;
  hindiName: string;
  stock: number;
  maxStock: number;
  icon: string;
  color: string;
}

export interface GardenLocation {
  id: string;
  name: string;
  hindiName: string;
  x: number; // percentage in garden map
  y: number; // percentage in garden map
  description: string;
  icon: string;
  zone: 'ceremony' | 'food' | 'guest' | 'logistics' | 'outside';
}

export interface WeddingState {
  currentChapter: number;
  phase: WeddingPhase;
  shaadiMood: number; // 0 - 100
  budget: number; // in ₹
  completedTaskIds: string[];
  failedTaskIds: string[];
  activeTasks: WeddingTask[];
  workers: Worker[];
  inventory: Record<string, number>;
  cateringDishes: Record<string, number>;
  unlockedRegions: string[];
  isRainActive: boolean;
  rainTimeRemaining: number;
  isWeddingFinished: boolean;
  finalRank?: 'superstar' | 'kaam_chalao' | 'satyanash';
}

export interface WeddingCharacter {
  id: string;
  name: string;
  role: string;
  avatar: string;
  x: number; // percentage
  y: number; // percentage
  activity: 'eating' | 'chatting' | 'walking' | 'dancing' | 'cooking' | 'greeting';
  dialogue?: string;
  area: 'catering' | 'guest_rooms' | 'mandap' | 'stage' | 'entrance' | 'pathway';
}

export type GameScreen = 
  | 'home' 
  | 'garden' 
  | 'catering_minigame' 
  | 'map' 
  | 'settings' 
  | 'info' 
  | 'results';

