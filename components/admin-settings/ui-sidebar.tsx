
import React from 'react';
import { Save } from 'lucide-react';
import { Button, LoadingSpinner } from '../ui';
import { SETTINGS_TABS } from './constants';
import { SettingsTabId } from './types';

export const SettingsSidebar = ({ 
    activeTab, 
    setActiveTab, 
    onSave, 
    isSaving 
}: { 
    activeTab: SettingsTabId, 
    setActiveTab: (id: SettingsTabId) => void,
    onSave: () => void,
    isSaving: boolean
}) => {
    return (
        <div className="w-full md:w-64 shrink-0 space-y-2">
            <div className="p-4 mb-4 bg-brand-orange/10 border border-brand-orange/20 rounded-xl">
                <h3 className="text-white font-bold text-lg">Konfigurasi</h3>
                <p className="text-xs text-gray-400">Pusat kontrol website.</p>
            </div>
            
            {SETTINGS_TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                        activeTab === tab.id 
                        ? 'bg-brand-card text-white border-l-4 border-brand-orange shadow-lg' 
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <tab.icon size={18} className={activeTab === tab.id ? 'text-brand-orange' : ''} />
                    {tab.label}
                </button>
            ))}

            <Button onClick={onSave} disabled={isSaving} className="w-full mt-8 shadow-neon py-3 text-sm">
                {isSaving ? <LoadingSpinner size={16}/> : <><Save size={16} /> SIMPAN SEMUA</>}
            </Button>
        </div>
    );
};
