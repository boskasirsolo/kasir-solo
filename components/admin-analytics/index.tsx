
import React, { useState } from 'react';
import { LoadingSpinner } from '../ui';
import { useAnalyticsData } from './logic';
import { DashboardHeader, GhostLinkCopier } from './ui-controls';
import { KPIGrid, DeviceStats, ReferrerList } from './ui-cards';
import { TrafficChart, PeakHoursHeatmap, RetentionChart } from './ui-charts';
import { TopPagesTable, ExitPagesList, QualityScorePanel } from './ui-tables';
import { PageAnalyticsModal } from './page-analytics-modal';
import { FunnelRadar } from './funnel-radar'; // NEW

export const AnalyticsDashboard = () => {
  const { stats, loading, period, setPeriod } = useAnalyticsData();
  const [selectedPagePath, setSelectedPagePath] = useState<string | null>(null);

  if (loading) return <div className="flex justify-center p-20"><LoadingSpinner size={32} /></div>;

  return (
    <div className="space-y-6 animate-fade-in pb-20 relative">
      
      {/* 1. Header & Global Controls */}
      <DashboardHeader period={period} setPeriod={setPeriod} />

      {/* 2. Main KPI Center */}
      <KPIGrid stats={stats} />

      {/* 3. MARKETING FUNNEL (CORONG CUAN) - HIGHLIGHT NEW FEATURE */}
      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <FunnelRadar data={stats.funnel} />
      </div>

      {/* 4. Traffic Behavior Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* LEFT: Main Traffic & Time Trends (2/3) */}
         <div className="lg:col-span-2">
             <div className="bg-brand-dark/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden h-full shadow-2xl">
                <TrafficChart data={stats.trafficByDate} period={period} />
                <PeakHoursHeatmap hours={stats.hours} />
             </div>
         </div>

         {/* RIGHT: Demographics (1/3) */}
         <div className="space-y-6">
             <DeviceStats devices={stats.devices} totalViews={stats.totalViews} />
             <ReferrerList referrers={stats.sortedReferrers} totalViews={stats.totalViews} />
         </div>
      </div>

      {/* 5. Deep Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RetentionChart newUsers={stats.newVisitors} returningUsers={stats.returningVisitors} />
          <QualityScorePanel bounceRate={stats.bounceRate} avgPages={stats.avgPagesPerSession} />
          <ExitPagesList pages={stats.sortedExitPages} />
      </div>

      {/* 6. Content War Room */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TopPagesTable 
            pages={stats.sortedPages} 
            onPageClick={(path) => setSelectedPagePath(path)} 
          />
          <div className="lg:col-span-1">
             <GhostLinkCopier />
          </div>
      </div>

      {/* MODAL: Page Deep Dive */}
      {selectedPagePath && (
          <PageAnalyticsModal 
            pagePath={selectedPagePath} 
            onClose={() => setSelectedPagePath(null)} 
          />
      )}

    </div>
  );
};
