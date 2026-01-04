
import { Layout, MapPin, Share2, Settings as SettingsIcon, PieChart } from 'lucide-react';
import { SettingsTabId } from './types';

export const SETTINGS_TABS: { id: SettingsTabId; label: string; icon: any }[] = [
    { id: 'general', label: 'Umum & Hero', icon: Layout },
    { id: 'contact', label: 'Kontak & Lokasi', icon: MapPin },
    { id: 'social', label: 'Sosial & Link', icon: Share2 },
    { id: 'quota', label: 'Kuota & Slot', icon: PieChart },
    { id: 'system', label: 'Sistem & Timezone', icon: SettingsIcon },
];
