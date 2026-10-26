import type { ConversionCounts } from './wheeler-analytics-conversions';
export type AnalyticsSource = 'ga4' | 'gsc' | 'bing';
export interface AnalyticsConfig { gaProperty: string; gscSite: string; bingSite: string }
export interface AnalyticsRow { name: string; users?: number; views?: number; sessions?: number; clicks?: number; impressions?: number; ctr?: number; position?: number }
export interface AnalyticsReport {
 fetchedAt: string; startDate: string; endDate: string;
 totals: AnalyticsRow; daily: AnalyticsRow[]; pages: AnalyticsRow[]; queries: AnalyticsRow[]; acquisition?: AnalyticsRow[];
 conversions?: ConversionCounts | null;
 dataThrough: string | null; note?: string;
}
export interface AnalyticsResult { report: AnalyticsReport | null; error: string | null; connected: boolean }
export interface AnalyticsOverview {
 config: AnalyticsConfig; googleConnected: boolean; googleSetupReady: boolean; secretSetupReady: boolean;
 sources: Record<AnalyticsSource, AnalyticsResult>;
}
