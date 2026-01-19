
import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SectionHeader } from '../ui';
import { useTrackOrder } from './logic';
import { SearchForm } from './sections/search-form';
import { ResultView } from './sections/result-view';
import { SiteConfig } from '../../types';

export const TrackOrderModule = ({ config }: { config?: SiteConfig }) => {
    const { orderId, setOrderId, loading, result, error, handleSearch, copyToClipboard } = useTrackOrder();
    const location = useLocation();
    const navigate = useNavigate();
    const waNumber = config?.whatsapp_number;

    return (
        <div className="animate-fade-in pt-24 pb-20">
            <div className="container mx-auto px-4">
                
                {/* Back Button Logic */}
                {location.state?.from === 'shop' && (
                    <div className="max-w-2xl mx-auto mb-6">
                        <button 
                            onClick={() => navigate('/shop')}
                            className="flex items-center gap-2 text-gray-500 hover:text-brand-orange transition-colors text-xs font-bold uppercase tracking-widest group"
                        >
                            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-brand-orange/10 border border-white/10 group-hover:border-brand-orange/30 transition-all">
                                <ArrowLeft size={14} />
                            </div>
                            Kembali ke Katalog
                        </button>
                    </div>
                )}

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
                        <ResultView 
                            result={result} 
                            onCopy={copyToClipboard} 
                            waNumber={waNumber}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
