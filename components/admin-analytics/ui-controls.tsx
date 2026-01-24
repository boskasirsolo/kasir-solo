import React from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';

export const DashboardHeader = ({ 
    onRefresh,
    isRefreshing
}: { 
    onRefresh: () => void, 
    isRefreshing: boolean 
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-brand-card/30 p-4 rounded-xl border border-white/5 gap-4 mb-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="bg-brand-orange/10 p-2 rounded-lg text-brand-orange shrink-0">
                    <BarChart3 size={20} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm leading-none">Traffic Command Center</h3>
                        <button 
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-brand-orange rounded-lg transition-all group shrink-0"
                            title="Refresh Data"
                        >
                            <RefreshCw size={14} className={`${isRefreshing ? 'animate-spin text-brand-orange' : 'group-hover:rotate-180 transition-transform'}`} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Live analytics pengunjung website.</p>
                </div>
            </div>
        </div>
    );
};