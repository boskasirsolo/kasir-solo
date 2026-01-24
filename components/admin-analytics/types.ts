
export interface FunnelStage {
    label: string;
    count: number;
    percentage: number;
    dropOff: number;
    icon: any;
    color: string;
}

export interface FunnelStats {
    stages: FunnelStage[];
    topPaths: { path: string; count: number }[];
    conversionRate: number;
}

export interface MetricTrend {
    value: string | number;
    percentage: number;
}

export interface AnalyticsStats {
    totalViews: MetricTrend;
    uniqueVisitors: MetricTrend;
    totalActions: MetricTrend;
    conversionRate: MetricTrend;
    trafficByDate: Record<string, number>;
    sortedPages: { path: string; hits: number; avgTime: string }[]; 
    devices: { mobile: number; desktop: number; tablet: number };
    osDist: Record<string, number>;
    sortedCities: [string, number][];
    demographics: {
        age: Record<string, number>;
        gender: { male: number; female: number };
    };
    sortedReferrers: [string, number][];
    hours: number[];
    newVisitors: number;
    returningVisitors: number;
    bounceRate: number;
    avgPagesPerSession: string;
    sortedExitPages: [string, number][];
    avgEngagementTime: string; 
    funnel: FunnelStats;
}

export interface AnalyticsState {
    stats: AnalyticsStats;
    loading: boolean;
    period: number;
    setPeriod: (days: number) => void;
}
