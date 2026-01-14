
import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Sparkles, Map, Loader2 } from 'lucide-react';
import { useSEOLogic } from './logic';
import { CityListPanel } from './city-list';
import { CityEditorPanel } from './city-editor';
import { AISuggestionsPanel } from './ai-suggestions';

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
    <div className="relative space-y-8">
      
      {/* 1. MAGIC GENERATOR PANEL */}
      <div className="bg-brand-card border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Sparkles size={120} className="text-brand-orange" />
          </div>
          <div className="relative z-10">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  <Sparkles size={20} className="text-brand-orange"/> Magic Bulk Page Generator
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-2xl leading-relaxed">
                  Capek input satu-satu? Biar AI yang riset. Ketik nama provinsi atau area (cth: "Jawa Barat"), AI bakal nyari kota potensial dan bikin strateginya buat lo.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                      <Map className="absolute left-4 top-3.5 text-gray-500" size={18} />
                      <input 
                          value={state.regionInput}
                          onChange={(e) => setters.setRegionInput(e.target.value)}
                          placeholder="Masukkan wilayah (Cth: Jawa Tengah / Pantura / Soloraya)"
                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-orange transition-all"
                      />
                  </div>
                  <button 
                    onClick={actions.generateAITargets}
                    disabled={state.genLoading}
                    className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-neon flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                      {state.genLoading ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18}/>}
                      {state.genLoading ? 'MENGANALISA...' : 'RISET WILAYAH'}
                  </button>
              </div>
          </div>

          <AISuggestionsPanel 
            suggestions={state.suggestions}
            onPublish={actions.publishAllSuggestions}
            onClear={() => setters.setRegionInput('')}
            loading={state.loading}
          />
      </div>

      {/* 2. LIST PANEL & MANUAL EDITOR */}
      <div className={`w-full lg:grid lg:grid-cols-12 gap-8 items-start ${state.showMobileEditor ? 'hidden lg:grid' : 'block'}`}>
        
        {/* LEFT: LIST KOTA (Daftar Halaman SEO) */}
        <div className="lg:col-span-8 h-auto lg:h-[800px]">
          <CityListPanel 
              state={state}
              setters={setters}
              onEdit={actions.handleEdit}
              onDelete={actions.handleDelete}
              onAdd={actions.openNewCity}
          />
        </div>

        {/* RIGHT: FORM INPUT (Manual Editor) */}
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

      {/* MOBILE EDITOR PAGE (Portal to Body) */}
      {state.showMobileEditor && createPortal(<MobileEditorOverlay />, document.body)}

    </div>
  );
};
