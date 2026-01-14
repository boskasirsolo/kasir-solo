
import React from 'react';
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
  const { form, setForm, loading, useWatermark, setUseWatermark, listState, actions, aiActions } = useProductLogic(products, setProducts);

  return (
    <div className="flex flex-col xl:grid xl:grid-cols-10 gap-6 items-start">
      
      {/* COLUMN 1: LIST (Dikasih height fix di desktop biar scrollable) */}
      <div className="w-full xl:col-span-4 h-auto xl:h-[800px]">
         <ListPanel state={listState} actions={actions} />
      </div>
      
      {/* COLUMN 2: BASIC EDITOR */}
      <div className="w-full xl:col-span-3">
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

      {/* COLUMN 3: DETAIL EDITOR */}
      <div className="w-full xl:col-span-3">
         <EditorDetail 
            form={form}
            setForm={setForm}
            loading={loading}
            aiActions={aiActions}
            actions={actions}
         />
      </div>

    </div>
  );
};
