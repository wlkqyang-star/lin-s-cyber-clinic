import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ACUPOINTS } from '@/../../shared/gameData';
import { Target } from 'lucide-react';

export default function AcupunctureStation() {
  const { gameState, completeAcupuncture } = useGame();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [clickedPoints, setClickedPoints] = useState<string[]>([]);
  
  const acupuncturePatients = gameState.patients.filter(p => p.status === 'acupuncture');
  const currentPatient = acupuncturePatients.find(p => p.id === selectedPatient);

  const startAcupuncture = (patientId: string) => {
    setSelectedPatient(patientId);
    setClickedPoints([]);
  };

  const handlePointClick = (pointName: string) => {
    if (!clickedPoints.includes(pointName)) {
      setClickedPoints([...clickedPoints, pointName]);
    }
  };

  const submitAcupuncture = () => {
    if (!currentPatient) return;

    const requiredPoints = currentPatient.diagnosis.prescription.acupuncturePoints || [];
    const correctPoints = clickedPoints.filter(p => requiredPoints.includes(p));
    const score = requiredPoints.length > 0 ? (correctPoints.length / requiredPoints.length) * 100 : 100;

    completeAcupuncture(currentPatient.id, {
      success: score >= 50,
      score,
      timeBonus: 0
    });

    setSelectedPatient(null);
    setClickedPoints([]);
  };

  if (selectedPatient && currentPatient) {
    const requiredPoints = currentPatient.diagnosis.prescription.acupuncturePoints || [];
    
    return (
      <div 
        className="w-full h-full flex flex-col p-8 bg-cover bg-center relative"
        style={{ backgroundImage: 'url(/acupuncture-bg.png)' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 flex flex-col h-full">
          <h2 className="font-calligraphy text-5xl text-[#00ff00] mb-4 neon-glow text-center">
            针灸治疗
          </h2>
          
          <div className="flex-1 flex gap-8">
            {/* Left: Instructions */}
            <div className="w-1/4 bg-black/80 rounded-lg p-6 border-2 border-[#00ff00]/40">
              <h3 className="font-pixel text-xl text-[#00ff00] mb-4">
                [ 治疗方案 ]
              </h3>
              
              <div className="mb-6">
                <p className="font-pixel text-sm text-[#e6dcc3] mb-2">患者：{currentPatient.name}</p>
                <p className="font-pixel text-sm text-[#e6dcc3] mb-4">病症：{currentPatient.diagnosis.name}</p>
              </div>

              <div className="space-y-2 mb-6">
                <p className="font-pixel text-sm text-[#00ff00] mb-2">所需穴位：</p>
                {requiredPoints.map((point, i) => {
                  const isClicked = clickedPoints.includes(point);
                  return (
                    <p 
                      key={i} 
                      className={`font-pixel text-sm ${isClicked ? 'text-[#00ff00]' : 'text-[#e6dcc3]/60'}`}
                    >
                      {isClicked ? '✓' : '○'} {point}
                    </p>
                  );
                })}
              </div>

              <div className="p-3 bg-[#00ff00]/10 rounded mb-6">
                <p className="font-pixel text-xs text-[#e6dcc3]">
                  进度: {clickedPoints.length}/{requiredPoints.length}
                </p>
              </div>

              <Button
                onClick={submitAcupuncture}
                disabled={clickedPoints.length === 0}
                className="w-full font-pixel bg-[#00ff00] hover:bg-[#00dd00] text-black"
              >
                完成针灸
              </Button>
            </div>

            {/* Right: Body diagram with acupoints */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="relative w-full max-w-2xl aspect-[9/16]">
                {/* Holographic body outline */}
                <div className="absolute inset-0 border-2 border-[#00ff00]/30 rounded-lg bg-gradient-to-b from-[#00ff00]/5 to-transparent" />
                
                {/* Meridian lines */}
                <svg className="absolute inset-0 w-full h-full opacity-30">
                  <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#00ff00" strokeWidth="1" />
                  <line x1="30%" y1="20%" x2="30%" y2="80%" stroke="#00ff00" strokeWidth="1" />
                  <line x1="70%" y1="20%" x2="70%" y2="80%" stroke="#00ff00" strokeWidth="1" />
                </svg>

                {/* Acupoints */}
                {ACUPOINTS.map((point) => {
                  const isRequired = requiredPoints.includes(point.name);
                  const isClicked = clickedPoints.includes(point.name);
                  
                  if (!isRequired) return null;

                  return (
                    <motion.button
                      key={point.id}
                      className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                        isClicked
                          ? 'bg-[#00ff00]/50 border-[#00ff00] scale-110'
                          : 'bg-[#ff461f]/30 border-[#ff461f] animate-pulse'
                      }`}
                      style={{
                        left: `${point.position.x}%`,
                        top: `${point.position.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => handlePointClick(point.name)}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isClicked}
                    >
                      {isClicked ? (
                        <span className="text-2xl">✓</span>
                      ) : (
                        <Target className="w-6 h-6 text-[#ff461f]" />
                      )}
                    </motion.button>
                  );
                })}

                {/* Point labels */}
                {ACUPOINTS.filter(p => requiredPoints.includes(p.name)).map((point) => (
                  <motion.div
                    key={`label-${point.id}`}
                    className="absolute font-pixel text-xs text-[#00ff00] pointer-events-none"
                    style={{
                      left: `${point.position.x}%`,
                      top: `${point.position.y - 8}%`,
                      transform: 'translate(-50%, -100%)'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: clickedPoints.includes(point.name) ? 1 : 0.6 }}
                  >
                    {point.name}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-8 bg-cover bg-center relative"
      style={{ backgroundImage: 'url(/acupuncture-bg.png)' }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="font-calligraphy text-5xl text-[#00ff00] mb-8 neon-glow">
          针灸室
        </h2>
        
        <p className="font-pixel text-lg text-[#e6dcc3] mb-12">
          选择患者开始针灸治疗
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {acupuncturePatients.length === 0 ? (
            <div className="col-span-full text-center">
              <p className="font-pixel text-xl text-[#00ff00]/60">
                暂无患者需要针灸...
              </p>
            </div>
          ) : (
            acupuncturePatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/80 rounded-lg p-6 border-2 border-[#00ff00]/40"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-16 h-16 object-cover rounded-full border-2 border-[#00ff00]"
                  />
                  <div>
                    <h3 className="font-calligraphy text-2xl text-white">
                      {patient.name}
                    </h3>
                    <p className="font-pixel text-sm text-[#00ff00]">
                      {patient.diagnosis.name}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => startAcupuncture(patient.id)}
                  className="w-full font-pixel bg-[#00ff00] hover:bg-[#00dd00] text-black"
                >
                  开始针灸
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
