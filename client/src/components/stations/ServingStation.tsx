import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Star } from 'lucide-react';

export default function ServingStation() {
  const { gameState, servePatient } = useGame();
  
  const servingPatients = gameState.patients.filter(p => p.status === 'serving');

  const getScoreColor = (patience: number) => {
    if (patience > 80) return '#00ff00';
    if (patience > 50) return '#ff461f';
    return '#ff0000';
  };

  const getScoreText = (patience: number) => {
    if (patience > 80) return '完美';
    if (patience > 50) return '良好';
    return '及格';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
      <h2 className="font-calligraphy text-5xl text-[#b026ff] mb-8 neon-glow">
        送药台
      </h2>
      
      <p className="font-pixel text-lg text-[#e6dcc3] mb-12">
        完成治疗，送药给患者
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {servingPatients.length === 0 ? (
          <div className="col-span-full text-center">
            <p className="font-pixel text-xl text-[#b026ff]/60">
              暂无患者等待送药...
            </p>
          </div>
        ) : (
          servingPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="paper-texture rounded-lg p-6 border-2 border-[#5d4037] shadow-2xl relative overflow-hidden"
            >
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-[#b026ff] opacity-50" />
              <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-[#b026ff] opacity-50" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-[#b026ff] opacity-50" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-[#b026ff] opacity-50" />

              {/* Patient info */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={patient.avatar}
                  alt={patient.name}
                  className="w-20 h-20 object-cover rounded-full border-2 border-[#b026ff]"
                />
                <div>
                  <h3 className="font-calligraphy text-2xl text-[#5d4037]">
                    {patient.name}
                  </h3>
                  <p className="font-pixel text-sm text-[#b026ff]">
                    {patient.diagnosis.name}
                  </p>
                </div>
              </div>

              {/* Treatment summary */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00ff00]" />
                  <span className="font-pixel text-xs text-[#5d4037]">
                    诊断完成
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00ff00]" />
                  <span className="font-pixel text-xs text-[#5d4037]">
                    配药完成
                  </span>
                </div>
                {patient.progress.acupunctureComplete && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00ff00]" />
                    <span className="font-pixel text-xs text-[#5d4037]">
                      针灸完成
                    </span>
                  </div>
                )}
              </div>

              {/* Score preview */}
              <div className="mb-4 p-3 bg-[#5d4037]/10 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-pixel text-sm text-[#5d4037]">满意度</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i < Math.floor(patient.patience / 20) ? getScoreColor(patient.patience) : 'none'}
                        stroke={getScoreColor(patient.patience)}
                      />
                    ))}
                  </div>
                </div>
                <p 
                  className="font-pixel text-lg text-center font-bold"
                  style={{ color: getScoreColor(patient.patience) }}
                >
                  {getScoreText(patient.patience)}
                </p>
              </div>

              {/* Serve button */}
              <Button
                onClick={() => servePatient(patient.id)}
                className="w-full font-pixel bg-[#b026ff] hover:bg-[#9020dd] text-white border-2 border-[#00ff00]"
              >
                送药完成
              </Button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
