
import React from 'react';
import { Search } from 'lucide-react';
import { Input, Button, LoadingSpinner } from '../../ui';

interface SearchFormProps {
    orderId: string;
    setOrderId: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

export const SearchForm = ({ orderId, setOrderId, onSubmit, loading }: SearchFormProps) => {
    return (
        <div className="bg-brand-card border border-white/10 rounded-2xl p-6 md:p-8 shadow-neon mb-8">
            <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Order ID (Cek WhatsApp)</label>
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <Input 
                            value={orderId} 
                            onChange={e => setOrderId(e.target.value)} 
                            placeholder="Contoh: 123456789012" 
                            className="pl-12 py-3 text-lg font-mono tracking-widest"
                            type="number"
                        />
                    </div>
                </div>
                <div className="flex items-end">
                    <Button type="submit" disabled={loading} className="w-full md:w-auto h-[50px] px-8 shadow-neon">
                        {loading ? <LoadingSpinner /> : "LACAK SEKARANG"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
