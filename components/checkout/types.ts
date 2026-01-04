
export interface CheckoutFormData {
    name: string;
    phone: string;
    address: string;
    note: string;
}

export interface OrderSuccessState {
    id: number;
    total: number;
}
