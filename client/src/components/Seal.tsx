import React from 'react';

const Seal: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative ${className} select-none`}>
      <svg
        viewBox="0 0 100 100"
        className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md opacity-90 mix-blend-multiply"
        style={{ color: '#d93a1e' }} // Slightly darker red for ink
      >
        {/* Border with rough edges */}
        <path
          d="M5,5 Q50,2 95,5 Q98,50 95,95 Q50,98 5,95 Q2,50 5,5"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
            d="M5,5 L10,10 M95,5 L90,10 M95,95 L90,90 M5,95 L10,90" 
            stroke="currentColor" 
            strokeWidth="2" 
            opacity="0.5"
        />
        
        {/* Character '林' (Lin) - Stylized Seal Script */}
        <g transform="translate(15, 15) scale(0.7)" fill="currentColor">
             {/* Left Tree */}
            <path d="M10,40 L40,40 L40,10 L35,10 L35,35 L10,35 Z" />
            <path d="M25,10 L25,80 L30,80 L30,10 Z" />
            <path d="M25,40 L15,70 L20,72 L30,45 Z" />
            <path d="M25,40 L35,60 L38,58 L30,35 Z" />
            
             {/* Right Tree */}
            <path d="M60,40 L90,40 L90,10 L85,10 L85,35 L60,35 Z" />
            <path d="M75,10 L75,80 L80,80 L80,10 Z" />
            <path d="M75,40 L65,70 L70,72 L80,45 Z" />
            <path d="M75,40 L85,60 L88,58 L80,35 Z" />
        </g>
      </svg>
      {/* Texture overlay for the seal itself to look stamped */}
      <div className="absolute inset-0 bg-transparent opacity-30 mix-blend-screen pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')]"></div>
    </div>
  );
};

export default Seal;
