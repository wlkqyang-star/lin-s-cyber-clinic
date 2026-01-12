import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
// COLORS not used, removed import

interface Props {
  onSubmit: (nickname: string) => void;
}

const DiagnosisForm: React.FC<Props> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md mx-auto space-y-8 z-10 relative">
      <div className="relative w-full group">
        {/* Talisman Top Decoration */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-center text-xs text-[#d7c9a8] bg-[#5d4037] px-2 py-1 rounded-sm border border-[#d7c9a8] font-pixel shadow-md">
          INPUT_IDENTITY // 身份录入
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入患者名讳..."
          className="w-full bg-[#fffdf5] text-center text-2xl py-4 px-6 border-2 border-[#5d4037] focus:border-[#ff461f] focus:outline-none placeholder:text-gray-400 font-calligraphy text-[#333] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] transition-all transform focus:-translate-y-1 focus:shadow-[6px_6px_0px_0px_rgba(255,70,31,0.5)]"
          maxLength={12}
        />
        
        {/* Vertical text decorations on sides */}
        <div className="absolute top-0 -left-8 h-full flex flex-col justify-center text-[10px] text-[#5d4037] font-pixel opacity-50 writing-vertical">
          <span>NO_SIGNAL</span>
        </div>
        <div className="absolute top-0 -right-8 h-full flex flex-col justify-center text-[10px] text-[#5d4037] font-pixel opacity-50 writing-vertical">
          <span>SYS_ERR</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!name.trim()}
        className="group relative px-8 py-3 bg-[#5d4037] hover:bg-[#ff461f] text-[#f0e6d2] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg border border-[#d7c9a8]"
      >
        <span className="relative z-10 flex items-center gap-2 font-calligraphy text-2xl tracking-widest">
          挂号问诊 <ArrowRight className="w-5 h-5" />
        </span>
        {/* Glitch hover effect overlay */}
        <div className="absolute inset-0 bg-[#b026ff] translate-y-full group-hover:translate-y-0 transition-transform duration-200 mix-blend-overlay opacity-50" />
      </button>

      <p className="text-[#5d4037] text-xs font-pixel opacity-60 text-center max-w-xs">
        * 警告：本系统直连赛博杏林大数据中心，请勿随意填写虚假信息，以免造成算力反噬。
      </p>
    </form>
  );
};

export default DiagnosisForm;
