import React, { useEffect, useState } from 'react';
// COLORS not used, removed import

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("正在接入脑机接口...");

  useEffect(() => {
    const texts = [
      "正在接入脑机接口...",
      "扫描经络数据包...",
      "分析赛博脉象...",
      "下载云端药方...",
      "正在生成诊断符咒..."
    ];

    let currentTextIndex = 0;
    
    // Progress interval
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Small delay after 100%
          return 100;
        }
        
        // Random increment for "hacking" feel
        const increment = Math.random() * 5 + 1;
        const newProgress = Math.min(prev + increment, 100);
        
        // Update text based on progress stages
        if (newProgress > 20 && currentTextIndex === 0) {
          currentTextIndex = 1;
          setStatusText(texts[1]);
        } else if (newProgress > 40 && currentTextIndex === 1) {
          currentTextIndex = 2;
          setStatusText(texts[2]);
        } else if (newProgress > 60 && currentTextIndex === 2) {
          currentTextIndex = 3;
          setStatusText(texts[3]);
        } else if (newProgress > 85 && currentTextIndex === 3) {
          currentTextIndex = 4;
          setStatusText(texts[4]);
        }

        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-8">
      <div className="w-full font-pixel text-[#b026ff] text-xl mb-2 flex justify-between animate-pulse">
        <span>SYSTEM_BOOT</span>
        <span>{Math.floor(progress)}%</span>
      </div>
      
      {/* Progress Bar Container */}
      <div className="w-full h-6 bg-[#5d4037] border-2 border-[#5d4037] p-1 relative shadow-[0_0_10px_rgba(176,38,255,0.3)]">
        {/* Fill */}
        <div 
          className="h-full bg-[#00ff00] transition-all duration-100 ease-out relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
            {/* Scanline effect inside bar */}
            <div className="absolute inset-0 bg-white opacity-20 w-full h-full animate-glitch"></div>
        </div>
      </div>

      <div className="mt-6 font-calligraphy text-2xl text-[#5d4037] typewriter-cursor">
        {statusText}
      </div>

      {/* Decor */}
      <div className="mt-8 grid grid-cols-4 gap-2 w-full opacity-30">
        {[...Array(4)].map((_, i) => (
           <div key={i} className="h-1 bg-[#5d4037]"></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
