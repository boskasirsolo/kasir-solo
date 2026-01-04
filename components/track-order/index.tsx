
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { SectionHeader } from '../ui';
import { useTrackOrder } from './logic';
import { SearchForm } from './sections/search-form';
import { ResultView } from './sections/result-view';

export const TrackOrderModule = () => {
    const { orderId, setOrderId, loading, result, error, handleSearch, copyToClipboard } = useTrackOrder();

    return (
        <div className="animate-fade-in pt-24 pb-20">
            <div className="container mx-auto px-4">
                <SectionHeader 
                    title="Paket Gue" 
                    highlight="Sampe Mana?" 
                    subtitle="Gak usah was-was barang lo dicolong kurir atau nyasar. Cek status real-time di sini. Gue pantau terus sampe depan pintu lo."
                />

                <div className="max-w-2xl mx-auto">
                    
                    <SearchForm 
                        orderId={orderId}
                        setOrderId={setOrderId}
                        onSubmit={handleSearch}
                        loading={loading}
                    />

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center text-red-400 mb-8 animate-fade-in flex items-center justify-center gap-2">
                            <ShieldAlert size={20} /> {error}
                        </div>
                    )}

                    {result && (
                        <ResultView result={result} onCopy={copyToClipboard} />
                    )}
                </div>
            </div>
        </div>
    );
};
