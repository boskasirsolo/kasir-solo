
import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';
import { Product } from '../../types';
import { useProductLogic } from './logic';
import { ListPanel } from './list-panel';
import { EditorBasic } from './editor-basic';
import { EditorDetail } from './editor-detail';

export const AdminProducts = ({ products, setProducts }: { products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>> }) => {
  const { form, setForm, loading, useWatermark, setUseWatermark, showMobileEditor, setShowMobileEditor, listState, actions, aiActions } = useProductLogic(products, setProducts);

  const EditorStack = ({ hide }: { hide?: boolean }) => (
    <div className="space-y-6">
        <EditorBasic form={form} setForm={setForm} loading={loading} useWatermark={useWatermark} setUseWatermark={setUseWatermark} aiActions={aiActions} actions={actions} hideHeader={hide} />
        <EditorDetail form={form} setForm={setForm} loading={loading} aiActions={aiActions} actions={actions} hideHeader={hide} />
    </div>
  );

  return (
    <div className="relative animate-fade-in pb-20">
      <div className={`w-full xl:grid xl:grid-cols-10 gap-6 items-start ${showMobileEditor ? 'hidden xl:grid' : 'block'}`}>
        <div className="w-full xl:col-span-4 h-full">
           <ListPanel state={listState} actions={actions} />
        </div>
        <div className="hidden xl:block xl:col-span-6 h-full overflow-y-auto custom-scrollbar pr-2 max-h-[850px]">
           <EditorStack />
        </div>
      </div>

      {showMobileEditor && createPortal(
        <div className="fixed inset-0 z-[9999] bg-brand-black flex flex-col lg:hidden">
            <div className="p-4 bg-brand-card border-b border-white/10 flex items-center justify-between shrink-0">
                <button onClick={() => setShowMobileEditor(false)} className="flex items-center gap-2 text-brand-orange font-bold text-sm"><ArrowLeft size={20} /> Kembali</button>
                <h3 className="text-white font-bold text-sm truncate">{form.id ? 'Edit Produk' : 'Produk Baru'}</h3>
                <div className="w-10"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar pb-32"><EditorStack hide={true} /></div>
        </div>, 
        document.body
      )}
    </div>
  );
};
