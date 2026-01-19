
import React from 'react';
import { X } from 'lucide-react';
import { optimizeImage } from '../../../../../utils';
import { ProgressBar } from './progress-bar';
import { MetaInfo } from './meta-info';

interface ReaderHeaderProps {
    article: any;
    progress: number;
    currentHeight: number;
    maxHeight: number;
    minHeight: number;
    onClose: () => void;
    onWheelProxy: (e: any) => void;
    adminStats: number | null;
}

export const ReaderHeader = ({ article, progress, currentHeight, maxHeight, minHeight, onClose, onWheelProxy, adminStats }: ReaderHeaderProps) => {
    const expandRatio = Math.max(0, (currentHeight - minHeight) / (maxHeight - minHeight));
    const collapseRatio = 1 - expandRatio;

    return (
      <div 
        className="fixed top-0 left-0 w-full z-50 overflow-hidden border-b border-white/10 shadow-2xl will-change-[height]" 
        style={{ height: `${currentHeight}px`, transition: 'none' }} 
        onWheel={onWheelProxy}
      >
          <ProgressBar progress={progress} />
          
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-[60] p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors border border-white/10 shadow-lg group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform" />
          </button>

          {/* Background Image Layer */}
          <div className="absolute inset-0 w-full h-full">
            <img 
                src={optimizeImage(article.image, 1200)} 
                alt={article.title} 
                className="w-full h-full object-cover" 
                style={{ filter: `brightness(${0.4 + (expandRatio * 0.4)})` }} 
            />
            <div className="absolute inset-0 bg-brand-black" style={{ opacity: collapseRatio * 0.9 }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" style={{ opacity: expandRatio }}></div>
          </div>

          <div className="container mx-auto px-4 h-full relative z-10 max-w-7xl pointer-events-none">
              {/* Collapsed State: Title Left */}
              <div 
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex items-center" 
                style={{ opacity: collapseRatio, pointerEvents: collapseRatio > 0.5 ? 'auto' : 'none' }}
              >
                <h2 className="text-lg md:text-xl font-bold text-white line-clamp-1 max-w-xl drop-shadow-md">
                    {article.title}
                </h2>
              </div>

              {/* Expanded State: Meta & Big Title */}
              <div 
                className="absolute bottom-10 left-4 md:left-8 origin-bottom-left" 
                style={{ opacity: expandRatio, transform: `scale(${0.9 + (expandRatio * 0.1)}) translateY(${collapseRatio * 20}px)`, pointerEvents: expandRatio > 0.5 ? 'auto' : 'none' }}
              >
                  <MetaInfo article={article} adminStats={adminStats} />
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight drop-shadow-lg max-w-4xl">
                      {article.title}
                  </h1>
              </div>
          </div>
      </div>
    );
};
