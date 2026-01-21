
import React, { useState } from 'react';
import { LoadingSpinner } from '../ui';
import { useAnalyticsData } from './logic';
import { DashboardHeader, GhostLinkCopier } from './ui-controls';
import { KPIGrid, DeviceStats, ReferrerList } from './ui-cards';
import { TrafficChart, PeakHoursHeatmap, RetentionChart } from './ui-charts';
import { TopPagesTable, ExitPagesList, QualityScorePanel } from './ui-tables';
import { CityDistribution, OSDistribution, DemographicEstimator } from './ui-demographics';
import { PageAnalyticsModal } from './page-analytics-modal';
import { FunnelRadar } from './funnel-radar';
import { LayoutDashboard, Users, FileText, Globe, Zap } from 'lucide-react';

type AnalyticsTab = 'radar' | 'audience' | 'content' | 'acquisition';

export const AnalyticsDashboard = () => {
  const { stats, loading, period, setPeriod, refresh } = useAnalyticsData();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('radar');
  const [selectedPagePath, setSelectedPagePath] = useState<string | null>(null);

  if (loading && stats.totalViews === 0) return <div className="flex justify-center p-20"><LoadingSpinner size={32} /></div>;

  const TABS = [
    { id: 'radar', label: 'Radar Utama', icon: LayoutDashboard, desc: 'Helicopter View' },
    { id: 'audience', label: 'Profil Juragan', icon: Users, desc: 'Insight Pengunjung' },
    { id: 'content', label: 'Performa Konten', icon: FileText, desc: 'Cek Kualitas Page' },
    { id: 'acquisition', label: 'Pintu Masuk', icon: Globe, desc: 'Asal Trafik' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20 relative">
      <DashboardHeader period={period} setPeriod={setPeriod} onRefresh={refresh} isRefreshing={loading} />

      <div className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-white/5 shadow-xl transition-all">
        <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide max-w-full pb-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AnalyticsTab)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all shrink-0 group ${
                  isActive ? 'bg-brand-orange border-brand-orange text-white shadow-neon' : 'bg-brand-card/50 border-white/5 text-gray-500 hover:text-white hover:border-white/20'
                }`}
              >
                <tab.icon size={18} className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-brand-orange'} />
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">{tab.label}</p>
                  <p className={`text-[8px] mt-1 font-bold ${isActive ? 'text-white/60' : 'text-gray-700'}`}>{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-8 min-h-[600px] relative">
        {activeTab === 'radar' && (
          <div className="space-y-8 animate-fade-in">
            <KPIGrid stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-3"><FunnelRadar data={stats.funnel} /></div>
               <div className="lg:col-span-3"><div className="bg-brand-dark/50 border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden"><TrafficChart data={stats.trafficByDate} period={period} /></div></div>
            </div>
          </div>
        )}

        {activeTab === 'audience' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4"><CityDistribution cities={stats.sortedCities} total={stats.totalViews} /></div>
                <div className="lg:col-span-4"><DemographicEstimator data={stats.demographics} /></div>
                <div className="lg:col-span-4 space-y-6">
                    <OSDistribution data={stats.osDist} />
                    <DeviceStats devices={stats.devices} totalViews={stats.totalViews} />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4"><RetentionChart newUsers={stats.newVisitors} returningUsers={stats.returningVisitors} /></div>
                <div className="lg:col-span-8"><div className="bg-brand-dark/50 border border-white/5 rounded-3xl p-6 shadow-2xl"><PeakHoursHeatmap hours={stats.hours} /></div></div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2"><TopPagesTable pages={stats.sortedPages} onPageClick={(path) => setSelectedPagePath(path)} /></div>
            <div className="lg:col-span-1 space-y-8"><QualityScorePanel bounceRate={stats.bounceRate} avgPages={stats.avgPagesPerSession} /><ExitPagesList pages={stats.sortedExitPages} /></div>
          </div>
        )}

        {activeTab === 'acquisition' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-8"><ReferrerList referrers={stats.sortedReferrers} totalViews={stats.totalViews} /></div>
            <div className="lg:col-span-4"><GhostLinkCopier /></div>
          </div>
        )}
      </div>

      <div className="mt-12 p-6 bg-brand-orange/5 border border-white/5 rounded-3xl flex items-center gap-4 text-gray-500">
          <Zap size={24} className="text-brand-orange opacity-30 animate-pulse" />
          <div><p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">MKS Surveillance System v3.1</p><p className="text-[9px] leading-relaxed">Sistem ini memantau interaksi user, lokasi, dan perangkat secara anonim untuk optimasi konversi. Data demografi bersifat estimasi berdasarkan pola perilaku.</p></div>
      </div>

      {selectedPagePath && <PageAnalyticsModal pagePath={selectedPagePath} onClose={() => setSelectedPagePath(null)} />}
    </div>
  );
};
