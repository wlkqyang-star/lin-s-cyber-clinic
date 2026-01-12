import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { soundSystem } from '@/lib/sounds';
import { HERBS } from '@/../../shared/gameData';

interface CabinetDrawer {
  id: number;
  herb: string;
  isOpen: boolean;
}

export default function PharmacyStation() {
  const { gameState, completePharmacy } = useGame();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedHerbs, setSelectedHerbs] = useState<string[]>([]);
  const [cabinets, setCabinets] = useState<CabinetDrawer[]>([]);
  
  const pharmacyPatients = gameState.patients.filter(p => p.status === 'pharmacy');
  const currentPatient = pharmacyPatients.find(p => p.id === selectedPatient);

  const startPharmacy = (patientId: string) => {
    const patient = pharmacyPatients.find(p => p.id === patientId);
    if (!patient) return;

    setSelectedPatient(patientId);
    setSelectedHerbs([]);
    
    // Initialize cabinets with herbs
    const cabinetData: CabinetDrawer[] = HERBS.map((herb, index) => ({
      id: index,
      herb,
      isOpen: false
    }));
    
    setCabinets(cabinetData);
    soundSystem.click();
  };

  const toggleDrawer = (cabinetId: number) => {
    setCabinets(prev => prev.map(c => 
      c.id === cabinetId ? { ...c, isOpen: !c.isOpen } : c
    ));
    soundSystem.click();
  };

  const selectHerb = (herb: string) => {
    if (!currentPatient) return;
    
    const maxSlots = gameState.upgrades.pharmacySlots;
    
    if (selectedHerbs.includes(herb)) {
      setSelectedHerbs(prev => prev.filter(h => h !== herb));
      soundSystem.click();
    } else if (selectedHerbs.length < maxSlots) {
      setSelectedHerbs(prev => [...prev, herb]);
      soundSystem.success();
    } else {
      soundSystem.error();
    }
  };

  const submitPrescription = () => {
    if (!currentPatient) return;

    const requiredHerbs = currentPatient.diagnosis.prescription.herbs;
    const correctHerbs = selectedHerbs.filter(h => requiredHerbs.includes(h));
    const score = (correctHerbs.length / requiredHerbs.length) * 100;

    completePharmacy(currentPatient.id, {
      success: score >= 50,
      score,
      timeBonus: 0
    });

    soundSystem.success();
    setSelectedPatient(null);
    setSelectedHerbs([]);
    setCabinets([]);
  };

  if (selectedPatient && currentPatient) {
    return (
      <div 
        className="w-full h-full flex flex-col p-8 bg-cover bg-center relative"
        style={{ backgroundImage: 'url(/pharmacy-bg.png)' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-calligraphy text-4xl text-[#ff461f] mb-2 neon-glow">
                药房配药
              </h2>
              <p className="font-pixel text-lg text-[#e6dcc3]">
                为 {currentPatient.name} 配制药方
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedPatient(null);
                setSelectedHerbs([]);
                setCabinets([]);
              }}
              className="font-pixel border-[#ff461f] text-[#ff461f]"
            >
              <X className="w-4 h-4 mr-2" />
              取消
            </Button>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
            {/* Medicine Cabinets */}
            <div className="lg:col-span-2 overflow-y-auto pr-2">
              <h3 className="font-pixel text-xl text-[#00ff00] mb-4">
                药柜 - 点击打开抽屉选择药材
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {cabinets.map((cabinet) => (
                  <motion.div
                    key={cabinet.id}
                    className="relative"
                  >
                    {/* Cabinet */}
                    <motion.button
                      onClick={() => toggleDrawer(cabinet.id)}
                      className={`w-full aspect-square rounded-lg border-2 ${
                        cabinet.isOpen
                          ? 'border-[#00ff00] bg-[#00ff00]/20'
                          : 'border-[#5d4037] bg-[#5d4037]/30'
                      } hover:scale-105 transition-transform relative overflow-hidden`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Drawer handle */}
                      <div className="absolute inset-x-0 bottom-2 flex justify-center">
                        <div className={`w-8 h-2 rounded ${
                          cabinet.isOpen ? 'bg-[#00ff00]' : 'bg-[#5d4037]'
                        }`} />
                      </div>
                      
                      {/* Cabinet label */}
                      <div className="absolute inset-0 flex items-center justify-center p-1">
                        <span className="font-pixel text-xs text-center text-[#e6dcc3]">
                          {cabinet.herb}
                        </span>
                      </div>
                    </motion.button>

                    {/* Drawer (opens when clicked) */}
                    <AnimatePresence>
                      {cabinet.isOpen && (
                        <motion.div
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          className="absolute top-full left-0 right-0 mt-2 z-10"
                        >
                          <motion.button
                            onClick={() => selectHerb(cabinet.herb)}
                            className={`w-full p-3 rounded-lg border-2 ${
                              selectedHerbs.includes(cabinet.herb)
                                ? 'border-[#00ff00] bg-[#00ff00]/30'
                                : 'border-[#ff461f] bg-[#ff461f]/20'
                            } hover:scale-105 transition-transform`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="font-pixel text-xs text-white">
                              {selectedHerbs.includes(cabinet.herb) ? '✓ 已选' : '选择'}
                            </span>
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Prescription Panel */}
            <div className="paper-texture rounded-lg p-6 border-2 border-[#5d4037] overflow-y-auto">
              <h3 className="font-calligraphy text-2xl text-[#ff461f] mb-4">
                药方
              </h3>
              
              <div className="mb-6">
                <p className="font-pixel text-sm text-[#5d4037]/70 mb-2">
                  已选药材 ({selectedHerbs.length}/{gameState.upgrades.pharmacySlots})
                </p>
                <div className="space-y-2 min-h-[120px]">
                  {selectedHerbs.map((herb, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between bg-[#ff461f]/10 rounded p-2 border border-[#ff461f]/30"
                    >
                      <span className="font-pixel text-sm text-[#5d4037]">{herb}</span>
                      <button
                        onClick={() => selectHerb(herb)}
                        className="text-[#ff461f] hover:text-[#ff461f]/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="font-pixel text-sm text-[#5d4037]/70 mb-2">
                  所需药材提示
                </p>
                <div className="space-y-1">
                  {currentPatient.diagnosis.prescription.herbs.map((herb, index) => (
                    <div
                      key={index}
                      className={`font-pixel text-sm ${
                        selectedHerbs.includes(herb) ? 'text-[#00ff00]' : 'text-[#5d4037]/50'
                      }`}
                    >
                      {selectedHerbs.includes(herb) ? '✓' : '○'} {herb}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={submitPrescription}
                disabled={selectedHerbs.length === 0}
                className="w-full font-pixel bg-[#ff461f] hover:bg-[#dd3010] text-white disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                完成配药
              </Button>
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
              <p className="font-pixel text-sm text-[#e6dcc3]/40 mt-4">
                请前往诊断台完成诊断
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
