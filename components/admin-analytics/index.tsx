
import React, { useState } from 'react';
import { LoadingSpinner } from '../ui';
import { useAnalyticsData } from './logic';
import { DashboardHeader, GhostLinkCopier } from './ui-controls';
import { KPIGrid, DeviceStats, ReferrerList } from './ui-cards';
import { TrafficChart, PeakHoursHeatmap, RetentionChart } from './ui-charts';
import { TopPagesTable, ExitPagesList, QualityScorePanel } from './ui-tables';
import { PageAnalyticsModal } from './page-analytics-modal';

export const AnalyticsDashboard = () => {
  const { stats, loading, period, setPeriod } = useAnalyticsData();
  const [selectedPagePath, setSelectedPagePath] = useState<string | null>(null);

  if (loading) return <div className="flex justify-center p-20"><LoadingSpinner size={32} /></div>;

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">
      
      {/* 1. Header & Controls */}
      <DashboardHeader period={period} setPeriod={setPeriod} />

      {/* 2. KPI Cards */}
      <KPIGrid stats={stats} />

      {/* 3. Main Traffic & Behavior Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Traffic Chart (2 Cols) */}
         <div className="lg:col-span-2">
             <div className="bg-brand-dark border border-white/5 rounded-xl p-6 relative overflow-hidden h-full">
                <TrafficChart data={stats.trafficByDate} period={period} />
                <PeakHoursHeatmap hours={stats.hours} />
             </div>
         </div>

         {/* Device & Referrer (1 Col) */}
         <div className="space-y-6">
             <DeviceStats devices={stats.devices} totalViews={stats.totalViews} />
             {/* UPDATED: Pass totalViews for percentage calculation */}
             <ReferrerList referrers={stats.sortedReferrers} totalViews={stats.totalViews} />
         </div>
      </div>

      {/* 4. Demographics & Deep Behavior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RetentionChart newUsers={stats.newVisitors} returningUsers={stats.returningVisitors} />
          <QualityScorePanel bounceRate={stats.bounceRate} avgPages={stats.avgPagesPerSession} />
          <ExitPagesList pages={stats.sortedExitPages} />
      </div>

      {/* 5. Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TopPagesTable 
            pages={stats.sortedPages} 
            onPageClick={(path) => setSelectedPagePath(path)} // Handle click
          />
          <div className="lg:col-span-1">
             <GhostLinkCopier />
          </div>
      </div>

      {/* MODAL DETAIL (The God Mode Drill-down) */}
      {selectedPagePath && (
          <PageAnalyticsModal 
            pagePath={selectedPagePath} 
            onClose={() => setSelectedPagePath(null)} 
          />
      )}

    </div>
  );
};
