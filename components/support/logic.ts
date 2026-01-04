
import { useState, useEffect, useMemo } from 'react';
import { supabase, INITIAL_DOWNLOADS, INITIAL_TUTORIALS, INITIAL_FAQS } from '../../utils';
import { DownloadItem, Tutorial, FAQ } from '../../types';
import { SupportState, SupportActions } from './types';

export const useSupportLogic = () => {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDownloadTab, setActiveDownloadTab] = useState('all');
    const [selectedDownload, setSelectedDownload] = useState<DownloadItem | null>(null);
    
    // Pagination
    const [pageFiles, setPageFiles] = useState(1);
    const [pageVideos, setPageVideos] = useState(1);
    const [pageFaqs, setPageFaqs] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            if (!supabase) {
                setDownloads(INITIAL_DOWNLOADS);
                setTutorials(INITIAL_TUTORIALS);
                setFaqs(INITIAL_FAQS);
                setLoading(false);
                return;
            }

            try {
                const [dlRes, vidRes, faqRes] = await Promise.all([
                    supabase.from('downloads').select('*').order('created_at', { ascending: false }),
                    supabase.from('tutorials').select('*').order('created_at', { ascending: false }),
                    supabase.from('faqs').select('*').order('created_at', { ascending: false })
                ]);

                if (dlRes.data) setDownloads(dlRes.data);
                if (vidRes.data) setTutorials(vidRes.data);
                if (faqRes.data) setFaqs(faqRes.data);
            } catch (e) {
                console.error("Support Fetch Error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        setPageFiles(1);
        setPageVideos(1);
        setPageFaqs(1);
    }, [searchTerm, activeDownloadTab]);

    const filteredDownloads = useMemo(() => {
        return downloads.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTab = activeDownloadTab === 'all' || item.category === activeDownloadTab;
            return matchesSearch && matchesTab;
        });
    }, [downloads, searchTerm, activeDownloadTab]);

    const filteredTutorials = useMemo(() => 
        tutorials.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase())), 
        [tutorials, searchTerm]
    );

    const filteredFaqs = useMemo(() => 
        faqs.filter(f => f.question.toLowerCase().includes(searchTerm.toLowerCase())), 
        [faqs, searchTerm]
    );

    const paginate = <T,>(data: T[], page: number, size: number) => {
        const start = (page - 1) * size;
        return data.slice(start, start + size);
    };

    return {
        state: {
            downloads, tutorials, faqs, loading, searchTerm, activeDownloadTab,
            pageFiles, pageVideos, pageFaqs, selectedDownload
        } as SupportState,
        computed: {
            filteredDownloads, filteredTutorials, filteredFaqs, paginate
        },
        actions: {
            setSearchTerm, setActiveDownloadTab,
            setPageFiles, setPageVideos, setPageFaqs,
            setSelectedDownload
        } as SupportActions
    };
};
