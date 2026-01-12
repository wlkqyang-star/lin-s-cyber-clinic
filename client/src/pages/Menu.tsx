import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

export default function Menu() {
  const { startGame } = useGame();
  const [, setLocation] = useLocation();

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(/bg-main.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-8 p-8"
      >
        {/* Title */}
        <div className="text-center space-y-4">
          <motion.h1
            className="font-calligraphy text-7xl md:text-9xl neon-glow"
            style={{ color: '#ff461f' }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            林氏医馆
          </motion.h1>
          <motion.p
            className="font-pixel text-2xl md:text-3xl"
            style={{ color: '#b026ff' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            CYBER_TCM_CLINIC_v4.0
          </motion.p>
          <motion.p
            className="font-pixel text-lg md:text-xl text-[#00ff00]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            赛博中医模拟器
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            size="lg"
            onClick={startGame}
            className="font-pixel text-2xl px-12 py-8 bg-[#b026ff] hover:bg-[#9020dd] text-white border-2 border-[#00ff00] shadow-lg shadow-[#b026ff]/50 transition-all hover:scale-105"
          >
            开始游戏
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => setLocation('/instructions')}
            className="font-pixel text-xl px-12 py-6 bg-black/50 hover:bg-black/70 text-[#00ff00] border-2 border-[#00ff00] transition-all hover:scale-105"
          >
            游戏说明
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="font-pixel text-sm text-[#5d4037] mt-12 opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2 }}
        >
          © 2077 LIN'S CLINIC. ALL RIGHTS RESERVED.
        </motion.p>
      </motion.div>
    </div>
  );
}
