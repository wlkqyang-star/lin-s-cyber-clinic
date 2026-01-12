import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { GameState, Patient, GameStation, MiniGameResult } from '@/../../shared/types';
import { DIAGNOSES, PATIENT_NAMES, GAME_CONFIG } from '@/../../shared/gameData';

interface GameContextType {
  gameState: GameState;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  switchStation: (station: GameStation) => void;
  acceptPatient: (patientId: string) => void;
  completeDiagnosis: (patientId: string, result: MiniGameResult) => void;
  completePharmacy: (patientId: string, result: MiniGameResult) => void;
  completeAcupuncture: (patientId: string, result: MiniGameResult) => void;
  servePatient: (patientId: string) => void;
  upgradeClinic: (upgradeType: string, cost: number) => void;
  addExperience: (amount: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'menu',
    currentStation: 'order',
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    coins: GAME_CONFIG.INITIAL_COINS,
    reputation: GAME_CONFIG.INITIAL_REPUTATION,
    day: 1,
    patients: [],
    completedOrders: 0,
    failedOrders: 0,
    unlockedDiseases: DIAGNOSES.slice(0, 5).map(d => d.id),
    upgrades: {
      diagnosisSpeed: 1,
      pharmacySlots: 2,
      patienceBoost: 0,
      coinMultiplier: 1.0
    },
    achievements: [],
    statistics: {
      totalPatientsServed: 0,
      perfectTreatments: 0,
      maxCombo: 0,
      currentCombo: 0,
      fastestTreatment: Infinity,
      totalPlayTime: 0,
      highestLevel: 1
    }
  });

  const patientIdCounter = useRef(0);
  const patienceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random patient
  const generatePatient = useCallback((): Patient => {
    const diagnosis = DIAGNOSES[Math.floor(Math.random() * DIAGNOSES.length)];
    const name = PATIENT_NAMES[Math.floor(Math.random() * PATIENT_NAMES.length)];
    const avatarIndex = Math.floor(Math.random() * 2) + 1;
    
    return {
      id: `P${++patientIdCounter.current}`,
      name,
      avatar: `/patient-${avatarIndex}.png`,
      diagnosis,
      patience: 100,
      orderTime: Date.now(),
      status: 'waiting',
      progress: {
        diagnosisComplete: false,
        pharmacyComplete: false,
        acupunctureComplete: false
      }
    };
  }, []);

  // Patience decay system
  useEffect(() => {
    if (gameState.phase !== 'playing') return;

    patienceIntervalRef.current = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        patients: prev.patients.map(patient => {
          if (patient.status === 'completed' || patient.status === 'failed') return patient;
          
          const newPatience = Math.max(0, patient.patience - GAME_CONFIG.PATIENCE_DECAY_RATE);
          
          // Patient leaves if patience reaches 0
          if (newPatience === 0) {
            return { ...patient, status: 'failed' as const, patience: 0 };
          }
          
          return { ...patient, patience: newPatience };
        })
      }));
    }, 1000);

    return () => {
      if (patienceIntervalRef.current) {
        clearInterval(patienceIntervalRef.current);
      }
    };
  }, [gameState.phase]);

  // Auto-spawn patients
  useEffect(() => {
    if (gameState.phase !== 'playing') return;

    const spawnInterval = GAME_CONFIG.PATIENT_SPAWN_INTERVAL[gameState.level - 1] || 10000;
    const maxPatients = GAME_CONFIG.MAX_PATIENTS_PER_LEVEL[gameState.level - 1] || 3;

    const spawnTimer = setInterval(() => {
      setGameState(prev => {
        const activePatients = prev.patients.filter(p => p.status !== 'completed' && p.status !== 'failed');
        if (activePatients.length >= maxPatients) return prev;

        return {
          ...prev,
          patients: [...prev.patients, generatePatient()]
        };
      });
    }, spawnInterval);

    return () => clearInterval(spawnTimer);
  }, [gameState.phase, gameState.level, generatePatient]);

  const startGame = useCallback(() => {
    setGameState({
      phase: 'playing',
      currentStation: 'order',
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      coins: GAME_CONFIG.INITIAL_COINS,
      reputation: GAME_CONFIG.INITIAL_REPUTATION,
      day: 1,
      patients: [generatePatient()],
      completedOrders: 0,
      failedOrders: 0,
      unlockedDiseases: DIAGNOSES.slice(0, 5).map(d => d.id),
      upgrades: {
        diagnosisSpeed: 1,
        pharmacySlots: 2,
        patienceBoost: 0,
        coinMultiplier: 1.0
      },
      achievements: [],
      statistics: {
        totalPatientsServed: 0,
        perfectTreatments: 0,
        maxCombo: 0,
        currentCombo: 0,
        fastestTreatment: Infinity,
        totalPlayTime: 0,
        highestLevel: 1
      }
    });
  }, [generatePatient]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'paused' }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'playing' }));
  }, []);

  const switchStation = useCallback((station: GameStation) => {
    setGameState(prev => ({ ...prev, currentStation: station }));
  }, []);

  const acceptPatient = useCallback((patientId: string) => {
    setGameState(prev => ({
      ...prev,
      patients: prev.patients.map(p =>
        p.id === patientId ? { ...p, status: 'diagnosing' as const } : p
      )
    }));
  }, []);

  const completeDiagnosis = useCallback((patientId: string, result: MiniGameResult) => {
    setGameState(prev => ({
      ...prev,
      patients: prev.patients.map(p =>
        p.id === patientId
          ? { ...p, status: 'pharmacy' as const, progress: { ...p.progress, diagnosisComplete: true } }
          : p
      )
    }));
  }, []);

  const completePharmacy = useCallback((patientId: string, result: MiniGameResult) => {
    setGameState(prev => ({
      ...prev,
      patients: prev.patients.map(p => {
        if (p.id !== patientId) return p;
        
        const needsAcupuncture = p.diagnosis.prescription.acupuncturePoints && 
                                 p.diagnosis.prescription.acupuncturePoints.length > 0;
        
        return {
          ...p,
          status: needsAcupuncture ? ('acupuncture' as const) : ('serving' as const),
          progress: { ...p.progress, pharmacyComplete: true }
        };
      })
    }));
  }, []);

  const completeAcupuncture = useCallback((patientId: string, result: MiniGameResult) => {
    setGameState(prev => ({
      ...prev,
      patients: prev.patients.map(p =>
        p.id === patientId
          ? { ...p, status: 'serving' as const, progress: { ...p.progress, acupunctureComplete: true } }
          : p
      )
    }));
  }, []);

  const servePatient = useCallback((patientId: string) => {
    setGameState(prev => {
      const patient = prev.patients.find(p => p.id === patientId);
      if (!patient) return prev;

      const score = patient.patience;
      const coins = score > 80 ? GAME_CONFIG.PERFECT_SCORE_BONUS : 
                    score > 50 ? GAME_CONFIG.GOOD_SCORE_BONUS : 
                    GAME_CONFIG.FAIL_PENALTY;
      
      // Calculate experience based on score
      const expGain = Math.floor(score / 2) + 10;
      const newExp = prev.experience + expGain;
      let newLevel = prev.level;
      let newExpRequired = prev.experienceToNextLevel;
      let remainingExp = newExp;
      let newUnlocked = prev.unlockedDiseases;

      // Check for level up
      if (newExp >= prev.experienceToNextLevel) {
        newLevel = prev.level + 1;
        remainingExp = newExp - prev.experienceToNextLevel;
        newExpRequired = Math.floor(prev.experienceToNextLevel * 1.5);
        
        // Unlock new diseases every 2 levels
        if (newLevel % 2 === 0 && prev.unlockedDiseases.length < DIAGNOSES.length) {
          newUnlocked = [...prev.unlockedDiseases, DIAGNOSES[prev.unlockedDiseases.length].id];
        }
      }

      return {
        ...prev,
        level: newLevel,
        experience: remainingExp,
        experienceToNextLevel: newExpRequired,
        coins: prev.coins + coins,
        reputation: prev.reputation + Math.floor(score),
        completedOrders: prev.completedOrders + 1,
        unlockedDiseases: newUnlocked,
        patients: prev.patients.map(p =>
          p.id === patientId ? { ...p, status: 'completed' as const } : p
        ),
        statistics: {
          ...prev.statistics,
          totalPatientsServed: prev.statistics.totalPatientsServed + 1,
          perfectTreatments: score > 95 ? prev.statistics.perfectTreatments + 1 : prev.statistics.perfectTreatments,
          highestLevel: Math.max(prev.statistics.highestLevel, newLevel)
        }
      };
    });
  }, []);

  const upgradeClinic = useCallback((upgradeType: string, cost: number) => {
    setGameState(prev => {
      if (prev.coins < cost) return prev;

      const newUpgrades = { ...prev.upgrades };
      
      switch (upgradeType) {
        case 'diagnosisSpeed':
          if (newUpgrades.diagnosisSpeed < 5) newUpgrades.diagnosisSpeed++;
          break;
        case 'pharmacySlots':
          if (newUpgrades.pharmacySlots < 6) newUpgrades.pharmacySlots++;
          break;
        case 'patienceBoost':
          if (newUpgrades.patienceBoost < 50) newUpgrades.patienceBoost += 10;
          break;
        case 'coinMultiplier':
          if (newUpgrades.coinMultiplier < 2.0) newUpgrades.coinMultiplier += 0.2;
          break;
      }

      return {
        ...prev,
        coins: prev.coins - cost,
        upgrades: newUpgrades
      };
    });
  }, []);

  const addExperience = useCallback((amount: number) => {
    setGameState(prev => {
      const newExp = prev.experience + amount;
      
      if (newExp >= prev.experienceToNextLevel) {
        // Level up!
        const newLevel = prev.level + 1;
        const remainingExp = newExp - prev.experienceToNextLevel;
        const newExpRequired = Math.floor(prev.experienceToNextLevel * 1.5);
        
        // Unlock new diseases every 2 levels
        const newUnlocked = newLevel % 2 === 0 && prev.unlockedDiseases.length < DIAGNOSES.length
          ? [...prev.unlockedDiseases, DIAGNOSES[prev.unlockedDiseases.length].id]
          : prev.unlockedDiseases;

        return {
          ...prev,
          level: newLevel,
          experience: remainingExp,
          experienceToNextLevel: newExpRequired,
          unlockedDiseases: newUnlocked,
          statistics: {
            ...prev.statistics,
            highestLevel: Math.max(prev.statistics.highestLevel, newLevel)
          }
        };
      }

      return {
        ...prev,
        experience: newExp
      };
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        startGame,
        pauseGame,
        resumeGame,
        switchStation,
        acceptPatient,
        completeDiagnosis,
        completePharmacy,
        completeAcupuncture,
        servePatient,
        upgradeClinic,
        addExperience
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
