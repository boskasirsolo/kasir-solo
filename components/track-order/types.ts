
import { Order, OrderItem } from '../../types';

export interface OrderResult {
    order: Order;
    items: OrderItem[];
}

export type TrackingStatus = 'pending' | 'paid' | 'processed' | 'completed' | 'cancelled';
