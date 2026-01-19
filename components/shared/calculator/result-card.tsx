
import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { SummaryStep } from './summary-step';
import { FormStep } from './form-step';

export const ResultCard = ({ 
    calculation, 
    customerInfo,
    setCustomerInfo,
    onConsultation,
    onShadowCapture,
    hasBaseSelection,
    isCapturing = false
}: { 
    calculation: any, 
    customerInfo: any,
    setCustomerInfo: any,
    onConsultation: () => void,
    onShadowCapture: () => void,
    hasBaseSelection: boolean,
    isCapturing?: boolean
}) => {
    // Wizard State
    const [step, setStep] = useState(1);

    return (
        <div className="lg:col-span-5 p-4 md:p-10 bg-black/40 flex flex-col h-full" id="result-card-anchor">
            <div className="bg-brand-card border border-white/10 rounded-2xl relative overflow-hidden shadow-2xl flex flex-col transition-all duration-500 h-full max-h-[800px]">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Calculator size={120} />
                </div>
                
                {step === 1 ? (
                    <SummaryStep 
                        calculation={calculation} 
                        hasBaseSelection={hasBaseSelection} 
                        onNext={() => hasBaseSelection && setStep(2)} 
                    />
                ) : (
                    <FormStep 
                        customerInfo={customerInfo}
                        setCustomerInfo={setCustomerInfo}
                        onConsultation={onConsultation}
                        onBack={() => setStep(1)}
                        onShadowCapture={onShadowCapture}
                        isCapturing={isCapturing}
                    />
                )}
            </div>
        </div>
    );
};
