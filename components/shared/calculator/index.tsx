
import React, { useState } from 'react';
import { CalculatorProps } from './types';
import { useCalculator } from './logic';
import { CalcHeader, BaseOptionItem, AddonOptionItem, ResultCard } from './ui-parts';
import { SideDrawer } from './side-drawer';

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
      isCapturing,
      activeDetailItem,
      setActiveDetailItem
  } = useCalculator(data, serviceName, waNumber, serviceSlug);

  // Expanded Form State
  const [customerInfo, setCustomerInfo] = useState({ 
      name: '', 
      phone: '',
      company: '',
      address: '',
      category: '',
      customCategory: ''
  });

  const onConsult = () => {
      const finalCategory = customerInfo.category === 'Lainnya' 
        ? customerInfo.customCategory 
        : customerInfo.category;

      handleConsultation({
          name: customerInfo.name,
          phone: customerInfo.phone,
          company: customerInfo.company,
          address: customerInfo.address,
          category: finalCategory
      });
  };

  return (
    <div className="bg-brand-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <CalcHeader title={data.title} subtitle={data.subtitle} />

      <div className="grid lg:grid-cols-12 relative z-10">
         
         {/* LEFT: OPTIONS */}
         <div className="lg:col-span-7 p-6 md:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-white/5">
            
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

            {/* STEP 2: ADDONS */}
            <div>
               <h4 className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-[10px] font-bold">2</span>
                  {data.addonLabel}
               </h4>
               <div className="grid md:grid-cols-2 gap-3">
                  {data.addons.map(opt => (
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

         </div>

         {/* RIGHT: FORM, TOTAL & CTA */}
         <ResultCard 
            calculation={calculation} 
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            onConsultation={onConsult} 
            hasBaseSelection={calculation.hasSelection} 
            isCapturing={isCapturing}
         />

      </div>

      {/* Side Detail Drawer */}
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
