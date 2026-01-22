
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface DiscountInfo {
    code: string;
    type: 'fixed' | 'percentage';
    value: number;
    amount: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalPrice: number;
  discount: DiscountInfo | null;
  setDiscount: (d: DiscountInfo | null) => void;
  totalPrice: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children?: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<DiscountInfo | null>(null);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('mks_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mks_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true); // Buka drawer otomatis saat nambah barang
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  const clearCart = () => {
      setCart([]);
      setDiscount(null);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const discountAmount = discount ? 
    (discount.type === 'percentage' ? (subtotalPrice * discount.value / 100) : discount.value) 
    : 0;
  
  const totalPrice = Math.max(0, subtotalPrice - discountAmount);

  return (
    <CartContext.Provider value={{ 
        cart, addToCart, removeFromCart, updateQuantity, clearCart, 
        totalItems, subtotalPrice, discount, setDiscount, totalPrice,
        isCartOpen, setCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
