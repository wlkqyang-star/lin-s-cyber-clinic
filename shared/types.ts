// Game Types

export type GameStation = 'order' | 'diagnosis' | 'pharmacy' | 'acupuncture' | 'serving';

export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover';

export interface Diagnosis {
  id: string;
  name: string;
  symptoms: string[];
  prescription: {
    herbs: string[];
    acupuncturePoints?: string[];
  };
}

export interface Patient {
  id: string;
  name: string;
  avatar: string;
  diagnosis: Diagnosis;
  patience: number; // 0-100
  orderTime: number;
  status: 'waiting' | 'diagnosing' | 'pharmacy' | 'acupuncture' | 'serving' | 'completed' | 'failed';
  progress: {
    diagnosisComplete: boolean;
    pharmacyComplete: boolean;
    acupunctureComplete: boolean;
  };
}

export interface GameState {
  phase: GamePhase;
  currentStation: GameStation;
  level: number;
  coins: number;
  reputation: number;
  day: number;
  patients: Patient[];
  completedOrders: number;
  failedOrders: number;
}

export interface MiniGameResult {
  success: boolean;
  score: number; // 0-100
  timeBonus: number;
}
