
import { SiteConfig } from '../../types';

export type SettingsTabId = 'general' | 'contact' | 'social' | 'quota' | 'tracking' | 'system';

export interface SettingsState {
    activeTab: SettingsTabId;
    isSaving: boolean;
    isGenerating: boolean;
    magicContext: string;
    // Image States
    aboutImageFile: File | null;
    aboutImagePreview: string;
    founderImageFile: File | null;
    founderImagePreview: string;
    // NEW: Real-time status for maintenance toggle
    isTogglingMaintenance: boolean;
}

export interface SettingsActions {
    setActiveTab: (id: SettingsTabId) => void;
    setMagicContext: (val: string) => void;
    handleImageSelect: (target: 'about' | 'founder', file: File) => void;
    handleUrlSelect: (target: 'about' | 'founder', url: string) => void;
    saveSettings: () => Promise<void>;
    generateHeroContent: () => Promise<void>;
    toggleMaintenanceInstant: () => Promise<void>;
}

export interface TabProps {
    config: SiteConfig;
    setConfig: (c: SiteConfig) => void;
    state: SettingsState;
    actions: SettingsActions;
}
