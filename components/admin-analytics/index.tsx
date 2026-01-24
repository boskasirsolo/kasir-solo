
import React, { useState } from 'react';
import { 
    LayoutDashboard, 
    Users, 
    FileText, 
    Globe, 
    Zap 
} from 'lucide-react';
import { useAnalyticsData } from './logic';
import { LoadingSpinner } from '../ui';
import { DashboardHeader } from './ui-controls';
import { KPIGrid, DeviceStats, ReferrerList } from './ui-cards';
import { TrafficChart, PeakHoursHeatmap } from './ui-charts';
import { TopPagesTable, ExitPagesList, QualityScorePanel } from './ui-tables';
import { FunnelVisual, GoldenPathsVisual } from './funnel-radar';
import { CityDistribution, OSDistribution, DemographicEstimator } from './ui-demographics';
import { PageAnalyticsModal } from './page-analytics-modal';
import { AIInsights } from './ai-insights';

type AnalyticsTab = 'radar' | 'audience' | 'content';

export const AnalyticsDashboard = () => {
  const { stats, loading, period, setPeriod, refresh } = useAnalyticsData();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('radar');
  const [selectedPagePath, setSelectedPagePath] = useState<string | null>(null);

  if (loading && (!stats || stats.totalViews === 0)) {
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
      <DashboardHeader 
        period={period} 
        setPeriod={setPeriod} 
        onRefresh={refresh} 
        isRefreshing={loading}
        aiInsights={<AIInsights stats={stats} />}
      />

      <div className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md py-2.5 -mx-4 px-4 border-b border-white/5 shadow-xl transition-all">
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
      </div>

      <div className="space-y-6 min-h-[600px] relative">
        {activeTab === 'radar' && (
          <div className="space-y-6 animate-fade-in">
            <KPIGrid stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
               <div className="flex flex-col h-full">
                  <ReferrerList referrers={stats.sortedReferrers} totalViews={stats.totalViews} />
               </div>
               
               <div className="flex flex-col h-full">
                  <FunnelVisual data={stats.funnel} />
               </div>
               
               <div className="flex flex-col h-full">
                  <GoldenPathsVisual data={stats.funnel} />
               </div>
            </div>

            <div className="bg-brand-dark/50 border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <TrafficChart data={stats.trafficByDate} period={period} />
            </div>
          </div>
        )}

        {activeTab === 'audience' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4"><CityDistribution cities={stats.sortedCities} total={stats.totalViews} /></div>
                <div className="lg:col-span-4"><DemographicEstimator data={stats.demographics} /></div>
                <div className="lg:col-span-4 space-y-6">
                    <OSDistribution data={stats.osDist} />
                    <DeviceStats devices={stats.devices} totalViews={stats.totalViews} />
                </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2"><TopPagesTable pages={stats.sortedPages} onPageClick={(path) => setSelectedPagePath(path)} /></div>
            <div className="lg:col-span-1 space-y-8">
                <QualityScorePanel bounceRate={stats.bounceRate} avgPages={stats.avgPagesPerSession} />
                <ExitPagesList pages={stats.sortedExitPages} />
            </div>
          </div>
        )}
      </div>

      {selectedPagePath && <PageAnalyticsModal pagePath={selectedPagePath} onClose={() => setSelectedPagePath(null)} />}
    </div>
  );
};
