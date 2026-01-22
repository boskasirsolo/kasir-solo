
import React from 'react';
import { SectionHeader } from '../ui';
import { useCheckoutLogic } from './logic';
import { EmptyCartView } from './ui-parts';
import { SuccessView } from './sections/success-view';
import { CartSummary } from './sections/cart-summary';
import { ShippingForm } from './sections/shipping-form';
import { TermsModal } from './terms-modal';
import { SiteConfig } from '../../types';
import { Check, ShoppingBag, Truck } from 'lucide-react';

const Stepper = ({ currentStep }: { currentStep: number }) => (
    <div className="flex items-center justify-center mb-10 max-w-md mx-auto">
        <div className={`flex flex-col items-center relative z-10 ${currentStep >= 1 ? 'text-brand-orange' : 'text-gray-500'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                currentStep >= 1 
                ? 'bg-brand-orange text-white border-brand-orange shadow-neon' 
                : 'bg-brand-dark border-gray-600 text-gray-500'
            }`}>
                {currentStep > 1 ? <Check size={20} /> : <ShoppingBag size={18} />}
            </div>
            <span className="text-[10px] font-bold uppercase mt-2 tracking-wider">Tas Belanja</span>
        </div>

        <div className="flex-1 h-0.5 bg-gray-700 mx-4 -mt-6 relative">
            <div 
                className="absolute top-0 left-0 h-full bg-brand-orange transition-all duration-500"
                style={{ width: currentStep === 2 ? '100%' : '0%' }}
            ></div>
        </div>

        <div className={`flex flex-col items-center relative z-10 ${currentStep === 2 ? 'text-brand-orange' : 'text-gray-500'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                currentStep === 2 
                ? 'bg-brand-orange text-white border-brand-orange shadow-neon' 
                : 'bg-brand-dark border-gray-600 text-gray-500'
            }`}>
                <Truck size={18} />
            </div>
            <span className="text-[10px] font-bold uppercase mt-2 tracking-wider">Data Kirim</span>
        </div>
    </div>
);

export const CheckoutModule = ({ setPage, config }: { setPage: (p: string) => void, config?: SiteConfig }) => {
    const {
        cart, removeFromCart, updateQuantity, totalPrice, clearCart,
        formData, handleFieldChange, handleBlur,
        agreedToTerms, handleCheckboxToggle, showTermsModal, setShowTermsModal, confirmAgreement,
        isSubmitting, submitOrder,
        orderSuccess, setOrderSuccess,
        subtotalPrice, discount, couponInput, setCouponInput, applyCoupon, isValidatingCoupon,
        step, setStep
    } = useCheckoutLogic(setPage);

    if (orderSuccess) {
        return <SuccessView order={orderSuccess} onHome={() => setPage('home')} config={config} />;
    }

    return (
        <div className="container mx-auto px-4 py-10 animate-fade-in">
            <SectionHeader title="Selesaikan" highlight="Order" />
            
            {cart.length === 0 ? (
                <EmptyCartView onBack={() => setPage('shop')} />
            ) : (
                <div className="max-w-4xl mx-auto">
                    <Stepper currentStep={step} />

                    <div className="bg-brand-card/30 border border-white/5 rounded-3xl p-1 md:p-6 relative overflow-hidden shadow-2xl">
                        {step === 1 && (
                            <div className="animate-fade-in">
                                <CartSummary 
                                    cart={cart}
                                    subtotal={subtotalPrice}
                                    onUpdateQty={updateQuantity}
                                    onRemove={removeFromCart}
                                    onClear={clearCart}
                                    onBack={() => setPage('shop')}
                                    onNext={() => setStep(2)}
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in">
                                <ShippingForm 
                                    formData={formData}
                                    onChange={handleFieldChange}
                                    onBlur={handleBlur}
                                    onSubmit={submitOrder}
                                    isSubmitting={isSubmitting}
                                    subtotalPrice={subtotalPrice}
                                    totalPrice={totalPrice}
                                    discount={discount}
                                    couponInput={couponInput}
                                    setCouponInput={setCouponInput}
                                    applyCoupon={applyCoupon}
                                    isValidatingCoupon={isValidatingCoupon}
                                    agreed={agreedToTerms}
                                    onToggleTerms={handleCheckboxToggle}
                                    onBack={() => setStep(1)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showTermsModal && (
                <TermsModal 
                    onAgree={confirmAgreement} 
                    onClose={() => setShowTermsModal(false)} 
                />
            )}
        </div>
    );
};
