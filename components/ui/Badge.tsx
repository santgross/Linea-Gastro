import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'primary' | 'muted';
}

export default function Badge({ children, variant = 'primary' }: BadgeProps) {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'info':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'muted':
        return 'bg-[#8892b00a] text-[#8892b0] border-[#8892b01a]';
      case 'primary':
      default:
        return 'bg-[#00C9A7]/10 text-[#00C9A7] border-[#00C9A7]/20';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-full font-mono ${getColors()}`}>
      {children}
    </span>
  );
}
