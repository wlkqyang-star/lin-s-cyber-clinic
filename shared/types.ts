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
  experience: number;
  experienceToNextLevel: number;
  coins: number;
  reputation: number;
  day: number;
  patients: Patient[];
  completedOrders: number;
  failedOrders: number;
  unlockedDiseases: string[]; // IDs of unlocked diseases
  upgrades: ClinicUpgrades;
  achievements: Achievement[];
  statistics: GameStatistics;
}

export interface ClinicUpgrades {
  diagnosisSpeed: number; // 1-5 levels
  pharmacySlots: number; // 2-6 slots
  patienceBoost: number; // 0-50% boost
  coinMultiplier: number; // 1.0-2.0x
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  target: number;
}

export interface GameStatistics {
  totalPatientsServed: number;
  perfectTreatments: number;
  maxCombo: number;
  currentCombo: number;
  fastestTreatment: number;
  totalPlayTime: number;
  highestLevel: number;
}

export interface MiniGameResult {
  success: boolean;
  score: number; // 0-100
  timeBonus: number;
}
