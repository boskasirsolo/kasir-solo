
import React, { useState } from 'react';
import { CalculatorProps } from './types';
import { useCalculator } from './logic';
import { CalcHeader } from './header';
import { ResultCard } from './result-card';
import { OptionsPanel } from './options-panel';
import { MobileStickyFooter } from './mobile-footer';
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

  return (
    <div className="bg-brand-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative pb-20 lg:pb-0">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <CalcHeader title={data.title} subtitle={data.subtitle} />

      <div className="grid lg:grid-cols-12 relative z-10">
         
         {/* LEFT: OPTIONS PANEL */}
         <OptionsPanel 
            data={data}
            selectedBase={selectedBase}
            setSelectedBase={setSelectedBase}
            selectedAddons={selectedAddons}
            toggleAddon={toggleAddon}
            setActiveDetailItem={setActiveDetailItem}
         />

         {/* RIGHT: RESULT & FORM */}
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

      {/* MOBILE FOOTER */}
      <MobileStickyFooter 
        total={calculation.total.min} 
        onContinue={scrollToResult} 
      />

      {/* DRAWER */}
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
