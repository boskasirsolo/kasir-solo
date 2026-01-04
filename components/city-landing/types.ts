
import { SiteConfig } from '../../types';

export type StrategyType = 'Kandang' | 'Ekspansi';

export interface CityData {
    name: string;
    slug: string;
    type: StrategyType;
}

export interface QuotaInfo {
    max: number;
    used: number;
    remaining: number;
}

export interface CityLogicProps {
    citySlug?: string;
    config?: SiteConfig;
}
