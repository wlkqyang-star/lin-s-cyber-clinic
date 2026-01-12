import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Eye, Timer } from 'lucide-react';

export default function DiagnosisStation() {
  const { gameState, completeDiagnosis } = useGame();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [clickedSymptoms, setClickedSymptoms] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  
  const diagnosingPatients = gameState.patients.filter(p => p.status === 'diagnosing');
  const currentPatient = diagnosingPatients.find(p => p.id === selectedPatient);

  // Timer countdown
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishDiagnosis();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  const startDiagnosis = (patientId: string) => {
    setSelectedPatient(patientId);
    setGameActive(true);
    setClickedSymptoms([]);
    setTimeLeft(15);
  };

  const handleSymptomClick = (index: number) => {
    if (!clickedSymptoms.includes(index)) {
      setClickedSymptoms([...clickedSymptoms, index]);
      
      // Auto-complete if all symptoms found
      if (currentPatient && clickedSymptoms.length + 1 === currentPatient.diagnosis.symptoms.length) {
        setTimeout(() => finishDiagnosis(), 500);
      }
    }
  };

  const finishDiagnosis = () => {
    if (!currentPatient) return;

    const totalSymptoms = currentPatient.diagnosis.symptoms.length;
    const foundSymptoms = clickedSymptoms.length;
    const score = (foundSymptoms / totalSymptoms) * 100;

    completeDiagnosis(currentPatient.id, {
      success: score >= 50,
      score,
      timeBonus: timeLeft * 2
    });

    setGameActive(false);
    setSelectedPatient(null);
    setClickedSymptoms([]);
  };

  if (gameActive && currentPatient) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#1a1a2e] to-[#0f3460] relative">
        {/* Timer */}
        <motion.div
          className="absolute top-8 right-8 flex items-center gap-2 font-pixel text-3xl"
          animate={{ scale: timeLeft <= 5 ? [1, 1.2, 1] : 1 }}
          transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 0.5 }}
        >
          <Timer className="w-8 h-8" style={{ color: timeLeft <= 5 ? '#ff461f' : '#00ff00' }} />
          <span style={{ color: timeLeft <= 5 ? '#ff461f' : '#00ff00' }}>
            {timeLeft}s
          </span>
        </motion.div>

        <h2 className="font-calligraphy text-4xl text-[#b026ff] mb-4 neon-glow">
          望诊 · 观察异常
        </h2>
        
        <p className="font-pixel text-lg text-[#e6dcc3] mb-8">
          点击发现所有症状 ({clickedSymptoms.length}/{currentPatient.diagnosis.symptoms.length})
        </p>

        {/* Patient avatar with clickable symptoms */}
        <div className="relative mb-8">
          <motion.img
            src={currentPatient.avatar}
            alt={currentPatient.name}
            className="w-80 h-80 object-contain"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          />

          {/* Symptom hotspots */}
          {currentPatient.diagnosis.symptoms.map((symptom, index) => {
            const positions = [
              { top: '15%', left: '45%' }, // Head
              { top: '40%', left: '30%' }, // Left arm
              { top: '40%', left: '65%' }, // Right arm
              { top: '60%', left: '50%' }, // Torso
              { top: '85%', left: '40%' }  // Legs
            ];
            const pos = positions[index % positions.length];

            return (
              <motion.button
                key={index}
                className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  clickedSymptoms.includes(index)
                    ? 'bg-[#00ff00]/30 border-[#00ff00]'
                    : 'bg-[#ff461f]/20 border-[#ff461f] animate-pulse'
                }`}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => handleSymptomClick(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                disabled={clickedSymptoms.includes(index)}
              >
                {clickedSymptoms.includes(index) ? (
                  <span className="text-2xl">✓</span>
                ) : (
                  <Eye className="w-6 h-6 text-[#ff461f]" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Symptom list */}
        <div className="space-y-2">
          {currentPatient.diagnosis.symptoms.map((symptom, index) => (
            <motion.p
              key={index}
              className={`font-pixel text-sm ${
                clickedSymptoms.includes(index) ? 'text-[#00ff00]' : 'text-[#b026ff]/40'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: clickedSymptoms.includes(index) ? 1 : 0.4, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {clickedSymptoms.includes(index) ? '✓' : '?'} {symptom}
            </motion.p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#1a1a2e] to-[#0f3460]">
      <h2 className="font-calligraphy text-5xl text-[#b026ff] mb-8 neon-glow">
        诊断台
      </h2>
      
      <p className="font-pixel text-lg text-[#e6dcc3] mb-12">
        选择患者开始诊断
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {diagnosingPatients.length === 0 ? (
          <div className="col-span-full text-center">
            <p className="font-pixel text-xl text-[#b026ff]/60">
              暂无患者需要诊断...
            </p>
            <p className="font-pixel text-sm text-[#e6dcc3]/40 mt-4">
              请前往接诊台接待患者
            </p>
          </div>
        ) : (
          diagnosingPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/60 border-2 border-[#b026ff]/40 rounded-lg p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={patient.avatar}
                  alt={patient.name}
                  className="w-20 h-20 object-cover rounded-full border-2 border-[#b026ff]"
                />
                <div>
                  <h3 className="font-calligraphy text-2xl text-white">
                    {patient.name}
                  </h3>
                  <p className="font-pixel text-sm text-[#b026ff]">
                    {patient.diagnosis.name}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => startDiagnosis(patient.id)}
                className="w-full font-pixel bg-[#b026ff] hover:bg-[#9020dd] text-white"
              >
                开始望诊
              </Button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
