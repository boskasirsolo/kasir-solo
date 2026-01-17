
import React from 'react';
import { AdminTabId } from './types';
import { ChevronRight, Activity, ShieldCheck, Zap } from 'lucide-react';

// --- ATOM: Sidebar Tab Button ---
export const SidebarTabButton: React.FC<{ 
    id: AdminTabId, 
    label: string, 
    icon: any, 
    isActive: boolean, 
    onClick: () => void 
}> = ({ 
    id, 
    label, 
    icon: Icon, 
    isActive, 
    onClick 
}) => (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[11px] font-black transition-all border group relative overflow-hidden ${
        isActive 
          ? 'bg-brand-orange/10 text-white border-brand-orange shadow-[0_0_20px_rgba(255,95,31,0.15)]' 
          : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300'
      }`}
    >
      {/* Active Indicator Glow */}
      {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange shadow-neon-text"></div>
      )}
      
      <div className="flex items-center gap-3 relative z-10">
        <Icon size={18} className={isActive ? 'text-brand-orange animate-pulse' : 'text-gray-600 group-hover:text-brand-orange transition-colors'} />
        <span className="uppercase tracking-[0.15em]">{label}</span>
      </div>

      <div className="relative z-10">
        {isActive ? (
            <ChevronRight size={14} className="text-brand-orange" />
        ) : (
            <ChevronRight size={14} className="text-gray-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        )}
      </div>
    </button>
);

// --- ATOM: Sidebar Group Header ---
export const SidebarGroupHeader = ({ label }: { label: string }) => (
    <div className="px-4 mt-8 mb-3 flex items-center gap-3">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] whitespace-nowrap">
            {label}
        </p>
        <div className="h-px bg-white/5 flex-1"></div>
    </div>
);

// --- MOLECULE: System Health Widget ---
export const SystemHealthWidget = () => (
    <div className="mx-4 mb-6 p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">System Engine</span>
            <Activity size={12} className="text-green-500 animate-pulse" />
        </div>
        
        <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2 text-gray-400">
                    <Zap size={10} className="text-brand-orange" /> SIBOS AI
                </div>
                <span className="text-green-500 font-bold">STABLE</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2 text-gray-400">
                    <ShieldCheck size={10} className="text-blue-400" /> DATABASE
                </div>
                <span className="text-green-500 font-bold">SYNC</span>
            </div>
        </div>
        
        <div className="pt-2 border-t border-white/5">
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-brand-orange h-full w-[85%] shadow-neon-text"></div>
            </div>
            <p className="text-[8px] text-gray-600 mt-1 uppercase font-bold text-center">Disk Usage: 85%</p>
        </div>
    </div>
);

// --- ATOM: Store Sub-Tab ---
export const StoreSubTabBtn = ({ 
    active, 
    onClick, 
    icon: Icon, 
    label 
}: { 
    active: boolean, 
    onClick: () => void, 
    icon: any, 
    label: string 
}) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${
        active
        ? 'bg-brand-orange text-white shadow-neon'
        : 'text-gray-500 hover:text-white hover:bg-white/5'
        }`}
    >
        <Icon size={14} /> {label}
    </button>
);

// --- ATOM: Action Button Sidebar ---
export const SidebarActionBtn = ({ 
    onClick, 
    icon: Icon, 
    label,
    variant = 'default' 
}: { 
    onClick: () => void, 
    icon: any, 
    label: string,
    variant?: 'default' | 'danger'
}) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
            variant === 'danger' 
            ? 'bg-red-500/5 text-red-500 border-red-500/10 hover:bg-red-500 hover:text-white shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
            : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:border-brand-orange/50'
        }`}
    >
        <Icon size={16} className={variant === 'danger' ? '' : 'text-brand-orange'} /> {label}
    </button>
);
