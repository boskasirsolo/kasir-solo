
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
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[10px] font-black transition-all border group relative overflow-hidden active:scale-[0.97] ${
        isActive 
          ? 'bg-brand-orange/10 text-white border-brand-orange/40 shadow-[0_0_15px_rgba(255,95,31,0.1)]' 
          : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300'
      }`}
    >
      {/* Active Indicator Glow */}
      {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-orange shadow-[0_0_10px_#FF5F1F]"></div>
      )}
      
      <div className="flex items-center gap-2.5 relative z-10">
        <Icon size={16} className={isActive ? 'text-brand-orange animate-pulse' : 'text-gray-600 group-hover:text-brand-orange transition-colors'} />
        <span className="uppercase tracking-[0.1em]">{label}</span>
      </div>

      <div className="relative z-10">
        {isActive ? (
            <ChevronRight size={12} className="text-brand-orange" />
        ) : (
            <ChevronRight size={12} className="text-gray-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        )}
      </div>
    </button>
);

// --- ATOM: Sidebar Group Header ---
export const SidebarGroupHeader = ({ label }: { label: string }) => (
    <div className="px-3 mt-4 mb-2 flex items-center gap-2">
        <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.25em] whitespace-nowrap">
            {label}
        </p>
        <div className="h-px bg-white/5 flex-1"></div>
    </div>
);

// --- MOLECULE: System Health Widget (Updatable for Header) ---
export const SystemHealthWidget = ({ horizontal = false }: { horizontal?: boolean }) => {
    if (horizontal) {
        return (
            <div className="hidden md:flex items-center gap-4 bg-brand-dark/50 border border-white/5 px-4 py-2 rounded-2xl">
                <div className="flex items-center gap-2">
                    <Zap size={10} className="text-brand-orange" />
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">SIBOS AI</span>
                    <span className="text-green-500 font-black text-[8px]">LOCKED</span>
                </div>
                <div className="w-px h-3 bg-white/10"></div>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={10} className="text-blue-400" />
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">DB</span>
                    <span className="text-blue-500 font-black text-[8px]">SYNCED</span>
                </div>
            </div>
        );
    }

    return (
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
