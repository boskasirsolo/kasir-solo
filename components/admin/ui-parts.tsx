
import React, { useState, useEffect } from 'react';
import { AdminTabId } from './types';
import { ChevronRight, Activity, ShieldCheck, Zap, Terminal as TerminalIcon } from 'lucide-react';

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
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[11px] font-black transition-all border group relative overflow-hidden active:scale-[0.97] ${
        isActive 
          ? 'bg-brand-orange/10 text-white border-brand-orange/40 shadow-[0_0_25px_rgba(255,95,31,0.15)]' 
          : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300'
      }`}
    >
      {/* Active Indicator Glow */}
      {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange shadow-[0_0_10px_#FF5F1F]"></div>
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
    <div className="mx-4 mb-4 p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Core Engine</span>
            <Activity size={12} className="text-green-500 animate-pulse" />
        </div>
        
        <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2 text-gray-400">
                    <Zap size={10} className="text-brand-orange" /> SIBOS AI
                </div>
                <span className="text-green-500 font-bold text-[9px]">LOCKED</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2 text-gray-400">
                    <ShieldCheck size={10} className="text-blue-400" /> DATABASE
                </div>
                <span className="text-blue-500 font-bold text-[9px]">SYNCED</span>
            </div>
        </div>
    </div>
);

// --- MOLECULE: System Log Widget (Terminal style) ---
export const SystemLogWidget = () => {
    const [logs, setLogs] = useState<string[]>(['System initialized...', 'Checking API status...']);
    const [activeLine, setActiveLine] = useState(0);

    const logPool = [
        'Syncing product database...',
        'Optimizing LCP metrics...',
        'Caching SEO routes...',
        'Scanning for shadow leads...',
        'Gemini AI buffer: 94%',
        'Surveillance active...',
        'Database vacuum complete.',
        'MKS Server: Status Green.'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(prev => {
                const nextLog = logPool[Math.floor(Math.random() * logPool.length)];
                const newLogs = [...prev.slice(-3), `> ${nextLog}`];
                return newLogs;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mx-4 p-3 rounded-xl bg-black border border-white/5 font-mono text-[8px] text-green-500/60 h-24 overflow-hidden flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1 border-b border-white/5 pb-1 text-[7px] text-gray-600 font-bold uppercase tracking-widest">
                <TerminalIcon size={10} /> Active_Console
            </div>
            {logs.map((log, i) => (
                <div key={i} className="truncate animate-fade-in opacity-80">{log}</div>
            ))}
            <div className="animate-pulse">_</div>
        </div>
    );
};

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
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-black tracking-widest transition-all active:scale-95 ${
        active
        ? 'bg-brand-orange text-white shadow-[0_0_15px_rgba(255,95,31,0.3)]'
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
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all active:scale-[0.98] ${
            variant === 'danger' 
            ? 'bg-red-500/5 text-red-500 border-red-500/10 hover:bg-red-500 hover:text-white shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
            : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:border-brand-orange/50 shadow-sm'
        }`}
    >
        <Icon size={16} className={variant === 'danger' ? '' : 'text-brand-orange'} /> {label}
    </button>
);
