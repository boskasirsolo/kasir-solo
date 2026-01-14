
import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';
import { useSEOLogic } from './logic';
import { CityListPanel } from './city-list';
import { CityEditorPanel } from './city-editor';

export const AdminSEO = () => {
  const { state, setters, actions } = useSEOLogic();

  const MobileEditorOverlay = () => (
    <div className="fixed inset-0 z-[9999] bg-brand-black flex flex-col animate-fade-in overflow-hidden lg:hidden">
      {/* Header Kontrol Mobile */}
      <div className="p-4 bg-brand-card border-b border-white/10 flex items-center justify-between shrink-0 shadow-lg relative z-20">
         <button 
            onClick={() => setters.setShowMobileEditor(false)}
            className="flex items-center gap-2 text-brand-orange font-bold text-sm"
         >
            <ArrowLeft size={20} /> Kembali
         </button>
         <h3 className="text-white font-bold text-sm truncate max-w-[200px]">
            {state.form.id ? 'Edit Wilayah' : 'Target Baru'}
         </h3>
         <div className="w-10"></div>
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar pb-20">
          <div className="animate-fade-in">
             <CityEditorPanel 
                form={state.form}
                setForm={setters.setForm}
                onSubmit={actions.handleSubmit}
                onReset={actions.resetForm}
                loading={state.loading}
                hideHeader={true}
             />
          </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      
      {/* 1. LIST PANEL (Selalu muncul di Desktop, muncul saat Editor tutup di Mobile) */}
      <div className={`w-full lg:grid lg:grid-cols-12 gap-8 items-start ${state.showMobileEditor ? 'hidden lg:grid' : 'block'}`}>
        
        {/* LEFT: LIST KOTA */}
        <div className="lg:col-span-8 h-auto lg:h-[800px]">
          <CityListPanel 
              state={state}
              setters={setters}
              onEdit={actions.handleEdit}
              onDelete={actions.handleDelete}
              onAdd={actions.openNewCity}
          />
        </div>

        {/* RIGHT: FORM INPUT (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-4">
           <CityEditorPanel 
              form={state.form}
              setForm={setters.setForm}
              onSubmit={actions.handleSubmit}
              onReset={actions.resetForm}
              loading={state.loading}
           />
        </div>

      </div>

      {/* 2. MOBILE EDITOR PAGE (Portal to Body) */}
      {state.showMobileEditor && createPortal(<MobileEditorOverlay />, document.body)}

    </div>
  );
};
