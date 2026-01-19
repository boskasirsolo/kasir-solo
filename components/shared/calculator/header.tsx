
import React from 'react';
import { Calculator } from 'lucide-react';

export const CalcHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="p-6 md:p-10 border-b border-white/5 bg-black/20 text-center">
     <div className="inline-flex items-center justify-center p-3 bg-brand-orange/10 rounded-full text-brand-orange mb-4 shadow-neon">
        <Calculator size={32} />
     </div>
     <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{title}</h2>
     <p className="text-gray-400">{subtitle}</p>
  </div>
);
