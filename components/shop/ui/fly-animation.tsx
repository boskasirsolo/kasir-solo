
import React, { useState, useEffect } from 'react';
import { optimizeImage } from '../../../utils';

export const FlyingParticle = ({ src, startRect, targetRect, onFinish }: { src: string, startRect: DOMRect, targetRect: DOMRect, onFinish: () => void }) => {
  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: startRect.top,
    left: startRect.left,
    width: 60,
    height: 60,
    opacity: 1,
    zIndex: 9999,
    borderRadius: '8px',
    objectFit: 'cover',
    pointerEvents: 'none',
    transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
    boxShadow: '0 0 15px rgba(255, 95, 31, 0.8)'
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      setStyle(prev => ({
        ...prev,
        top: targetRect.top + 10,
        left: targetRect.left + 10,
        width: 20,
        height: 20,
        opacity: 0,
        transform: 'scale(0.5) rotate(360deg)'
      }));
    });

    const timer = setTimeout(onFinish, 800);
    return () => clearTimeout(timer);
  }, [targetRect, onFinish]);

  return <img src={optimizeImage(src, 100)} style={style} alt="flying-product" />;
};
