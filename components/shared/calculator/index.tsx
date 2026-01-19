
import React, { useState } from 'react';
import { CalculatorProps } from './types';
import { useCalculator } from './logic';
import { CalcHeader, BaseOptionItem, AddonOptionItem, ResultCard } from './ui-parts';
import { SideDrawer } from './side-drawer';
import { Zap, ShieldCheck, ArrowDown } from 'lucide-react';
import { formatRupiah } from '../../../utils';

interface ExtendedCalculatorProps extends CalculatorProps {
    waNumber?: string;
    serviceSlug?: string;
}

export const InvestmentSimulator = ({ data, serviceName, waNumber, serviceSlug }: ExtendedCalculatorProps) => {
  const { 
      selectedBase, setSelectedBase, 
      selectedAddons, toggleAddon, 
      calculation, 
      handleConsultation,
      handleShadowCapture,
      isCapturing,
      activeDetailItem,
      setActiveDetailItem
  } = useCalculator(data, serviceName, waNumber, serviceSlug);

  const [customerInfo, setCustomerInfo] = useState({ 
      name: '', 
      phone: '',
      company: '',
      address: '',
      category: '',
      customCategory: '',
      scale: '',
      customScale: ''
  });

  const onConsult = () => {
      const finalCategory = customerInfo.category === 'Lainnya' 
        ? customerInfo.customCategory 
        : customerInfo.category;
      
      const finalScale = customerInfo.scale === 'Lainnya'
        ? customerInfo.customScale
        : customerInfo.scale;

      handleConsultation({
          name: customerInfo.name,
          phone: customerInfo.phone,
          company: customerInfo.company,
          address: customerInfo.address,
          category: finalCategory,
          scale: finalScale
      });
  };

  const onShadow = () => {
      const finalScale = customerInfo.scale === 'Lainnya'
        ? customerInfo.customScale
        : customerInfo.scale;

      handleShadowCapture({
          ...customerInfo,
          scale: finalScale
      });
  };

  const scrollToResult = () => {
      const el = document.getElementById('result-card-anchor');
      if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
      }
  };

  // Grouping Addons Logic
  const basicAddons = data.addons.filter(a => !a.tier || a.tier === 'basic');
  const advancedAddons = data.addons.filter(a => a.tier === 'advanced');

  return (
    <div className="bg-brand-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative pb-20 lg:pb-0">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <CalcHeader title={data.title} subtitle={data.subtitle} />

      <div className="grid lg:grid-cols-12 relative z-10">
         
         {/* LEFT: OPTIONS */}
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

         {/* RIGHT: FORM, TOTAL & CTA */}
         <ResultCard 
            calculation={calculation} 
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            onConsultation={onConsult}
            onShadowCapture={onShadow}
            hasBaseSelection={calculation.hasSelection} 
            isCapturing={isCapturing}
         />

      </div>

      {/* MOBILE STICKY FOOTER (Total + Action) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000] p-4 bg-brand-dark/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] animate-fade-in">
          <div className="flex justify-between items-center gap-4">
              <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Estimasi Total</p>
                  <p className="text-lg font-display font-bold text-white leading-none mt-1">{formatRupiah(calculation.total.min)}</p>
              </div>
              <button 
                onClick={scrollToResult}
                className="px-6 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-neon flex items-center gap-2 text-sm"
              >
                  LANJUT <ArrowDown size={16} />
              </button>
          </div>
      </div>

      {activeDetailItem && (
          <SideDrawer 
            item={activeDetailItem} 
            onClose={() => setActiveDetailItem(null)}
            serviceName={serviceName}
            waNumber={waNumber} 
          />
      )}
    </div>
  );
};
