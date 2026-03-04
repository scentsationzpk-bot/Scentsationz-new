import React from 'react';

interface FastButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FastButton: React.FC<FastButtonProps> = ({ onClick, className, children, style, ...props }) => {
  return (
    <button
      {...props}
      onClick={onClick}
      className={`${className} relative overflow-visible`}
      style={{ 
        ...style, 
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation' // Removes 300ms delay on mobile
      }}
    >
      {/* Massive Hit Area Expansion - Invisible but clickable */}
      <span 
        className="absolute -top-6 -bottom-6 -left-6 -right-6 z-0 bg-transparent" 
        aria-hidden="true" 
      />
      
      {/* Content Wrapper - Ensures text/icons stay on top */}
      <span className="relative z-10 pointer-events-none flex items-center justify-center gap-2 w-full h-full">
        {children}
      </span>
    </button>
  );
};

export default FastButton;
