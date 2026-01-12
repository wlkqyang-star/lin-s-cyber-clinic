import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, Trophy, Coins, Heart } from 'lucide-react';

export default function GameOverlay() {
  const { gameState, pauseGame, resumeGame } = useGame();

  return (
    <AnimatePresence>
      {gameState.phase === 'paused' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="paper-texture rounded-lg p-12 border-4 border-[#5d4037] max-w-md w-full mx-4"
          >
            <div className="text-center">
              <Pause className="w-16 h-16 mx-auto mb-6 text-[#ff461f]" />
              
              <h2 className="font-calligraphy text-4xl text-[#5d4037] mb-8">
                游戏暂停
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between font-pixel text-lg text-[#5d4037]">
                  <span>当前等级</span>
                  <span>LV.{gameState.level}</span>
                </div>
                <div className="flex items-center justify-between font-pixel text-lg text-[#5d4037]">
                  <span>金币</span>
                  <span className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-[#00ff00]" />
                    {gameState.coins}
                  </span>
                </div>
                <div className="flex items-center justify-between font-pixel text-lg text-[#5d4037]">
                  <span>声望</span>
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#ff461f]" />
                    {gameState.reputation}
                  </span>
                </div>
                <div className="flex items-center justify-between font-pixel text-lg text-[#5d4037]">
                  <span>完成订单</span>
                  <span>{gameState.completedOrders}</span>
                </div>
              </div>

              <Button
                onClick={resumeGame}
                className="w-full font-pixel text-xl bg-[#b026ff] hover:bg-[#9020dd] text-white border-2 border-[#00ff00]"
              >
                <Play className="w-5 h-5 mr-2" />
                继续游戏
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {gameState.phase === 'gameover' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="paper-texture rounded-lg p-12 border-4 border-[#5d4037] max-w-lg w-full mx-4"
          >
            <div className="text-center">
              <Trophy className="w-20 h-20 mx-auto mb-6 text-[#ff461f]" />
              
              <h2 className="font-calligraphy text-5xl text-[#ff461f] mb-4 neon-glow">
                游戏结束
              </h2>

              <p className="font-pixel text-lg text-[#5d4037] mb-8">
                第 {gameState.day} 天营业结束
              </p>

              <div className="space-y-4 mb-8 bg-[#5d4037]/10 rounded-lg p-6">
                <div className="flex items-center justify-between font-pixel text-xl text-[#5d4037]">
                  <span>最终等级</span>
                  <span className="text-[#b026ff]">LV.{gameState.level}</span>
                </div>
                <div className="flex items-center justify-between font-pixel text-xl text-[#5d4037]">
                  <span>总金币</span>
                  <span className="text-[#00ff00]">{gameState.coins}</span>
                </div>
                <div className="flex items-center justify-between font-pixel text-xl text-[#5d4037]">
                  <span>总声望</span>
                  <span className="text-[#ff461f]">{gameState.reputation}</span>
                </div>
                <div className="flex items-center justify-between font-pixel text-xl text-[#5d4037]">
                  <span>完成订单</span>
                  <span className="text-[#00ff00]">{gameState.completedOrders}</span>
                </div>
                <div className="flex items-center justify-between font-pixel text-xl text-[#5d4037]">
                  <span>失败订单</span>
                  <span className="text-[#ff461f]">{gameState.failedOrders}</span>
                </div>
              </div>

              <Button
                onClick={() => window.location.reload()}
                className="w-full font-pixel text-xl bg-[#b026ff] hover:bg-[#9020dd] text-white border-2 border-[#00ff00]"
              >
                返回主菜单
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
