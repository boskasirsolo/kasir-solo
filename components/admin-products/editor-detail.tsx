
import React from 'react';
import { List, Scale, ThumbsUp, AlignLeft } from 'lucide-react';
import { TextArea } from '../ui';
import { FieldHeader } from './atoms';

export const EditorDetail = ({ 
    form, 
    setForm, 
    loading, 
    aiActions 
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
                
                {/* DESCRIPTION */}
                <div>
                    <FieldHeader label="Deskripsi (Sales Copy)" onAI={aiActions.generateDesc} loading={loading.generatingDesc} />
                    <TextArea 
                        value={form.desc} 
                        onChange={e => setForm((p:any) => ({...p, desc: e.target.value}))} 
                        placeholder="Deskripsi persuasif..." 
                        className="h-32 text-[10px] leading-relaxed custom-scrollbar whitespace-pre-line" 
                    />
                </div>

                {/* SPECS */}
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

                {/* INCLUDES */}
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

                {/* WHY BUY */}
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

            </div>
        </div>
    );
};
