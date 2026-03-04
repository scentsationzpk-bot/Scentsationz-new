import React, { useRef, useState } from 'react';

interface FastButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void;
}

const FastButton: React.FC<FastButtonProps> = ({ onClick, className, children, style, ...props }) => {
  const [isActive, setIsActive] = useState(false);
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);
  const hasFiredRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsActive(true);
    hasFiredRef.current = false;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsActive(false);
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // If movement is minimal (tap), trigger immediately
    if (deltaX < 10 && deltaY < 10) {
      if (onClick) {
        // Prevent default to stop the ghost mouse click from firing later
        if (e.cancelable) e.preventDefault();
        onClick(e);
        hasFiredRef.current = true;
      }
    }
    touchStartRef.current = null;
  };

  const handleClick = (e: React.MouseEvent) => {
    // If we already fired via touch, ignore this click
    if (hasFiredRef.current) {
      hasFiredRef.current = false;
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      {...props}
      className={`${className} ${isActive ? 'scale-[0.98] opacity-90' : ''}`}
      style={{ 
        ...style, 
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default FastButton;
