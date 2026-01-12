import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Clock, TrendingUp, Award } from 'lucide-react';

export default function AchievementsPanel({ onClose }: { onClose: () => void }) {
  const { gameState } = useGame();

  const achievements = gameState.achievements;
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

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
        className="paper-texture rounded-lg p-8 border-4 border-[#5d4037] max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-calligraphy text-4xl text-[#5d4037] mb-2">
              成就与统计
            </h2>
            <p className="font-pixel text-sm text-[#5d4037]/70">
              已解锁 {unlockedCount}/{totalCount} 个成就
            </p>
          </div>
          <Trophy className="w-16 h-16 text-[#ff461f]" />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#5d4037]/10 rounded-lg p-4 border-2 border-[#b026ff]/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-[#b026ff]" />
              <span className="font-pixel text-xs text-[#5d4037]/70">总患者数</span>
            </div>
            <p className="font-pixel text-2xl text-[#5d4037]">
              {gameState.statistics.totalPatientsServed}
            </p>
          </div>

          <div className="bg-[#5d4037]/10 rounded-lg p-4 border-2 border-[#ff461f]/20">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-[#ff461f]" />
              <span className="font-pixel text-xs text-[#5d4037]/70">完美治疗</span>
            </div>
            <p className="font-pixel text-2xl text-[#5d4037]">
              {gameState.statistics.perfectTreatments}
            </p>
          </div>

          <div className="bg-[#5d4037]/10 rounded-lg p-4 border-2 border-[#00ff00]/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#00ff00]" />
              <span className="font-pixel text-xs text-[#5d4037]/70">最高连击</span>
            </div>
            <p className="font-pixel text-2xl text-[#5d4037]">
              {gameState.statistics.maxCombo}
            </p>
          </div>

          <div className="bg-[#5d4037]/10 rounded-lg p-4 border-2 border-[#b026ff]/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-[#b026ff]" />
              <span className="font-pixel text-xs text-[#5d4037]/70">最快治疗</span>
            </div>
            <p className="font-pixel text-2xl text-[#5d4037]">
              {gameState.statistics.fastestTreatment === Infinity 
                ? '--' 
                : `${Math.floor(gameState.statistics.fastestTreatment / 1000)}s`}
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Award className="w-16 h-16 mx-auto mb-4 text-[#5d4037]/30" />
              <p className="font-pixel text-lg text-[#5d4037]/50">
                暂无成就数据
              </p>
            </div>
          ) : (
            achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-lg p-4 border-2 ${
                  achievement.unlocked
                    ? 'bg-[#00ff00]/10 border-[#00ff00]/40'
                    : 'bg-[#5d4037]/5 border-[#5d4037]/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-3xl ${achievement.unlocked ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-calligraphy text-xl mb-1 ${
                      achievement.unlocked ? 'text-[#5d4037]' : 'text-[#5d4037]/40'
                    }`}>
                      {achievement.name}
                    </h3>
                    <p className={`font-pixel text-xs mb-2 ${
                      achievement.unlocked ? 'text-[#5d4037]/70' : 'text-[#5d4037]/30'
                    }`}>
                      {achievement.description}
                    </p>
                    
                    {/* Progress bar */}
                    {!achievement.unlocked && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-pixel text-xs text-[#5d4037]/50">
                            {achievement.progress}/{achievement.target}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#5d4037]/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#b026ff]"
                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="font-pixel text-xs text-[#00ff00] mt-2">
                        ✓ 已解锁
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
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
