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
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'menu',
    currentStation: 'order',
    level: 1,
    coins: GAME_CONFIG.INITIAL_COINS,
    reputation: GAME_CONFIG.INITIAL_REPUTATION,
    day: 1,
    patients: [],
    completedOrders: 0,
    failedOrders: 0
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
      coins: GAME_CONFIG.INITIAL_COINS,
      reputation: GAME_CONFIG.INITIAL_REPUTATION,
      day: 1,
      patients: [generatePatient()],
      completedOrders: 0,
      failedOrders: 0
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

      return {
        ...prev,
        coins: prev.coins + coins,
        reputation: prev.reputation + Math.floor(score),
        completedOrders: prev.completedOrders + 1,
        patients: prev.patients.map(p =>
          p.id === patientId ? { ...p, status: 'completed' as const } : p
        )
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
        servePatient
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
