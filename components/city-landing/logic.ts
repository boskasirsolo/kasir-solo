
import { useState, useEffect } from 'react';
import { getCityData, TARGET_CITIES, supabase } from '../../utils';
import { CityData, QuotaInfo, CityLogicProps } from './types';

export const useCityLogic = ({ citySlug, config }: CityLogicProps) => {
    const [cityData, setCityData] = useState<CityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [citiesList, setCitiesList] = useState<CityData[]>(TARGET_CITIES as CityData[]);

    // Quota Calculation
    const onsiteMax = config?.quota_onsite_max || 4;
    const onsiteUsed = config?.quota_onsite_used || 0;
    
    const quotaInfo: QuotaInfo = {
        max: onsiteMax,
        used: onsiteUsed,
        remaining: Math.max(0, onsiteMax - onsiteUsed)
    };

    useEffect(() => {
        const loadCity = async () => {
            setLoading(true);
            
            // 1. Cek di Hardcoded (Fastest)
            const staticCity = getCityData(citySlug || '');
            if (staticCity) {
                setCityData(staticCity as CityData);
                setLoading(false);
                return;
            }

            // 2. Cek di Database (Dynamic)
            if (supabase && citySlug) {
                const { data } = await supabase
                    .from('target_cities')
                    .select('*')
                    .eq('slug', citySlug)
                    .maybeSingle(); 
                
                if (data) {
                    setCityData(data as CityData);
                    setLoading(false);
                    return;
                }
            }

            // 3. Not Found
            setLoading(false);
        };

        const loadList = async () => {
            if (supabase) {
                const { data } = await supabase
                    .from('target_cities')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (data && data.length > 0) {
                    setCitiesList(data as CityData[]);
                }
            }
        };

        loadCity();
        loadList();
    }, [citySlug]);

    const isKandang = cityData?.type === 'Kandang';

    return {
        cityData,
        citiesList,
        loading,
        isKandang,
        quotaInfo
    };
};
