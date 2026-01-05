
import React from 'react';
import { SectionHeader } from '../ui';
import { useCheckoutLogic } from './logic';
import { EmptyCartView } from './ui-parts';
import { SuccessView } from './sections/success-view';
import { CartSummary } from './sections/cart-summary';
import { ShippingForm } from './sections/shipping-form';
import { SiteConfig } from '../../types';

export const CheckoutModule = ({ setPage, config }: { setPage: (p: string) => void, config?: SiteConfig }) => {
    const {
        cart, removeFromCart, updateQuantity, totalPrice, clearCart,
        formData, handleFieldChange, handleBlur,
        agreedToTerms, setAgreedToTerms,
        isSubmitting, submitOrder,
        orderSuccess, setOrderSuccess
    } = useCheckoutLogic(setPage);

    // VIEW 1: SUCCESS
    if (orderSuccess) {
        return <SuccessView order={orderSuccess} onHome={() => setPage('home')} config={config} />;
    }

    // VIEW 2: CART / EMPTY
    return (
        <div className="container mx-auto px-4 py-10 animate-fade-in">
            <SectionHeader title="Keranjang" highlight="Belanja" />
            
            {cart.length === 0 ? (
                <EmptyCartView onBack={() => setPage('shop')} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <CartSummary 
                        cart={cart}
                        onUpdateQty={updateQuantity}
                        onRemove={removeFromCart}
                        onClear={clearCart}
                        onBack={() => setPage('shop')}
                    />
                    <ShippingForm 
                        formData={formData}
                        onChange={handleFieldChange}
                        onBlur={handleBlur}
                        onSubmit={submitOrder}
                        isSubmitting={isSubmitting}
                        totalPrice={totalPrice}
                        agreed={agreedToTerms}
                        setAgreed={setAgreedToTerms}
                    />
                </div>
            )}
        </div>
    );
};
