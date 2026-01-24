import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Users, 
    FileText, 
} from 'lucide-react';
import { useAnalyticsData } from './logic';
import { LoadingSpinner } from '../ui';
import { KPIGrid, ReferrerList } from './ui-cards';
import { TrafficChart, PeakHoursHeatmap } from './ui-charts';
import { TopPagesTable, ExitPagesList, QualityScorePanel } from './ui-tables';
import { FunnelVisual } from './funnel-radar';
import { CityDistribution, TechIntelligence, DemographicEstimator } from './ui-demographics';
import { PageAnalyticsModal } from './page-analytics-modal';
import { AIInsights } from './ai-insights';

type AnalyticsTab = 'radar' | 'audience' | 'content';

export const AnalyticsDashboard = () => {
  const { stats, loading, period, setPeriod, refresh } = useAnalyticsData();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('radar');
  const [selectedPagePath, setSelectedPagePath] = useState<string | null>(null);

  // Efek untuk sinkronisasi dengan Header Global di DashboardShell
  useEffect(() => {
    const onGlobalRefresh = () => refresh();
    window.addEventListener('mks:refresh', onGlobalRefresh);
    
    // Broadcast status loading ke header shell
    window.dispatchEvent(new CustomEvent('mks:loading', { detail: loading }));

    return () => {
        window.removeEventListener('mks:refresh', onGlobalRefresh);
    };
  }, [loading, refresh]);

  if (loading && (!stats || stats.totalViews.value === 0)) {
    return (
        <div className="flex flex-col items-center justify-center p-24 gap-4 animate-fade-in">
            <LoadingSpinner size={32} className="text-brand-orange" />
            <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Menarik Data Radar...</p>
        </div>
    );
  }

  const TABS = [
    { id: 'radar', label: 'Radar Utama', icon: LayoutDashboard, desc: 'Helicopter View' },
    { id: 'audience', label: 'Profil Juragan', icon: Users, desc: 'Insight Pengunjung' },
    { id: 'content', label: 'Performa Konten', icon: FileText, desc: 'Cek Kualitas Page' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20 relative">
      <div className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md py-2.5 -mx-4 px-4 border-b border-white/5 shadow-xl transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide max-w-full pb-1">
            {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AnalyticsTab)}
                    className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all shrink-0 group ${
                    isActive ? 'bg-brand-orange border-brand-orange text-white shadow-neon' : 'bg-brand-card/50 border-white/5 text-gray-500 hover:text-white hover:border-white/20'
                    }`}
                >
                    <tab.icon size={16} className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-brand-orange'} />
                    <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest leading-none">{tab.label}</p>
                    <p className={`text-[8px] mt-0.5 font-bold ${isActive ? 'text-white/60' : 'text-gray-700'}`}>{tab.desc}</p>
                    </div>
                </button>
                );
            })}
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
                <AIInsights stats={stats} />
                
                <div className="bg-black/40 rounded-xl p-1 border border-white/10 flex">
                    {[7, 30].map(d => (
                        <button 
                            key={d}
                            onClick={() => setPeriod(d)}
                            className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all ${period === d ? 'bg-brand-orange text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                        >
                            {d}D
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6 min-h-[600px] relative">
        {activeTab === 'radar' && (
          <div className="space-y-6 animate-fade-in">
            <KPIGrid stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
               {/* RADAR CORONG & TRAFFIC CHART */}
               <div className="lg:col-span-4 flex flex-col h-full">
                  <FunnelVisual data={stats.funnel} />
               </div>
               <div className="lg:col-span-8 flex flex-col h-full">
                  <TrafficChart data={stats.trafficByDate} period={period} />
               </div>

               {/* QUALITY SCORE & PEAK HOURS */}
               <div className="lg:col-span-4 flex flex-col h-full">
                  <QualityScorePanel bounceRate={stats.bounceRate} avgPages={stats.avgPagesPerSession} />
               </div>
               <div className="lg:col-span-8 flex flex-col h-full">
                  <PeakHoursHeatmap hours={stats.hours} />
               </div>
            </div>
          </div>
        )}

        {activeTab === 'audience' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* 1. KOTA */}
                <CityDistribution cities={stats.sortedCities} total={stats.totalViews.value as number} />

                {/* 2. PROFILING */}
                <DemographicEstimator data={stats.demographics} />

                {/* 3. TEKNOLOGI (COMBINED) */}
                <TechIntelligence 
                    devices={stats.devices} 
                    osData={stats.osDist} 
                    totalViews={stats.totalViews.value as number} 
                />
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2">
                <TopPagesTable pages={stats.sortedPages} onPageClick={(path) => setSelectedPagePath(path)} />
            </div>
            <div className="lg:col-span-1 space-y-8">
                <ReferrerList referrers={stats.sortedReferrers} totalViews={stats.totalViews.value as number} />
                <ExitPagesList pages={stats.sortedExitPages} />
            </div>
          </div>
        )}
      </div>

      {selectedPagePath && <PageAnalyticsModal pagePath={selectedPagePath} onClose={() => setSelectedPagePath(null)} />}
    </div>
  );
};