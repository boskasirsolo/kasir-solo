
import React from 'react';
import { List, Scale, ThumbsUp, Save, Plus, FileText } from 'lucide-react';
import { AdminTextArea, CmdButton } from '../admin/ui-shared/atoms';
import { FieldGroup } from '../admin/ui-shared/molecules';
import { LoadingSpinner } from '../ui';

export const EditorDetail = ({ 
    form, 
    setForm, 
    loading, 
    aiActions,
    actions,
    hideHeader = false 
}: any) => {
    return (
        <div className={`bg-brand-dark flex flex-col h-full overflow-hidden ${hideHeader ? '' : 'rounded-2xl border border-white/5 shadow-2xl'}`}>
            {!hideHeader && (
                <div className="p-4 border-b border-white/5 shrink-0 bg-black/20">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
                        <List size={16} className="text-brand-orange"/> DETAIL LENGKAP
                    </h3>
                </div>
            )}

            <div className={`flex-grow overflow-y-auto custom-scrollbar space-y-6 ${hideHeader ? 'p-0' : 'p-5 md:p-6'}`}>
                
                <FieldGroup label="Spesifikasi Teknis" onAI={aiActions.generateSpecs} aiLoading={loading.generatingSpecs} icon={Scale}>
                    <AdminTextArea value={form.specsStr} onChange={(e:any) => setForm((p:any) => ({...p, specsStr: e.target.value}))} placeholder="RAM: 4GB&#10;OS: Windows 10" className="h-24 text-[10px] font-mono leading-relaxed" />
                </FieldGroup>

                <FieldGroup label="Paket Termasuk" onAI={aiActions.generateIncludes} aiLoading={loading.generatingIncludes} icon={List}>
                    <AdminTextArea value={form.includesStr} onChange={(e:any) => setForm((p:any) => ({...p, includesStr: e.target.value}))} placeholder="Printer Thermal&#10;Kertas Roll" className="h-24 text-[10px]" />
                </FieldGroup>

                <FieldGroup label="Kenapa Harus Beli?" onAI={aiActions.generateWhyBuy} aiLoading={loading.generatingWhyBuy} icon={ThumbsUp}>
                    <AdminTextArea value={form.whyBuyStr} onChange={(e:any) => setForm((p:any) => ({...p, whyBuyStr: e.target.value}))} placeholder="Investasi Jangka Panjang&#10;Anti Maling" className="h-24 text-[10px]" />
                </FieldGroup>

                <FieldGroup label="Deskripsi (Sales Copy)" onAI={aiActions.generateDesc} aiLoading={loading.generatingDesc} icon={FileText}>
                    <AdminTextArea value={form.desc} onChange={(e:any) => setForm((p:any) => ({...p, desc: e.target.value}))} placeholder="Deskripsi persuasif..." className="h-32 text-xs leading-relaxed" />
                </FieldGroup>

                <div className="pt-4 pb-8">
                    <CmdButton 
                        onClick={actions.handleSubmit} 
                        disabled={loading.uploading || loading.processingImage} 
                        variant="primary" 
                        className="w-full py-4 text-xs font-black shadow-neon"
                    >
                        {loading.processingImage ? <><LoadingSpinner/> WATERMARKING...</> : loading.uploading ? <LoadingSpinner /> : (form.id ? <><Save size={16}/> UPDATE PRODUK</> : <><Plus size={16}/> SIMPAN PRODUK</>)}
                    </CmdButton>
                </div>
            </div>
        </div>
    );
};
