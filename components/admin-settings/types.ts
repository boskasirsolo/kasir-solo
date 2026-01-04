
import { SiteConfig } from '../../types';

export type SettingsTabId = 'general' | 'contact' | 'social' | 'quota' | 'system';

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
}

export interface SettingsActions {
    setActiveTab: (id: SettingsTabId) => void;
    setMagicContext: (val: string) => void;
    handleImageSelect: (target: 'about' | 'founder', file: File) => void;
    saveSettings: () => Promise<void>;
    generateHeroContent: () => Promise<void>;
}

export interface TabProps {
    config: SiteConfig;
    setConfig: (c: SiteConfig) => void;
    state: SettingsState;
    actions: SettingsActions;
}
