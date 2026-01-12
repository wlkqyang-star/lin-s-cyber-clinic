import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { HERBS } from '@/../../shared/gameData';

export default function PharmacyStation() {
  const { gameState, completePharmacy } = useGame();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedHerbs, setSelectedHerbs] = useState<string[]>([]);
  
  const pharmacyPatients = gameState.patients.filter(p => p.status === 'pharmacy');
  const currentPatient = pharmacyPatients.find(p => p.id === selectedPatient);

  const startPharmacy = (patientId: string) => {
    setSelectedPatient(patientId);
    setSelectedHerbs([]);
  };

  const toggleHerb = (herb: string) => {
    if (selectedHerbs.includes(herb)) {
      setSelectedHerbs(selectedHerbs.filter(h => h !== herb));
    } else {
      setSelectedHerbs([...selectedHerbs, herb]);
    }
  };

  const submitPrescription = () => {
    if (!currentPatient) return;

    const requiredHerbs = currentPatient.diagnosis.prescription.herbs;
    const correctHerbs = selectedHerbs.filter(h => 
      requiredHerbs.some(req => req.includes(h) || h.includes(req.split('').slice(0, 2).join('')))
    );
    
    const score = (correctHerbs.length / requiredHerbs.length) * 100;

    completePharmacy(currentPatient.id, {
      success: score >= 50,
      score,
      timeBonus: 0
    });

    setSelectedPatient(null);
    setSelectedHerbs([]);
  };

  if (selectedPatient && currentPatient) {
    return (
      <div 
        className="w-full h-full flex flex-col p-8 bg-cover bg-center relative"
        style={{ backgroundImage: 'url(/pharmacy-bg.png)' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 flex flex-col h-full">
          <h2 className="font-calligraphy text-5xl text-[#ff461f] mb-4 neon-glow text-center">
            药房配药
          </h2>
          
          <div className="flex-1 flex gap-8">
            {/* Left: Prescription */}
            <div className="w-1/3 paper-texture rounded-lg p-6 border-2 border-[#5d4037]">
              <h3 className="font-calligraphy text-3xl text-[#ff461f] mb-4">
                药方
              </h3>
              
              <div className="mb-4">
                <p className="font-pixel text-sm text-[#5d4037] mb-2">患者：{currentPatient.name}</p>
                <p className="font-pixel text-sm text-[#5d4037] mb-4">病症：{currentPatient.diagnosis.name}</p>
              </div>

              <div className="space-y-2">
                <p className="font-pixel text-sm text-[#ff461f] mb-2">[ 所需药材 ]</p>
                {currentPatient.diagnosis.prescription.herbs.map((herb, i) => (
                  <p key={i} className="font-pixel text-sm text-[#5d4037]">
                    • {herb}
                  </p>
                ))}
              </div>

              <div className="mt-6 p-4 bg-[#5d4037]/10 rounded">
                <p className="font-pixel text-xs text-[#5d4037] mb-2">
                  已选药材 ({selectedHerbs.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedHerbs.map((herb, i) => (
                    <span
                      key={i}
                      className="font-pixel text-xs px-2 py-1 bg-[#00ff00]/20 text-[#5d4037] rounded border border-[#00ff00]"
                    >
                      {herb}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                onClick={submitPrescription}
                disabled={selectedHerbs.length === 0}
                className="w-full mt-6 font-pixel bg-[#ff461f] hover:bg-[#dd3010] text-white"
              >
                完成配药
              </Button>
            </div>

            {/* Right: Herb selection */}
            <div className="flex-1 bg-black/60 rounded-lg p-6 border-2 border-[#ff461f]/40 overflow-y-auto">
              <h3 className="font-pixel text-2xl text-[#00ff00] mb-6">
                [ 药材库 ]
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                {HERBS.map((herb, index) => (
                  <motion.button
                    key={index}
                    onClick={() => toggleHerb(herb)}
                    className={`
                      p-4 rounded-lg border-2 transition-all font-pixel text-sm
                      ${selectedHerbs.includes(herb)
                        ? 'bg-[#00ff00]/30 border-[#00ff00] text-white scale-95'
                        : 'bg-black/40 border-[#ff461f]/40 text-[#e6dcc3] hover:border-[#ff461f] hover:scale-105'
                      }
                    `}
                    whileHover={{ scale: selectedHerbs.includes(herb) ? 0.95 : 1.05 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {herb}
                  </motion.button>
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
      style={{ backgroundImage: 'url(/pharmacy-bg.png)' }}
    >
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="font-calligraphy text-5xl text-[#ff461f] mb-8 neon-glow">
          药房
        </h2>
        
        <p className="font-pixel text-lg text-[#e6dcc3] mb-12">
          选择患者开始配药
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {pharmacyPatients.length === 0 ? (
            <div className="col-span-full text-center">
              <p className="font-pixel text-xl text-[#ff461f]/60">
                暂无患者需要配药...
              </p>
            </div>
          ) : (
            pharmacyPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="paper-texture rounded-lg p-6 border-2 border-[#5d4037]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-16 h-16 object-cover rounded-full border-2 border-[#ff461f]"
                  />
                  <div>
                    <h3 className="font-calligraphy text-2xl text-[#5d4037]">
                      {patient.name}
                    </h3>
                    <p className="font-pixel text-sm text-[#ff461f]">
                      {patient.diagnosis.name}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => startPharmacy(patient.id)}
                  className="w-full font-pixel bg-[#ff461f] hover:bg-[#dd3010] text-white"
                >
                  开始配药
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
