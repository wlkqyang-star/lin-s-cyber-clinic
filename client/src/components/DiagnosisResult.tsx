import React, { useEffect, useState } from 'react';
import { ConsultationDiagnosis as Diagnosis } from '@/../../shared/consultationData';
import { RotateCcw } from 'lucide-react';

interface Props {
  data: Diagnosis;
  nickname: string;
  onReset: () => void;
  onGoVideo: () => void;
}

const DiagnosisResult: React.FC<Props> = ({ data, nickname, onReset, onGoVideo }) => {
  const [displayedSymptoms, setDisplayedSymptoms] = useState('');
  const [displayedPrescription, setDisplayedPrescription] = useState('');
  const [showButton, setShowButton] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    let sIndex = 0;
    let pIndex = 0;
    const sText = data.symptoms;
    const pText = data.prescription;
    const speed = 30; // ms per char

    const typeSymptoms = setInterval(() => {
      if (sIndex < sText.length) {
        setDisplayedSymptoms(sText.slice(0, sIndex + 1));
        sIndex++;
      } else {
        clearInterval(typeSymptoms);
        // Start Prescription typing after Symptoms done
        const typePrescription = setInterval(() => {
          if (pIndex < pText.length) {
            setDisplayedPrescription(pText.slice(0, pIndex + 1));
            pIndex++;
          } else {
            clearInterval(typePrescription);
            setShowButton(true);
          }
        }, speed);
      }
    }, speed);

    return () => {
      clearInterval(typeSymptoms);
    };
  }, [data]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center animate-in fade-in duration-700">
      
      {/* Paper Card Header */}
      <div className="w-full border-b-2 border-dashed border-[#5d4037]/30 pb-4 mb-6 flex justify-between items-end">
        <div>
           <p className="font-pixel text-[#5d4037]/60 text-sm">PATIENT: {nickname}</p>
           <p className="font-pixel text-[#b026ff] text-sm">ID: {data.id}</p>
        </div>
        <div className="text-right">
           <p className="font-pixel text-[#5d4037]/60 text-xs">DATE: 2077-XX-XX</p>
        </div>
      </div>

      {/* Diagnosis Name */}
      <h2 className="text-5xl md:text-6xl font-bold font-calligraphy text-[#b026ff] mb-6 text-center tracking-wide drop-shadow-[2px_2px_0px_#00ff00]">
        {data.name}
      </h2>

      {/* Content Area */}
      <div className="w-full space-y-8 text-left px-4 md:px-8">
        
        {/* Symptoms */}
        <div className="relative">
          <h3 className="font-pixel text-[#5d4037] bg-[#d7c9a8] inline-block px-2 text-lg mb-2">
            [ 症候表现 ]
          </h3>
          {/* Reduced size to text-lg md:text-xl for typewriter feel */}
          <p className="font-lead-type text-lg md:text-xl text-[#2c1810] min-h-[3rem]">
            {displayedSymptoms}
          </p>
        </div>

        {/* Prescription */}
        <div className="relative">
          <h3 className="font-pixel text-[#ff461f] bg-[#d7c9a8] inline-block px-2 text-lg mb-2">
            [ 林氏药方 ]
          </h3>
           {/* Reduced size to text-lg md:text-xl for typewriter feel */}
          <p className="font-lead-type text-lg md:text-xl text-[#c0392b] min-h-[3rem]">
            {displayedPrescription}
          </p>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className={`mt-12 flex flex-col items-center gap-6 transition-opacity duration-500 ${showButton ? 'opacity-100' : 'opacity-0'}`}>
        
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-[#5d4037] hover:text-[#ff461f] font-pixel text-lg border-b border-transparent hover:border-[#ff461f] transition-all"
        >
          <RotateCcw className="w-4 h-4" /> RESTART_DIAGNOSIS
        </button>

        <div className="mt-4 pt-6 border-t border-[#5d4037]/20 w-full flex flex-col items-center">
            <p className="font-lead-type text-lg text-[#5d4037] mb-4">《杏林深处》：凭此方入场</p>
            
            {/* Mysterious Symbol Button */}
            <button 
                onClick={onGoVideo}
                className="relative group w-20 h-20 flex items-center justify-center transition-all duration-500"
                aria-label="Enter Deep Forest"
            >
                {/* Rotating ring */}
                <div className="absolute inset-0 rounded-full border border-[#5d4037] opacity-40 group-hover:scale-110 group-hover:rotate-180 transition-transform duration-1000"></div>
                
                {/* The Symbol (Acupuncture Needle Style) */}
                <div className="relative z-10 text-[#5d4037] group-hover:text-[#ff461f] transition-colors duration-300">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 group-hover:translate-y-1 transition-transform duration-500">
                        {/* Needle Shaft - long and thin, pointing bottom-left */}
                        <path d="M26 14 L8 32" strokeWidth="1.5" />
                        
                        {/* Needle Handle - Segmented to look like wound copper wire */}
                        {/* We use multiple small segments to create the texture effect */}
                        <path d="M33 7 L31 9" strokeWidth="3" />
                        <path d="M31 9 L29 11" strokeWidth="3" />
                        <path d="M29 11 L27 13" strokeWidth="3" />
                        <path d="M27 13 L25 15" strokeWidth="3" />
                        
                        {/* Tiny glint at the tip */}
                        <circle cx="8" cy="32" r="0.5" fill="currentColor" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                    </svg>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-[#ff461f] opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-300"></div>
            </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResult;