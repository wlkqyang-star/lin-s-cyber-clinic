import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Heart, Calendar, Pause, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameOverlay from '@/components/GameOverlay';
import UpgradePanel from '@/components/UpgradePanel';
import AchievementsPanel from '@/components/AchievementsPanel';
import VideoReward from '@/components/VideoReward';
import OrderStation from '@/components/stations/OrderStation';
import DiagnosisStation from '@/components/stations/DiagnosisStation';
import PharmacyStation from '@/components/stations/PharmacyStation';
import AcupunctureStation from '@/components/stations/AcupunctureStation';
import ServingStation from '@/components/stations/ServingStation';
import type { GameStation } from '@/../../shared/types';

const STATIONS: { id: GameStation; label: string; color: string }[] = [
  { id: 'order', label: '接诊台', color: '#00ff00' },
  { id: 'diagnosis', label: '诊断台', color: '#b026ff' },
  { id: 'pharmacy', label: '药房', color: '#ff461f' },
  { id: 'acupuncture', label: '针灸室', color: '#00ff00' },
  { id: 'serving', label: '送药台', color: '#b026ff' }
];

export default function Game() {
  const { gameState, switchStation, pauseGame, showVideoReward, setShowVideoReward } = useGame();
  const [showUpgradePanel, setShowUpgradePanel] = useState(false);
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false);

  const expPercentage = (gameState.experience / gameState.experienceToNextLevel) * 100;

  const renderStation = () => {
    switch (gameState.currentStation) {
      case 'order':
        return <OrderStation />;
      case 'diagnosis':
        return <DiagnosisStation />;
      case 'pharmacy':
        return <PharmacyStation />;
      case 'acupuncture':
        return <AcupunctureStation />;
      case 'serving':
        return <ServingStation />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#1a1a2e]">
      <GameOverlay />
      {showUpgradePanel && <UpgradePanel onClose={() => setShowUpgradePanel(false)} />}
      {showAchievementsPanel && <AchievementsPanel onClose={() => setShowAchievementsPanel(false)} />}
      {/* Header */}
      <header className="bg-black/80 border-b-2 border-[#b026ff]/30 p-4">
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <h1 className="font-calligraphy text-3xl text-[#ff461f] neon-glow">
              林氏医馆
            </h1>
            <span className="font-pixel text-sm text-[#b026ff]">
              LV.{gameState.level}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-pixel text-lg">
              <Coins className="w-5 h-5 text-[#00ff00]" />
              <span className="text-[#00ff00]">{gameState.coins}</span>
            </div>
            <div className="flex items-center gap-2 font-pixel text-lg">
              <Heart className="w-5 h-5 text-[#ff461f]" />
              <span className="text-[#ff461f]">{gameState.reputation}</span>
            </div>
            <div className="flex items-center gap-2 font-pixel text-lg">
              <Calendar className="w-5 h-5 text-[#b026ff]" />
              <span className="text-[#b026ff]">第{gameState.day}天</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAchievementsPanel(true)}
              className="font-pixel text-sm border-[#ff461f]/40 text-[#ff461f] hover:bg-[#ff461f]/20"
            >
              <Award className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpgradePanel(true)}
              className="font-pixel text-sm border-[#00ff00]/40 text-[#00ff00] hover:bg-[#00ff00]/20"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              升级
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={pauseGame}
              className="font-pixel text-sm border-[#b026ff]/40 text-[#b026ff] hover:bg-[#b026ff]/20"
            >
              <Pause className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Experience Bar */}
        <div className="mt-3 max-w-md">
          <div className="flex items-center justify-between mb-1">
            <span className="font-pixel text-xs text-[#b026ff]">LV.{gameState.level}</span>
            <span className="font-pixel text-xs text-[#b026ff]">
              {gameState.experience}/{gameState.experienceToNextLevel} EXP
            </span>
          </div>
          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-[#b026ff]/30">
            <motion.div
              className="h-full bg-gradient-to-r from-[#b026ff] to-[#ff461f]"
              initial={{ width: 0 }}
              animate={{ width: `${expPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </header>

      {/* Patient Queue Bar */}
      <div className="bg-black/60 border-b border-[#b026ff]/20 p-3 overflow-x-auto">
        <div className="container flex gap-3">
          {gameState.patients
            .filter(p => p.status !== 'completed' && p.status !== 'failed')
            .map(patient => (
              <motion.div
                key={patient.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex-shrink-0 bg-black/80 border border-[#b026ff]/40 rounded-lg p-3 min-w-[200px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#b026ff]/20 border border-[#b026ff] flex items-center justify-center">
                    <span className="font-pixel text-xs text-[#b026ff]">
                      {patient.name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-pixel text-sm text-white">{patient.name}</p>
                    <p className="font-pixel text-xs text-[#b026ff]">
                      {patient.diagnosis.name}
                    </p>
                  </div>
                </div>
                
                {/* Patience bar */}
                <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{
                      backgroundColor: patient.patience > 50 ? '#00ff00' : patient.patience > 20 ? '#ff461f' : '#ff0000',
                      width: `${patient.patience}%`
                    }}
                    animate={{ width: `${patient.patience}%` }}
                  />
                </div>
                
                {/* Status */}
                <p className="font-pixel text-xs text-[#00ff00] mt-1">
                  {patient.status === 'waiting' && '等待接诊'}
                  {patient.status === 'diagnosing' && '诊断中'}
                  {patient.status === 'pharmacy' && '配药中'}
                  {patient.status === 'acupuncture' && '针灸中'}
                  {patient.status === 'serving' && '待送药'}
                </p>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState.currentStation}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {renderStation()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="bg-black/90 border-t-2 border-[#b026ff]/30 p-4">
        <div className="container flex justify-center gap-4">
          {STATIONS.map(station => (
            <button
              key={station.id}
              onClick={() => switchStation(station.id)}
              className={`
                font-pixel px-6 py-3 rounded-lg border-2 transition-all
                ${gameState.currentStation === station.id
                  ? 'bg-[#b026ff]/30 border-[#b026ff] text-white scale-105'
                  : 'bg-black/50 border-[#b026ff]/20 text-[#b026ff]/60 hover:border-[#b026ff]/60 hover:text-[#b026ff]'
                }
              `}
              style={{
                boxShadow: gameState.currentStation === station.id
                  ? `0 0 20px ${station.color}40`
                  : 'none'
              }}
            >
              {station.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Video Reward Popup */}
      <VideoReward
        isOpen={showVideoReward}
        onClose={() => setShowVideoReward(false)}
        videoPath="/杏林深处.mp4"
        title="成就解锁：初窥门径"
        description="恭喜你成功治疗了第一位患者！特别奖励视频已解锁"
      />
    </div>
  );
}
