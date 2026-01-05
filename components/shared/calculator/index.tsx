
import React from 'react';
import { CalculatorProps } from './types';
import { useCalculator } from './logic';
import { CalcHeader, BaseOptionItem, AddonOptionItem, ResultCard } from './ui-parts';

export const InvestmentSimulator = ({ data, serviceName }: CalculatorProps) => {
  const { 
      selectedBase, setSelectedBase, 
      selectedAddons, toggleAddon, 
      calculation, 
      handleConsultation 
  } = useCalculator(data, serviceName);

  return (
    <div className="bg-brand-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <CalcHeader title={data.title} subtitle={data.subtitle} />

      <div className="grid lg:grid-cols-12">
         
         {/* LEFT: OPTIONS */}
         <div className="lg:col-span-7 p-6 md:p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-white/5">
            
            {/* STEP 1: BASE */}
            <div>
               <h4 className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs">1</span>
                  {data.baseLabel}
               </h4>
               <div className="grid gap-3">
                  {data.baseOptions.map(opt => (
                     <BaseOptionItem 
                        key={opt.id} 
                        option={opt} 
                        isSelected={selectedBase === opt.id} 
                        onSelect={() => setSelectedBase(opt.id)} 
                     />
                  ))}
               </div>
            </div>

            {/* STEP 2: ADDONS */}
            <div>
               <h4 className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs">2</span>
                  {data.addonLabel}
               </h4>
               <div className="grid md:grid-cols-2 gap-3">
                  {data.addons.map(opt => (
                     <AddonOptionItem 
                        key={opt.id} 
                        option={opt} 
                        isSelected={selectedAddons.includes(opt.id)} 
                        onToggle={() => toggleAddon(opt.id)} 
                     />
                  ))}
               </div>
            </div>

         </div>

         {/* RIGHT: TOTAL & CTA */}
         <ResultCard 
            calculation={calculation} 
            onConsultation={handleConsultation} 
            hasBaseSelection={calculation.hasSelection} 
         />

      </div>
    </div>
  );
};
