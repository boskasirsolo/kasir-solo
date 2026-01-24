import React from 'react';
import { Zap, LucideIcon } from 'lucide-react';
import { StatusIndicator } from './atoms';

interface BriefingProps {
  icon: LucideIcon;
  color: string;
  label: string;
  text: string;
}

export const BriefingHeader = ({ icon: Icon, color, label, text }: BriefingProps) => (
  <div className="px-1 animate-fade-in mb-6">
    <div className="bg-brand-orange/5 border border-brand-orange/10 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-inner">
      <div className={`p-3 rounded-xl bg-black/40 border border-white/5 ${color} shrink-0 shadow-lg`}>
        <Icon size={24} />
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{label}</span>
          <StatusIndicator color={color.replace('text-', 'bg-')} />
        </div>
        <p className="text-xs text-gray-400 leading-relaxed font-medium">
          {text}
        </p>
      </div>
      <div className="hidden lg:flex items-center gap-3 pl-6 border-l border-white/5">
        <div className="text-right">
          <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Tactical Radar</p>
          <p className="text-[10px] text-green-500 font-bold uppercase">Active</p>
        </div>
        <Zap size={14} className="text-brand-orange animate-pulse" />
      </div>
    </div>
  </div>
);