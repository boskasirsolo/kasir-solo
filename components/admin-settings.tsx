
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SiteConfig } from '../types';
import { Input, TextArea } from './ui';

export const AdminSettings = ({
  config,
  setConfig
}: {
  config: SiteConfig,
  setConfig: (c: SiteConfig) => void
}) => {
  return (
    <div className="max-w-xl space-y-4">
       <h3 className="text-white font-bold">SEO & Config</h3>
       <div>
         <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Hero Title</label>
         <Input value={config.heroTitle} onChange={(e) => setConfig({...config, heroTitle: e.target.value})} />
       </div>
       <div>
         <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Hero Subtitle</label>
         <TextArea value={config.heroSubtitle} onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})} className="h-32" />
       </div>
       <div className="p-4 bg-brand-dark rounded border border-white/10 flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle2 size={16} /> System Operational
       </div>
    </div>
  );
};
