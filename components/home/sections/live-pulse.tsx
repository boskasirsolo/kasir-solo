
import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';
import { PulseEvent } from '../../../hooks/use-social-pulse';

// FIX: Typed as React.FC to correctly handle internal React props like 'key' in map rendering
const PulseItem: React.FC<{ event: PulseEvent }> = ({ event }) => (
    <div className="min-w-[240px] md:min-w-[280px] p-3 bg-brand-card/50 rounded-xl border border-white/5 flex items-center gap-3 shrink-0 hover:border-brand-orange/30 transition-colors group">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 border border-white/5 group-hover:text-brand-orange transition-colors">
            <ShieldCheck size={14} />
        </div>
        <div className="min-w-0">
            <p className="text-white text-[10px] font-bold truncate uppercase tracking-wider">Juragan {event.name}</p>
            <p className="text-[9px] text-gray-500 truncate font-medium">
                <span className="text-brand-orange">{event.item}</span> @ {event.location}
            </p>
        </div>
    </div>
);

export const LivePulseSection = ({ events }: { events: PulseEvent[] }) => {
    // CLS Fix: Jangan render apapun kalau data kosong
    if (events.length === 0) return null;

    return (
        <section className="py-12 bg-black border-y border-white/5 overflow-hidden relative group/pulse-section">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-orange/[0.02] via-transparent to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    
                    {/* Header Label (Static) */}
                    <div className="flex items-center gap-4 shrink-0 bg-black/80 backdrop-blur-md lg:pr-8 lg:border-r border-white/10 relative z-20">
                        <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange shadow-neon">
                            <Activity size={24} className="animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-white leading-tight">Live Pulse</h3>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Signal & Traffics</p>
                        </div>
                    </div>

                    {/* Marquee Container (Dynamic) */}
                    <div className="flex-1 relative overflow-hidden group/marquee h-14 flex items-center">
                        {/* Faders overlay biar transisi ke tepi lebih smooth */}
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

                        <div className="flex gap-4">
                            {/* Set 1: Original */}
                            <div className="flex gap-4 animate-marquee whitespace-nowrap min-w-full items-center group-hover/pulse-section:[animation-play-state:paused]">
                                {events.map((e, i) => (
                                    <PulseItem key={`p1-${e.id}-${i}`} event={e} />
                                ))}
                            </div>
                            
                            {/* Set 2: Clone for seamless looping */}
                            <div className="flex gap-4 animate-marquee whitespace-nowrap min-w-full items-center group-hover/pulse-section:[animation-play-state:paused]" aria-hidden="true">
                                {events.map((e, i) => (
                                    <PulseItem key={`p2-${e.id}-${i}`} event={e} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Verified Trust Badge (Static Desktop) */}
                    <div className="hidden xl:flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 shrink-0 shadow-inner group hover:border-brand-orange/20 transition-all">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Trust Status</p>
                            <p className="text-xs font-bold text-green-500 uppercase flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-green-500 animate-ping"></span> 100% Verified
                            </p>
                        </div>
                        <div className="w-px h-8 bg-white/10 mx-1"></div>
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
