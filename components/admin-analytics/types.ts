
export interface AnalyticsStats {
    totalViews: number;
    uniqueVisitors: number;
    totalActions: number;
    conversionRate: string;
    trafficByDate: Record<string, number>;
    // Updated: sortedPages now carries rich object instead of just tuple
    sortedPages: { path: string; hits: number; avgTime: string }[]; 
    devices: { mobile: number; desktop: number; tablet: number };
    sortedReferrers: [string, number][];
    hours: number[];
    newVisitors: number;
    returningVisitors: number;
    bounceRate: number;
    avgPagesPerSession: string;
    sortedExitPages: [string, number][];
    avgEngagementTime: string; // New Global Metric
}

export interface AnalyticsState {
    stats: AnalyticsStats;
    loading: boolean;
    period: number;
    setPeriod: (days: number) => void;
}
