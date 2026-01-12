import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Using a reliable source for ambient noise (Rain/City ambience)
  // Since we can't upload assets, we use a public domain or creative commons link.
  // Using a placeholder link that represents noise.
  const AUDIO_URL = "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg"; 

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed interaction required:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    // Attempt auto-play on mount (often blocked by browsers, but worth a try with low volume)
    if (audioRef.current) {
        audioRef.current.volume = 0.2;
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} loop src={AUDIO_URL} />
      <button 
        onClick={togglePlay}
        className="p-3 bg-[#5d4037] text-[#f0e6d2] rounded-full hover:bg-[#ff461f] transition-colors shadow-lg border border-[#d7c9a8]"
        aria-label="Toggle Sound"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
};

export default AudioPlayer;
