
import React from 'react';
import { Clock, CheckCircle2, Package, Truck } from 'lucide-react';

// --- ATOM: Status Step ---
export const StatusStep = ({ 
    active, 
    completed, 
    icon: Icon, 
    label, 
    date 
}: { 
    active: boolean, 
    completed: boolean, 
    icon: any, 
    label: string, 
    date?: string 
}) => {
    let colorClass = 'text-gray-600 border-gray-700 bg-brand-dark';
    if (completed) colorClass = 'text-green-500 border-green-500 bg-green-500/10';
    if (active) colorClass = 'text-brand-orange border-brand-orange bg-brand-orange/10 animate-pulse';

    return (
        <div className="flex flex-col items-center text-center relative z-10 w-1/4">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-all ${colorClass}`}>
                <Icon size={18} />
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${active || completed ? 'text-white' : 'text-gray-600'}`}>{label}</p>
            {date && <p className="text-[9px] text-gray-500 mt-1">{date}</p>}
        </div>
    );
};

// --- MOLECULE: Timeline ---
export const Timeline = ({ status, created_at }: { status: string, created_at: string }) => {
    const steps = ['pending', 'paid', 'processed', 'completed'];
    const currentIndex = steps.indexOf(status === 'cancelled' ? 'pending' : status);
    
    // Progress Bar Width
    const progress = Math.max(0, Math.min(100, (currentIndex / (steps.length - 1)) * 100));

    return (
        <div className="relative my-8 px-4">
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-white/10 -z-0"></div>
            {/* Active Line */}
            <div 
                className="absolute top-5 left-0 h-0.5 bg-brand-orange -z-0 transition-all duration-1000"
                style={{ width: `${progress}%` }}
            ></div>

            <div className="flex justify-between relative z-10">
                <StatusStep 
                    active={status === 'pending'} 
                    completed={currentIndex > 0} 
                    icon={Clock} 
                    label="Nunggu Duit" 
                    date={new Date(created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                />
                <StatusStep 
                    active={status === 'paid'} 
                    completed={currentIndex > 1} 
                    icon={CheckCircle2} 
                    label="Udah Lunas" 
                />
                <StatusStep 
                    active={status === 'processed'} 
                    completed={currentIndex > 2} 
                    icon={Package} 
                    label="Lagi Dirakit" 
                />
                <StatusStep 
                    active={status === 'completed'} 
                    completed={status === 'completed'} 
                    icon={Truck} 
                    label="Meluncur" 
                />
            </div>
        </div>
    );
};
