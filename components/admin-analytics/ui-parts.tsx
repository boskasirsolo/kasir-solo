
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export const MetricBlock = ({ 
  label, 
  value, 
  trend, 
  icon: Icon,
  color = "text-brand-orange"
}: { 
  label: string, 
  value: string | number, 
  trend?: number, 
  icon: any,
  color?: string
}) => (
  <div className="bg-brand-card/50 border border-white/5 p-5 rounded-2xl group hover:border-brand-orange/30 transition-all relative overflow-hidden">
    {/* Background Pattern (Sparkline Imaginer) */}
    <div className="absolute bottom-0 left-0 right-0 h-8 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 20" className="w-full h-full preserve-3d">
            <path 
                d="M0,20 Q10,5 20,15 T40,10 T60,18 T80,8 T100,15" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className={trend && trend >= 0 ? 'text-green-500' : 'text-red-500'}
            />
        </svg>
    </div>

    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-2 rounded-lg bg-white/5 ${color} border border-white/10 shadow-inner group-hover:scale-110 transition-transform`}>
        <Icon size={18} />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black border ${trend >= 0 ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20'}`}>
          {trend >= 0 ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="relative z-10">
      <h3 className="text-2xl md:text-3xl font-display font-black text-white group-hover:text-brand-orange transition-colors">{value}</h3>
      <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mt-1">{label}</p>
    </div>
  </div>
);

export const RadarPing = () => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/20">
    <div className="relative flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
    </div>
    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Radar Active</span>
  </div>
);
