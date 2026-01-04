
import React from 'react';
import { MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StrategyType } from './types';

// --- ATOM: Strategy Chip ---
export const StrategyChip = ({ cityName }: { cityName: string }) => (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 mb-6 backdrop-blur-md">
       <MapPin size={14} className="text-brand-orange" />
       <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.2em]">Invasi Mesin Kasir {cityName}</span>
    </div>
);

// --- ATOM: Quota Badge ---
export const QuotaBadge = ({ 
    isKandang, 
    remaining, 
    max 
}: { 
    isKandang: boolean, 
    remaining: number, 
    max: number 
}) => (
    <div className="mb-8 flex justify-center">
        <div className="bg-red-500/10 border border-red-500/30 px-6 py-2 rounded-full flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider animate-pulse text-center">
            <AlertTriangle size={14} className="shrink-0" /> 
            <span>
                {isKandang 
                    ? `KUOTA SETUP ON-SITE: SISA ${remaining} DARI ${max} SLOT BULAN INI` 
                    : "KUOTA VIDEO CALL SETUP: TERBATAS BULAN INI"}
            </span>
        </div>
    </div>
);

// --- ATOM: Education Row (Pain Point) ---
export const PainPointRow = ({ number, title, desc }: { number: number, title: string, desc: string }) => (
    <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center font-bold text-white border border-white/10 shrink-0">{number}</div>
        <div>
            <h4 className="text-white font-bold mb-1">{title}</h4>
            <p className="text-gray-400 text-sm">{desc}</p>
        </div>
    </div>
);

// --- ATOM: Education Row (Solution) ---
export const SolutionRow = ({ title }: { title: string }) => (
    <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
        <span className="text-gray-300 text-sm font-bold">{title}</span>
        <CheckCircle2 size={18} className="text-brand-orange"/>
    </div>
);
