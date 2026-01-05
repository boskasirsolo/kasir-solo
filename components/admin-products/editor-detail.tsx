
import React from 'react';
import { List, Scale, ThumbsUp, AlignLeft, Save, Plus } from 'lucide-react';
import { TextArea, Button, LoadingSpinner } from '../ui';
import { FieldHeader } from './atoms';

export const EditorDetail = ({ 
    form, 
    setForm, 
    loading, 
    aiActions,
    actions
}: any) => {
    return (
        <div className="bg-brand-dark rounded-xl border border-white/5 shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-white/5 shrink-0">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <List size={16} className="text-brand-orange"/>
                    DETAIL LENGKAP
                </h3>
            </div>

            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-6">
                
                {/* 1. SPECS */}
                <div>
                    <FieldHeader label="Spesifikasi Teknis" onAI={aiActions.generateSpecs} loading={loading.generatingSpecs} />
                    <div className="relative">
                        <Scale size={12} className="absolute right-2 top-2 text-gray-600"/>
                        <TextArea 
                            value={form.specsStr} 
                            onChange={e => setForm((p:any) => ({...p, specsStr: e.target.value}))} 
                            placeholder="RAM: 4GB&#10;OS: Windows 10" 
                            className="h-24 text-[10px] leading-relaxed custom-scrollbar whitespace-pre-line font-mono" 
                        />
                    </div>
                </div>

                {/* 2. INCLUDES */}
                <div>
                    <FieldHeader label="Paket Termasuk" onAI={aiActions.generateIncludes} loading={loading.generatingIncludes} />
                    <div className="relative">
                        <List size={12} className="absolute right-2 top-2 text-gray-600"/>
                        <TextArea 
                            value={form.includesStr} 
                            onChange={e => setForm((p:any) => ({...p, includesStr: e.target.value}))} 
                            placeholder="Printer Thermal&#10;Kertas Roll" 
                            className="h-20 text-[10px] leading-relaxed custom-scrollbar whitespace-pre-line" 
                        />
                    </div>
                </div>

                {/* 3. WHY BUY */}
                <div>
                    <FieldHeader label="Kenapa Harus Beli?" onAI={aiActions.generateWhyBuy} loading={loading.generatingWhyBuy} />
                    <div className="relative">
                        <ThumbsUp size={12} className="absolute right-2 top-2 text-gray-600"/>
                        <TextArea 
                            value={form.whyBuyStr} 
                            onChange={e => setForm((p:any) => ({...p, whyBuyStr: e.target.value}))} 
                            placeholder="Investasi Jangka Panjang&#10;Anti Maling" 
                            className="h-20 text-[10px] leading-relaxed custom-scrollbar whitespace-pre-line" 
                        />
                    </div>
                </div>

                {/* 4. DESCRIPTION (MOVED TO BOTTOM AS REQUESTED) */}
                <div>
                    <FieldHeader label="Deskripsi (Sales Copy)" onAI={aiActions.generateDesc} loading={loading.generatingDesc} />
                    <TextArea 
                        value={form.desc} 
                        onChange={e => setForm((p:any) => ({...p, desc: e.target.value}))} 
                        placeholder="Deskripsi persuasif..." 
                        className="h-32 text-[10px] leading-relaxed custom-scrollbar whitespace-pre-line" 
                    />
                </div>

            </div>

            {/* STICKY FOOTER WITH ACTION BUTTON */}
            <div className="p-4 border-t border-white/5 bg-brand-dark shrink-0">
                <Button onClick={actions.handleSubmit} disabled={loading.uploading || loading.processingImage} className="w-full py-3 text-xs font-bold shadow-neon">
                    {loading.processingImage ? <><LoadingSpinner/> Watermarking...</> : loading.uploading ? <LoadingSpinner /> : (form.id ? <><Save size={14}/> UPDATE PRODUK</> : <><Plus size={14}/> SIMPAN PRODUK</>)}
                </Button>
            </div>
        </div>
    );
};
