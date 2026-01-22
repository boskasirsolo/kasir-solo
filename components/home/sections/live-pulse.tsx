
import React from 'react';
import { Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { PulseEvent } from '../../../hooks/use-social-pulse';

export const LivePulseSection = ({ events }: { events: PulseEvent[] }) => {
    if (events.length === 0) return null;

    return (
        <section className="py-12 bg-black border-y border-white/5 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange shadow-neon">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-white">Live Pulse</h3>
                            <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Aktivitas 24 Jam Terakhir</p>
                        </div>
                    </div>

                    <div className="flex-1 flex gap-4 overflow-x-auto custom-scrollbar-hide px-4">
                        {events.slice(0, 4).map((e, i) => (
                            <div key={i} className="min-w-[200px] p-3 bg-brand-card/50 rounded-xl border border-white/5 flex items-center gap-3 shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 border border-white/5">
                                    <ShieldCheck size={14} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white text-[10px] font-bold truncate">Juragan {e.name}</p>
                                    <p className="text-[9px] text-gray-500 truncate">{e.item} @ {e.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 shrink-0">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Trust Level</p>
                            <p className="text-sm font-bold text-green-500 uppercase">Verified</p>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <CheckCircleIcon />
                    </div>
                </div>
            </div>
        </section>
    );
};

const CheckCircleIcon = () => (
    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] border border-green-500/30">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    </div>
);
