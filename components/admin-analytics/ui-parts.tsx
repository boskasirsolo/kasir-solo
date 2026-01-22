
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
  <div className="bg-brand-card/50 border border-white/5 p-5 rounded-2xl group hover:border-brand-orange/30 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-white/5 ${color} border border-white/10`}>
        <Icon size={18} />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-0.5 text-[10px] font-black ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <h3 className="text-2xl font-display font-black text-white group-hover:scale-105 transition-transform origin-left">{value}</h3>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">{label}</p>
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
