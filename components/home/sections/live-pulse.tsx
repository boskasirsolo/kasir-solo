
import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';
import { PulseEvent } from '../../../hooks/use-social-pulse';

const PulseItem: React.FC<{ event: PulseEvent }> = ({ event }) => (
    <div className="p-3 bg-brand-card/50 rounded-xl border border-white/5 flex items-center gap-3 shrink-0 hover:border-brand-orange/30 transition-colors group mr-4">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 border border-white/5 group-hover:text-brand-orange transition-colors">
            <ShieldCheck size={14} />
        </div>
        <div className="min-w-0 max-w-[200px]">
            <p className="text-white text-[10px] font-bold truncate uppercase tracking-wider">Bos {event.name}</p>
            <p className="text-[9px] text-gray-500 truncate font-medium">
                <span className="text-brand-orange">{event.item}</span> @ {event.location}
            </p>
        </div>
    </div>
);

export const LivePulseSection = ({ events }: { events: PulseEvent[] }) => {
    if (events.length === 0) return null;

    return (
        <section className="py-12 bg-black border-y border-white/5 overflow-hidden relative group/pulse-section">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-orange/[0.02] via-transparent to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center">
                    
                    {/* Header Label (Static) */}
                    <div className="flex items-center gap-4 shrink-0 bg-black lg:pr-8 lg:border-r border-white/10 relative z-20 mb-6 lg:mb-0">
                        <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange shadow-neon">
                            <Activity size={24} className="animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-display font-bold text-white leading-tight">Live Pulse</h3>
                                <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-neon animate-pulse">24/7</span>
                            </div>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Signals & Traffics</p>
                        </div>
                    </div>

                    {/* Marquee Container (Dynamic) */}
                    <div className="flex-1 relative overflow-hidden h-14 flex items-center ml-0 lg:ml-8">
                        {/* Faders overlay */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

                        {/* Kontainer Utama Marquee tanpa gap eksternal */}
                        <div className="flex w-max group-hover/pulse-section:[animation-play-state:paused]">
                            {/* Set 1 */}
                            <div className="flex animate-marquee shrink-0">
                                {events.map((e, i) => (
                                    <PulseItem key={`p1-${e.id}-${i}`} event={e} />
                                ))}
                            </div>
                            
                            {/* Set 2 (Identik buat nyambung tanpa jeda) */}
                            <div className="flex animate-marquee shrink-0" aria-hidden="true">
                                {events.map((e, i) => (
                                    <PulseItem key={`p2-${e.id}-${i}`} event={e} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Verified Trust Badge (Static Desktop) */}
                    <div className="hidden xl:flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 shrink-0 shadow-inner group hover:border-brand-orange/20 transition-all ml-8">
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
