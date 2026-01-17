
import React, { useState } from 'react';
import { CalculatorProps } from './types';
import { useCalculator } from './logic';
import { CalcHeader, BaseOptionItem, AddonOptionItem, ResultCard } from './ui-parts';
import { SideDrawer } from './side-drawer';
import { Input } from '../../ui';
import { User, Phone } from 'lucide-react';

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

  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });

  const onConsult = () => {
      handleConsultation(customerInfo.name, customerInfo.phone);
  };

  return (
    <div className="bg-brand-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <CalcHeader title={data.title} subtitle={data.subtitle} />

      {/* USER INFO - MOVED HERE (Full Width Section Above the Grid) */}
      <div className="p-6 md:p-10 border-b border-white/5 bg-white/5 relative z-10">
          <div className="max-w-4xl mx-auto">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <User size={16} className="text-brand-orange"/> SIAPA NAMA JURAGAN?
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                      <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                      <Input 
                          value={customerInfo.name} 
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          placeholder="Nama Lengkap / Panggilan" 
                          className="pl-12 py-3.5 text-sm bg-black/40 border-white/10 focus:border-brand-orange"
                      />
                  </div>
                  <div className="relative">
                      <Phone className="absolute left-4 top-3.5 text-gray-500" size={18} />
                      <Input 
                          value={customerInfo.phone} 
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          placeholder="Nomor WA Aktif (Penting)" 
                          className="pl-12 py-3.5 text-sm bg-black/40 border-white/10 focus:border-brand-orange"
                      />
                  </div>
              </div>
          </div>
      </div>

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

         {/* RIGHT: TOTAL & CTA */}
         <ResultCard 
            calculation={calculation} 
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
