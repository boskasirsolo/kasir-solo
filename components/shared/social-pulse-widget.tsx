
import React from 'react';
import { ShoppingBag, Zap, Users, MapPin } from 'lucide-react';
import { PulseEvent } from '../../hooks/use-social-pulse';

export const SocialPulseWidget = ({ event }: { event: PulseEvent | null }) => {
    if (!event) return null;

    const getIcon = () => {
        if (event.type === 'order') return <ShoppingBag size={14} className="text-green-400" />;
        if (event.type === 'simulation') return <Zap size={14} className="text-blue-400" />;
        return <Users size={14} className="text-brand-orange" />;
    };

    const getActionText = () => {
        if (event.type === 'order') return "Baru saja Checkout";
        if (event.type === 'simulation') return "Sedang Simulasi Budget";
        return "Sedang Konsultasi";
    };

    return (
        <div className="fixed bottom-6 left-6 z-[9995] animate-fade-in pointer-events-none">
            <div className="bg-brand-dark/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[300px] pointer-events-auto">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                    {getIcon()}
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">
                        {getActionText()}
                    </p>
                    <h4 className="text-xs font-bold text-white truncate">
                        Juragan {event.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-400 font-medium">
                        <span className="flex items-center gap-1"><MapPin size={10}/> {event.location}</span>
                        <span>•</span>
                        <span className="text-brand-orange">{event.item}</span>
                    </div>
                </div>
                
                {/* Ping Indicator */}
                <div className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange"></span>
                </div>
            </div>
        </div>
    );
};
