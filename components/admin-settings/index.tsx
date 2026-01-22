
import React from 'react';
import { SiteConfig } from '../../types';
import { useSettingsLogic } from './logic';
import { SettingsSidebar } from './ui-sidebar';
import { TabGeneral } from './tab-general';
import { TabQuota } from './tab-quota';
import { TabContact } from './tab-contact';
import { TabSocial } from './tab-social';
import { TabTracking } from './tab-tracking';
import { TabSystem } from './tab-system';

export const AdminSettings = ({
  config,
  setConfig
}: {
  config: SiteConfig,
  setConfig: (c: SiteConfig) => void
}) => {
  const { state, actions } = useSettingsLogic(config, setConfig);

  const renderTab = () => {
      const props = { config, setConfig, state, actions };
      switch (state.activeTab) {
          case 'general': return <TabGeneral {...props} />;
          case 'quota': return <TabQuota {...props} />;
          case 'contact': return <TabContact {...props} />;
          case 'social': return <TabSocial {...props} />;
          case 'tracking': return <TabTracking {...props} />;
          case 'system': return <TabSystem {...props} />;
          default: return null;
      }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full min-h-[600px] animate-fade-in">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <SettingsSidebar 
            activeTab={state.activeTab} 
            setActiveTab={actions.setActiveTab}
            onSave={actions.saveSettings}
            isSaving={state.isSaving}
        />

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 bg-brand-card border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>
            {renderTab()}
        </div>
    </div>
  );
};
