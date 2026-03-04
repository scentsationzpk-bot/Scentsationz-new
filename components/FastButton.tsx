import React from 'react';

interface FastButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const FastButton: React.FC<FastButtonProps> = ({ onClick, className, children, style, ...props }) => {
  return (
    <button
      {...props}
      onClick={onClick}
      className={`${className} relative isolate`}
      style={{ 
        ...style, 
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
    >
      {/* Hit area expansion using pseudo-element via standard CSS if needed, 
          but here we rely on the button itself. 
          We add a transparent overlay for the shadow area. */}
      <span className="absolute -inset-4 z-[-1] bg-transparent content-['']" aria-hidden="true" />
      {children}
    </button>
  );
};

export default FastButton;
