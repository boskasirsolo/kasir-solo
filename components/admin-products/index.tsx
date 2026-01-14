
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Product } from '../../types';
import { useProductLogic } from './logic';
import { ListPanel } from './list-panel';
import { EditorBasic } from './editor-basic';
import { EditorDetail } from './editor-detail';

export const AdminProducts = ({ 
  products, 
  setProducts 
}: { 
  products: Product[], 
  setProducts: (p: Product[]) => void 
}) => {
  const { 
    form, 
    setForm, 
    loading, 
    useWatermark, 
    setUseWatermark, 
    showMobileEditor, 
    setShowMobileEditor, 
    listState, 
    actions, 
    aiActions 
  } = useProductLogic(products, setProducts);

  return (
    <div className="relative">
      
      {/* 1. LIST PANEL (Selalu muncul di Desktop, muncul saat Editor tutup di Mobile) */}
      <div className={`w-full xl:grid xl:grid-cols-10 gap-6 items-start ${showMobileEditor ? 'hidden xl:grid' : 'block'}`}>
        
        {/* COLUMN 1: LIST */}
        <div className="w-full xl:col-span-4 h-auto xl:h-[800px]">
           <ListPanel state={listState} actions={actions} />
        </div>
        
        {/* DESKTOP VIEW: Editors tetap muncul di samping */}
        <div className="hidden xl:block xl:col-span-3">
           <EditorBasic 
              form={form} 
              setForm={setForm} 
              loading={loading}
              useWatermark={useWatermark}
              setUseWatermark={setUseWatermark}
              aiActions={aiActions}
              actions={actions}
           />
        </div>

        <div className="hidden xl:block xl:col-span-3">
           <EditorDetail 
              form={form}
              setForm={setForm}
              loading={loading}
              aiActions={aiActions}
              actions={actions}
           />
        </div>
      </div>

      {/* 2. MOBILE EDITOR PAGE (Fullscreen Overlay) */}
      {showMobileEditor && (
        <div className="xl:hidden fixed inset-0 z-[100] bg-brand-black flex flex-col animate-fade-in overflow-hidden">
          
          {/* Header Kontrol Mobile */}
          <div className="p-4 bg-brand-card border-b border-white/10 flex items-center justify-between shrink-0">
             <button 
                onClick={() => setShowMobileEditor(false)}
                className="flex items-center gap-2 text-brand-orange font-bold text-sm"
             >
                <ArrowLeft size={20} /> Kembali
             </button>
             <h3 className="text-white font-bold text-sm truncate max-w-[200px]">
                {form.id ? 'Edit Produk' : 'Produk Baru'}
             </h3>
             <div className="w-10"></div> {/* Spacer balance */}
          </div>

          {/* Scrollable Content (Editors) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar pb-10">
              <div className="shadow-2xl">
                <EditorBasic 
                    form={form} 
                    setForm={setForm} 
                    loading={loading}
                    useWatermark={useWatermark}
                    setUseWatermark={setUseWatermark}
                    aiActions={aiActions}
                    actions={actions}
                />
              </div>
              <div className="shadow-2xl">
                <EditorDetail 
                    form={form}
                    setForm={setForm}
                    loading={loading}
                    aiActions={aiActions}
                    actions={actions}
                />
              </div>
          </div>
        </div>
      )}

    </div>
  );
};
