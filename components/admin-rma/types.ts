
export type RMAStatus = 'pending' | 'approved' | 'rejected' | 'received' | 'completed';

export interface RMATicket {
    id: number;
    created_at: string;
    order_id: string;
    customer_phone: string;
    serial_number: string;
    issue_type: string;
    chronology: string;
    evidence_urls: { unboxing: string; damage: string };
    solution_preference: string;
    status: RMAStatus;
    admin_notes?: string;
}

export const RMA_STATUS_CONFIG: Record<RMAStatus, { label: string, color: string }> = {
    pending: { label: '⏳ Menunggu Review', color: 'text-yellow-500 border-yellow-500 bg-yellow-500/10' },
    approved: { label: '🚚 Kirim Unit (Approved)', color: 'text-blue-400 border-blue-500 bg-blue-500/10' },
    received: { label: '🛠️ Sedang Dicek (Received)', color: 'text-purple-400 border-purple-500 bg-purple-500/10' },
    completed: { label: '✅ Selesai (Completed)', color: 'text-green-400 border-green-500 bg-green-500/10' },
    rejected: { label: '❌ Ditolak (Void)', color: 'text-red-400 border-red-500 bg-red-500/10' }
};
