
import { Order, OrderItem, Lead } from '../../types';

export type OrderStatus = 'pending' | 'paid' | 'processed' | 'completed' | 'cancelled';

export interface OrderState {
    orders: Order[];
    loading: boolean;
    expandedOrderId: number | null;
    orderItems: Record<number, OrderItem[]>;
}

export interface LeadState {
    leads: Lead[];
    loading: boolean;
}

export interface OrderActions {
    fetchOrders: () => Promise<void>;
    fetchOrderItems: (orderId: number) => Promise<void>;
    updateStatus: (orderId: number, newStatus: string) => Promise<void>;
    updateShipping: (orderId: number, courier: string, trackingNumber: string) => Promise<void>;
    toggleExpand: (orderId: number) => void;
}

export interface LeadActions {
    fetchLeads: () => Promise<void>;
    updateLeadStatus: (id: number, status: string) => Promise<void>;
}
