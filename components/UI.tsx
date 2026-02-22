
import React from 'react';
import { motion } from 'framer-motion';
import { audio } from '../services/audioService';

export const BORDER_STYLE = "border-2 border-[var(--primary)]";
export const SHADOW_STYLE = "neo-shadow";
export const CARD_BASE = `bg-[var(--card-bg)] border-[var(--primary)]/15 border`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export const NeoButton: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  onClick,
  ...props 
}) => {
  const baseColors = {
    primary: 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] border-[var(--primary)]',
    secondary: 'bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] border-[var(--primary)]',
    danger: 'bg-black text-red-500 border-red-500 hover:bg-red-950/20',
    success: 'bg-[var(--primary)] text-[var(--bg-color)] border-[var(--primary)] hover:opacity-95',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (localStorage.getItem('encode_audio_sfx') !== 'false') {
        audio.playClick();
    }
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className={`
        ${baseColors[variant]} 
        ${SHADOW_STYLE}
        border-2
        px-3 py-1.5 
        font-mono font-bold text-xs
        uppercase tracking-widest
        disabled:opacity-20 disabled:pointer-events-none
        flex items-center justify-center
        transition-all duration-75
        relative overflow-hidden
        ${className}
      `}
      {...props as any}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export const NeoCard: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`${CARD_BASE} ${className} flex flex-col overflow-hidden relative shadow-sm rounded-[var(--radius)]`}
    >
      {title && (
        <div className="border-b border-[var(--primary)]/20 bg-[var(--header-bg)] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[var(--header-text)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[var(--primary)] opacity-80" />
            {title}
          </div>
          <span className="text-[7px] opacity-40 font-mono hidden sm:inline text-zinc-900 font-bold">DATA_LNK</span>
        </div>
      )}
      <div className="flex-1 overflow-auto bg-transparent relative">
        <div className="absolute inset-0 bg-grid opacity-[0.25] pointer-events-none z-0"></div>
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export const NeoInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <div className="flex items-center gap-2 group">
      <span className="text-[var(--primary)] font-bold opacity-70">{">"}</span>
      <input 
        className={`w-full bg-transparent text-[var(--primary)] border-b border-[var(--primary)]/40 focus:border-[var(--primary)] px-2 py-1 font-mono text-xs focus:outline-none placeholder:text-[var(--dim)]/60 transition-all font-bold ${className}`}
        {...props}
      />
    </div>
  );
};

export const TypewriterText: React.FC<{ text: string, speed?: number, className?: string }> = ({ text, speed = 15, className = "" }) => {
  const [displayedText, setDisplayedText] = React.useState("");
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setDisplayedText("");
    setIndex(0);
  }, [text]);

  React.useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return (
    <span className={`${className} ${index < text.length ? 'after:content-["_"] after:animate-pulse after:bg-[var(--primary)] after:inline-block after:w-1.5 after:h-3 after:ml-0.5' : ''}`}>
      {displayedText}
    </span>
  );
};
