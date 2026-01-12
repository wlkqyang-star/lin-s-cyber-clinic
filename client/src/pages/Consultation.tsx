import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useGame } from '@/contexts/GameContext';
import Seal from '@/components/Seal';
import DiagnosisForm from '@/components/DiagnosisForm';
import LoadingScreen from '@/components/LoadingScreen';
import DiagnosisResult from '@/components/DiagnosisResult';
import AudioPlayer from '@/components/AudioPlayer';
import { CONSULTATION_DIAGNOSES } from '@/../../shared/consultationData';

interface Diagnosis {
  id: string;
  name: string;
  symptoms: string;
  prescription: string;
}

type ConsultationStep = 'input' | 'loading' | 'result';

export default function Consultation() {
  const [, setLocation] = useLocation();
  const { startGame } = useGame();
  const [step, setStep] = useState<ConsultationStep>('input');
  const [nickname, setNickname] = useState('');
  const [currentDiagnosis, setCurrentDiagnosis] = useState<Diagnosis | null>(null);

  // Random ID Generator
  const generateId = () => {
    return '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
  };

  const handleStart = (name: string) => {
    setNickname(name);
    setStep('loading');
    
    // Pick random diagnosis
    const randomIndex = Math.floor(Math.random() * CONSULTATION_DIAGNOSES.length);
    const selected = CONSULTATION_DIAGNOSES[randomIndex];
    
    setCurrentDiagnosis({
      ...selected,
      id: generateId()
    });
  };

  const handleLoadingComplete = () => {
    setStep('result');
  };

  const handleReset = () => {
    setStep('input');
    setNickname('');
    setCurrentDiagnosis(null);
  };

  const handleStartGame = () => {
    // Start the game with the consultation data
    startGame();
    setLocation('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-gray-900 relative">
      
      {/* Main Container - The "Paper" */}
      <div 
        className="relative w-full max-w-4xl min-h-[600px] md:min-h-[700px] paper-texture burnt-edges rounded-sm flex flex-col transition-all duration-700"
      >
        <>
          {/* Header */}
          <header className="pt-12 pb-8 flex flex-col items-center relative z-10">
            <Seal className="mb-4" />
            <h1 className="font-calligraphy text-5xl md:text-6xl text-[#ff461f] tracking-widest drop-shadow-sm">
              林氏医馆
            </h1>
            <p className="font-pixel text-[#5d4037] mt-2 opacity-70 tracking-widest text-sm md:text-base">
              CYBER_TCM_CLINIC_v4.0
            </p>
          </header>

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-[#5d4037] opacity-30"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-[#5d4037] opacity-30"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-[#5d4037] opacity-30"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-[#5d4037] opacity-30"></div>
        </>

        {/* Main Content Area */}
        <main className="flex-grow flex items-center justify-center p-4 relative z-10">
          {step === 'input' && <DiagnosisForm onSubmit={handleStart} />}
          {step === 'loading' && <LoadingScreen onComplete={handleLoadingComplete} />}
          {step === 'result' && currentDiagnosis && (
            <DiagnosisResult 
              data={currentDiagnosis} 
              nickname={nickname} 
              onReset={handleReset}
              onGoVideo={handleStartGame}
            />
          )}
        </main>

        {/* Footer text */}
        <footer className="pb-4 text-center">
          <p className="font-pixel text-[10px] text-[#5d4037] opacity-40">
            © 2077 LIN'S CLINIC. ALL RIGHTS RESERVED. DO NOT REBOOT.
          </p>
        </footer>
      </div>

      <AudioPlayer />
    </div>
  );
}
