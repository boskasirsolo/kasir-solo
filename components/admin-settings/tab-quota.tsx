
import React from 'react';
import { TabProps } from './types';
import { SettingsSection } from './ui-atoms';
import { Input } from '../ui';
import { MapPin, Monitor, AlertTriangle } from 'lucide-react';

const QuotaCard = ({ 
    icon: Icon, 
    colorClass, 
    title, 
    desc, 
    maxVal, 
    usedVal, 
    onMaxChange, 
    onUsedChange 
}: any) => {
    const remaining = Math.max(0, (maxVal || 0) - (usedVal || 0));
    
    return (
        <div className="bg-brand-dark/50 p-5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm">{title}</h4>
                    <p className="text-[10px] text-gray-500">{desc}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Max Slot / Bulan</label>
                    <Input type="number" value={maxVal || 0} onChange={onMaxChange} className="text-sm" />
                </div>
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Terpakai (Used)</label>
                    <Input type="number" value={usedVal || 0} onChange={onUsedChange} className="text-sm" />
                </div>
            </div>
            <div className="mt-4 p-2 bg-white/5 rounded border border-white/10 text-[10px] text-gray-300 text-center">
                Preview Website: "Sisa <span className="text-red-400 font-bold">{remaining}</span> dari {maxVal} Slot"
            </div>
        </div>
    );
};

export const TabQuota = ({ config, setConfig }: TabProps) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <SettingsSection title="Manajemen Kelangkaan (Scarcity)" desc="Atur kuota untuk memancing psikologi calon klien.">
                <div className="space-y-4">
                    <QuotaCard 
                        icon={MapPin}
                        colorClass="bg-red-500 text-red-500"
                        title="Slot Setup On-Site (Fisik)"
                        desc="Muncul di Halaman SEO Kota & Landing Page."
                        maxVal={config.quota_onsite_max}
                        usedVal={config.quota_onsite_used}
                        onMaxChange={(e: any) => setConfig({...config, quota_onsite_max: parseInt(e.target.value)})}
                        onUsedChange={(e: any) => setConfig({...config, quota_onsite_used: parseInt(e.target.value)})}
                    />
                    
                    <QuotaCard 
                        icon={Monitor}
                        colorClass="bg-blue-500 text-blue-500"
                        title="Slot Proyek Digital (Web/App)"
                        desc="Muncul di Halaman Services & Homepage."
                        maxVal={config.quota_digital_max}
                        usedVal={config.quota_digital_used}
                        onMaxChange={(e: any) => setConfig({...config, quota_digital_max: parseInt(e.target.value)})}
                        onUsedChange={(e: any) => setConfig({...config, quota_digital_used: parseInt(e.target.value)})}
                    />
                </div>

                <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex gap-3 items-start mt-4">
                    <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5"/>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                        <strong>Tips Strategi:</strong> Usahakan sisa slot selalu terlihat sedikit (misal: sisa 1 atau 2) untuk mendorong urgensi. Jangan biarkan "Sisa 0" kecuali Anda benar-benar full booked.
                    </p>
                </div>
            </SettingsSection>
        </div>
    );
};
