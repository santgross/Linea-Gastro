import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyle = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const getVariant = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-[#1A1D2E] text-gray-200 hover:bg-[#252a41] border border-[#8892b01a]';
      case 'danger':
        return 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/15';
      case 'ghost':
        return 'text-gray-400 hover:text-white hover:bg-[#8892b00a]';
      case 'primary':
      default:
        return 'bg-[#00C9A7] text-[#0F1117] hover:bg-[#00b495] font-semibold shadow-lg shadow-[#00C9A733]';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'lg':
        return 'px-6 py-3 text-base';
      case 'md':
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <button
      className={`${baseStyle} ${getVariant()} ${getSize()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
