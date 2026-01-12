import React, { useRef, useState } from 'react';
import { ArrowLeft, Play, Pause } from 'lucide-react';

const VideoPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Using a Mixkit free stock video of a foggy forest
  const VIDEO_SRC = "https://assets.mixkit.co/videos/preview/mixkit-mysterious-forest-in-fog-3996-large.mp4";

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-in zoom-in duration-500">
      
      {/* Video Container */}
      <div className="w-full max-w-5xl bg-black border-4 border-[#5d4037] shadow-[0_0_30px_rgba(255,70,31,0.2)] relative aspect-video group overflow-hidden">
        
        <video 
            ref={videoRef}
            src={VIDEO_SRC}
            className="w-full h-full object-cover opacity-80"
            autoPlay
            loop
            muted // Muted needed for autoplay policy
            playsInline
        />

        {/* Overlay: Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
        
        {/* Overlay: CRT Flicker */}
        <div className="absolute inset-0 bg-white opacity-[0.02] animate-[flicker_0.15s_infinite] pointer-events-none z-10"></div>

        {/* Overlay: Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_60%,black_100%)] z-10 pointer-events-none"></div>

        {/* Title Overlay */}
        <div className="absolute top-4 left-6 z-20">
            <h1 className="font-calligraphy text-4xl text-[#ff461f] drop-shadow-md">杏林深处</h1>
            <p className="font-pixel text-[#00ff00] text-sm tracking-widest mt-1">SECTOR_07 // DEEP_FOREST_ARCHIVE</p>
        </div>

        {/* Play/Pause Button Overlay (visible on hover) */}
        <button 
            onClick={togglePlay}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
            <div className="bg-[#5d4037]/80 p-4 rounded-full text-[#f0e6d2] hover:bg-[#ff461f] transition-colors backdrop-blur-sm border border-[#d7c9a8]">
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </div>
        </button>

        {/* Decor: Corner Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-[#ff461f] z-20"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-[#ff461f] z-20"></div>

      </div>

      <button 
        onClick={onBack}
        className="mt-8 flex items-center gap-2 text-[#f0e6d2] font-pixel text-xl hover:text-[#ff461f] transition-colors border-b border-transparent hover:border-[#ff461f] pb-1"
      >
        <ArrowLeft /> RETURN_TO_CLINIC
      </button>
      
      <style>{`
        @keyframes flicker {
            0% { opacity: 0.02; }
            5% { opacity: 0.05; }
            10% { opacity: 0.02; }
            15% { opacity: 0.06; }
            20% { opacity: 0.02; }
            50% { opacity: 0.02; }
            55% { opacity: 0.05; }
            60% { opacity: 0.02; }
            100% { opacity: 0.02; }
        }
      `}</style>
    </div>
  );
};

export default VideoPage;