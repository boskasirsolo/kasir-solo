
import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import { BaseOptionItem, AddonOptionItem } from './options';
import { CalcData, CalcOption } from './types';

interface OptionsPanelProps {
    data: CalcData;
    selectedBase: string | null;
    setSelectedBase: (id: string) => void;
    selectedAddons: string[];
    toggleAddon: (id: string) => void;
    setActiveDetailItem: (item: CalcOption) => void;
}

export const OptionsPanel = ({
    data,
    selectedBase,
    setSelectedBase,
    selectedAddons,
    toggleAddon,
    setActiveDetailItem
}: OptionsPanelProps) => {
    // Grouping Addons Logic
    const basicAddons = data.addons.filter(a => !a.tier || a.tier === 'basic');
    const advancedAddons = data.addons.filter(a => a.tier === 'advanced');

    return (
        <div className="lg:col-span-7 p-4 md:p-10 space-y-8 md:space-y-10 border-b lg:border-b-0 lg:border-r border-white/5">
            
            {/* STEP 1: BASE */}
            <div>
               <h4 className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  {data.baseLabel}
               </h4>
               <div className="grid gap-3">
                  {data.baseOptions.map(opt => (
                     <BaseOptionItem 
                        key={opt.id} 
                        option={opt} 
                        isSelected={selectedBase === opt.id} 
                        onSelect={() => setSelectedBase(opt.id)}
                        onDetail={() => setActiveDetailItem(opt)} 
                     />
                  ))}
               </div>
            </div>

            {/* STEP 2: GROUPED ADDONS */}
            <div className="space-y-8">
               <h4 className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-[10px] font-bold">2</span>
                  {data.addonLabel}
               </h4>

               {/* BASIC ADDONS */}
               {basicAddons.length > 0 && (
                  <div className="space-y-4">
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShieldCheck size={14} className="text-blue-400" /> Basic Support
                     </p>
                     <div className="grid md:grid-cols-2 gap-3">
                        {basicAddons.map(opt => (
                           <AddonOptionItem 
                              key={opt.id} 
                              option={opt} 
                              isSelected={selectedAddons.includes(opt.id)} 
                              onToggle={() => toggleAddon(opt.id)}
                              onDetail={() => setActiveDetailItem(opt)} 
                           />
                        ))}
                     </div>
                  </div>
               )}

               {/* ADVANCED ADDONS */}
               {advancedAddons.length > 0 && (
                  <div className="space-y-4">
                     <p className="text-[10px] text-brand-orange font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <Zap size={14} className="text-brand-orange" /> Advanced Power-Ups
                     </p>
                     <div className="grid md:grid-cols-2 gap-3">
                        {advancedAddons.map(opt => (
                           <AddonOptionItem 
                              key={opt.id} 
                              option={opt} 
                              isSelected={selectedAddons.includes(opt.id)} 
                              onToggle={() => toggleAddon(opt.id)}
                              onDetail={() => setActiveDetailItem(opt)} 
                           />
                        ))}
                     </div>
                  </div>
               )}
            </div>

         </div>
    );
};
