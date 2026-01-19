
import React from 'react';

export const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-50">
        <div 
            className="h-full bg-brand-orange shadow-[0_0_10px_rgba(255,95,31,0.8)]" 
            style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
        ></div>
    </div>
);
