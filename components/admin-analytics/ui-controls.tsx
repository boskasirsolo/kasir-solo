
import React from 'react';
import { BarChart3, ShieldCheck, RefreshCw } from 'lucide-react';

export const DashboardHeader = ({ 
    period, 
    setPeriod,
    onRefresh,
    isRefreshing,
    aiInsights
}: { 
    period: number, 
    setPeriod: (d: number) => void,
    onRefresh: () => void,
    isRefreshing: boolean,
    aiInsights?: React.ReactNode 
}) => {
    const isGhostMode = typeof window !== 'undefined' && localStorage.getItem('mks_ghost_mode') === 'true';

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-brand-card/30 p-4 rounded-xl border border-white/5 gap-4 mb-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="bg-brand-orange/10 p-2 rounded-lg text-brand-orange shrink-0">
                    <BarChart3 size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Traffic Command Center</h3>
                    <p className="text-xs text-gray-500">Live analytics pengunjung website.</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                {aiInsights}

                <button 
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-brand-orange rounded-lg border border-white/5 transition-all group"
                    title="Refresh Data"
                >
                    <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin text-brand-orange' : 'group-hover:rotate-180 transition-transform'}`} />
                </button>

                {isGhostMode && (
                    <span className="hidden sm:flex text-[10px] font-bold text-green-500 items-center gap-1 bg-green-900/20 px-3 py-1.5 rounded-full border border-green-500/30 animate-pulse whitespace-nowrap">
                        <ShieldCheck size={12}/> Ghost Mode Active
                    </span>
                )}
                
                <div className="bg-black/40 rounded-lg p-1 border border-white/10 flex">
                    {[7, 30].map(d => (
                        <button 
                            key={d}
                            onClick={() => setPeriod(d)}
                            className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all ${period === d ? 'bg-brand-orange text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                        >
                            {d}D
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
