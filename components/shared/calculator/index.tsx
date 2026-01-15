
import React, { useState } from 'react';
import { CalculatorProps } from './types';
import { useCalculator } from './logic';
import { CalcHeader, BaseOptionItem, AddonOptionItem, ResultCard } from './ui-parts';
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
      isCapturing
  } = useCalculator(data, serviceName, waNumber, serviceSlug);

  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });

  const onConsult = () => {
      handleConsultation(customerInfo.name, customerInfo.phone);
  };

  return (
    <div className="bg-brand-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <CalcHeader title={data.title} subtitle={data.subtitle} />

      <div className="grid lg:grid-cols-12">
         
         {/* LEFT: OPTIONS */}
         <div className="lg:col-span-7 p-6 md:p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-white/5">
            
            {/* USER INFO (NEW) */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                   <User size={16} className="text-brand-orange"/> Siapa Nama Juragan?
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-500" size={16} />
                        <Input 
                            value={customerInfo.name} 
                            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                            placeholder="Nama Lengkap" 
                            className="pl-10 text-xs"
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-500" size={16} />
                        <Input 
                            value={customerInfo.phone} 
                            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                            placeholder="Nomor WA Aktif" 
                            className="pl-10 text-xs"
                        />
                    </div>
                </div>
                <p className="text-[9px] text-gray-500 mt-3 italic">*Data ini buat gue hubungi balik kalau WA lo gak aktif. Tenang, privasi aman.</p>
            </div>

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
            onConsultation={onConsult} 
            hasBaseSelection={calculation.hasSelection} 
            isCapturing={isCapturing}
         />

      </div>
    </div>
  );
};
