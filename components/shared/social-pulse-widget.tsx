
import React from 'react';
import { ShoppingBag, Zap, Users, MapPin } from 'lucide-react';
import { PulseEvent } from '../../hooks/use-social-pulse';

export const SocialPulseWidget = ({ event }: { event: PulseEvent | null }) => {
    if (!event) return null;

    const getIcon = () => {
        if (event.type === 'order') return <ShoppingBag size={14} className="text-green-600" />;
        if (event.type === 'simulation') return <Zap size={14} className="text-blue-600" />;
        return <Users size={14} className="text-brand-orange" />;
    };

    const getActionText = () => {
        if (event.type === 'order') return "Baru saja Checkout";
        if (event.type === 'simulation') return "Sedang Simulasi Budget";
        return "Sedang Konsultasi";
    };

    return (
        <div className="fixed bottom-6 left-6 z-[9995] animate-fade-in pointer-events-none">
            {/* FORCE WHITE BACKGROUND FOR CONTRAST */}
            <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-4 max-w-[320px] pointer-events-auto">
                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 shadow-inner">
                    {getIcon()}
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">
                        {getActionText()}
                    </p>
                    {/* Dark text for visibility on white bg */}
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                        Juragan {event.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-600 font-bold">
                        <span className="flex items-center gap-1"><MapPin size={10} className="text-gray-400" /> {event.location}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-brand-orange">{event.item}</span>
                    </div>
                </div>
                
                {/* Ping Indicator stays Orange */}
                <div className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange"></span>
                </div>
            </div>
        </div>
    );
};
