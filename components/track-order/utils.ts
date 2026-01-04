
export const getStatusLabel = (status: string) => {
    switch(status) {
        case 'pending': return 'Nunggu Transfer';
        case 'paid': return 'Pembayaran Diterima (Verified)';
        case 'processed': return 'Sedang Dirakit / Packing';
        case 'completed': return 'Dalam Perjalanan (OTW)';
        case 'cancelled': return 'Dibatalkan';
        default: return status;
    }
};
