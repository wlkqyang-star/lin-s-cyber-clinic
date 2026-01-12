import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, Pill, Heart, Coins, Lock, Check } from 'lucide-react';
import { soundSystem } from '@/lib/sounds';

interface UpgradeOption {
  id: keyof typeof upgradeCosts;
  name: string;
  description: string;
  icon: React.ReactNode;
  currentLevel: number;
  maxLevel: number;
  cost: number;
  effect: string;
}

const upgradeCosts = {
  diagnosisSpeed: [0, 500, 1000, 2000, 4000],
  pharmacySlots: [0, 300, 600, 1200, 2400, 4800],
  patienceBoost: [0, 400, 800, 1600, 3200, 6400],
  coinMultiplier: [0, 1000, 2000, 4000, 8000]
};

export default function UpgradePanel({ onClose }: { onClose: () => void }) {
  const { gameState, upgradeClinic } = useGame();

  const upgrades: UpgradeOption[] = [
    {
      id: 'diagnosisSpeed',
      name: '诊断加速',
      description: '减少诊断所需时间',
      icon: <Zap className="w-8 h-8" />,
      currentLevel: gameState.upgrades.diagnosisSpeed,
      maxLevel: 5,
      cost: upgradeCosts.diagnosisSpeed[gameState.upgrades.diagnosisSpeed] || 0,
      effect: `+${gameState.upgrades.diagnosisSpeed * 20}% 速度`
    },
    {
      id: 'pharmacySlots',
      name: '药柜扩容',
      description: '增加可同时配药的数量',
      icon: <Pill className="w-8 h-8" />,
      currentLevel: gameState.upgrades.pharmacySlots,
      maxLevel: 6,
      cost: upgradeCosts.pharmacySlots[gameState.upgrades.pharmacySlots - 2] || 0,
      effect: `${gameState.upgrades.pharmacySlots} 个药槽`
    },
    {
      id: 'patienceBoost',
      name: '耐心提升',
      description: '患者耐心值下降更慢',
      icon: <Heart className="w-8 h-8" />,
      currentLevel: Math.floor(gameState.upgrades.patienceBoost / 10),
      maxLevel: 5,
      cost: upgradeCosts.patienceBoost[Math.floor(gameState.upgrades.patienceBoost / 10)] || 0,
      effect: `+${gameState.upgrades.patienceBoost}% 耐心`
    },
    {
      id: 'coinMultiplier',
      name: '金币加成',
      description: '增加治疗获得的金币',
      icon: <Coins className="w-8 h-8" />,
      currentLevel: Math.floor((gameState.upgrades.coinMultiplier - 1) * 5),
      maxLevel: 5,
      cost: upgradeCosts.coinMultiplier[Math.floor((gameState.upgrades.coinMultiplier - 1) * 5)] || 0,
      effect: `×${gameState.upgrades.coinMultiplier.toFixed(1)} 金币`
    }
  ];

  const handleUpgrade = (upgradeId: keyof typeof upgradeCosts) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    if (gameState.coins >= upgrade.cost && upgrade.currentLevel < upgrade.maxLevel) {
      upgradeClinic(upgradeId, upgrade.cost);
      soundSystem.success();
    } else {
      soundSystem.error();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="paper-texture rounded-lg p-8 border-4 border-[#5d4037] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-calligraphy text-4xl text-[#5d4037]">
            诊所升级
          </h2>
          <div className="flex items-center gap-2 font-pixel text-xl text-[#00ff00]">
            <Coins className="w-6 h-6" />
            <span>{gameState.coins}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upgrades.map((upgrade, index) => {
            const isMaxLevel = upgrade.currentLevel >= upgrade.maxLevel;
            const canAfford = gameState.coins >= upgrade.cost;

            return (
              <motion.div
                key={upgrade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-[#5d4037]/10 rounded-lg p-6 border-2 ${
                  isMaxLevel ? 'border-[#00ff00]' : 'border-[#b026ff]/40'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-[#b026ff]">
                    {upgrade.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-calligraphy text-2xl text-[#5d4037] mb-1">
                      {upgrade.name}
                    </h3>
                    <p className="font-pixel text-sm text-[#5d4037]/70 mb-2">
                      {upgrade.description}
                    </p>
                    <p className="font-pixel text-lg text-[#b026ff]">
                      {upgrade.effect}
                    </p>
                  </div>
                </div>

                {/* Level indicator */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(upgrade.maxLevel)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${
                        i < upgrade.currentLevel ? 'bg-[#00ff00]' : 'bg-[#5d4037]/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Upgrade button */}
                {isMaxLevel ? (
                  <div className="flex items-center justify-center gap-2 font-pixel text-[#00ff00] py-2">
                    <Check className="w-5 h-5" />
                    <span>已满级</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(upgrade.id)}
                    disabled={!canAfford}
                    className={`w-full font-pixel ${
                      canAfford
                        ? 'bg-[#b026ff] hover:bg-[#9020dd] text-white'
                        : 'bg-[#5d4037]/20 text-[#5d4037]/50 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Coins className="w-4 h-4 mr-2" />
                        升级 ({upgrade.cost})
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        金币不足 ({upgrade.cost})
                      </>
                    )}
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>

        <Button
          onClick={onClose}
          className="w-full mt-8 font-pixel text-lg bg-[#ff461f] hover:bg-[#dd3010] text-white"
        >
          关闭
        </Button>
      </motion.div>
    </motion.div>
  );
}
