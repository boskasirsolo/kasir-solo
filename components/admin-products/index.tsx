
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
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start h-[850px]">
      
      {/* COLUMN 1: LIST (40%) */}
      <div className="lg:col-span-4 h-full">
         <ListPanel state={listState} actions={actions} />
      </div>
      
      {/* COLUMN 2: BASIC EDITOR (30%) */}
      <div className="lg:col-span-3 h-full">
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

      {/* COLUMN 3: DETAIL EDITOR (30%) */}
      <div className="lg:col-span-3 h-full">
         <EditorDetail 
            form={form}
            setForm={setForm}
            loading={loading}
            aiActions={aiActions}
         />
      </div>

    </div>
  );
};
