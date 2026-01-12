import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { User, Clock } from 'lucide-react';
import { soundSystem } from '@/lib/sounds';

export default function OrderStation() {
  const { gameState, acceptPatient } = useGame();
  
  const waitingPatients = gameState.patients.filter(p => p.status === 'waiting');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
      <h2 className="font-calligraphy text-5xl text-[#ff461f] mb-8 neon-glow">
        接诊台
      </h2>
      
      <p className="font-pixel text-lg text-[#e6dcc3] mb-12 text-center">
        点击患者查看症状并接诊
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {waitingPatients.length === 0 ? (
          <div className="col-span-full text-center">
            <p className="font-pixel text-xl text-[#b026ff]/60">
              暂无患者等待...
            </p>
          </div>
        ) : (
          waitingPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="paper-texture rounded-lg p-6 border-2 border-[#5d4037] shadow-2xl relative overflow-hidden"
            >
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-[#ff461f] opacity-50" />
              <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-[#ff461f] opacity-50" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-[#ff461f] opacity-50" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-[#ff461f] opacity-50" />

              {/* Patient info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#b026ff]/20 border-2 border-[#b026ff] flex items-center justify-center">
                  <User className="w-8 h-8 text-[#b026ff]" />
                </div>
                <div>
                  <h3 className="font-calligraphy text-2xl text-[#5d4037]">
                    {patient.name}
                  </h3>
                  <p className="font-pixel text-sm text-[#b026ff]">
                    ID: {patient.id}
                  </p>
                </div>
              </div>

              {/* Symptoms */}
              <div className="mb-4">
                <h4 className="font-pixel text-sm text-[#ff461f] mb-2">
                  [ 症状描述 ]
                </h4>
                <div className="space-y-1">
                  {patient.diagnosis.symptoms.map((symptom, i) => (
                    <p key={i} className="font-pixel text-sm text-[#5d4037]">
                      • {symptom}
                    </p>
                  ))}
                </div>
              </div>

              {/* Patience indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-pixel text-xs text-[#5d4037]">耐心值</span>
                  <span className="font-pixel text-xs text-[#5d4037]">
                    {Math.floor(patient.patience)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-[#5d4037]/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: patient.patience > 50 ? '#00ff00' : patient.patience > 20 ? '#ff461f' : '#ff0000'
                    }}
                    animate={{ width: `${patient.patience}%` }}
                  />
                </div>
              </div>

              {/* Wait time */}
              <div className="flex items-center gap-2 mb-4 text-[#5d4037]/60">
                <Clock className="w-4 h-4" />
                <span className="font-pixel text-xs">
                  等待 {Math.floor((Date.now() - patient.orderTime) / 1000)}秒
                </span>
              </div>

              {/* Accept button */}
              <Button
                onClick={() => {
                  acceptPatient(patient.id);
                  soundSystem.success();
                }}
                className="w-full font-pixel bg-[#b026ff] hover:bg-[#9020dd] text-white border-2 border-[#00ff00]"
              >
                接诊患者
              </Button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
