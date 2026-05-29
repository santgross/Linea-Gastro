import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  key?: any;
}

export default function Card({
  children,
  className = '',
  onClick,
  hoverable = false
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#1A1D2E] 
        border border-[#8892b01a] 
        rounded-2xl 
        p-6 
        shadow-sm 
        transition-all 
        duration-300 
        ${hoverable ? 'hover:-translate-y-1 hover:border-[#00C9A7]/35 cursor-pointer hover:shadow-lg hover:shadow-[#00C9A7]/5' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
}
