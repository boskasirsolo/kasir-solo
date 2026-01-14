
import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Sparkles, Map, Loader2, Globe, FileText } from 'lucide-react';
import { useSEOLogic } from './logic';
import { CityListPanel } from './city-list';
import { CityEditorPanel } from './city-editor';
import { AISuggestionsPanel } from './ai-suggestions';
import { TemplateListPanel } from './template-list';
import { TemplateEditorPanel } from './template-editor';

export const AdminSEO = () => {
  const { state, setters, actions } = useSEOLogic();

  const MobileEditorOverlay = () => (
    <div className="fixed inset-0 z-[9999] bg-brand-black flex flex-col animate-fade-in overflow-hidden lg:hidden">
      <div className="p-4 bg-brand-card border-b border-white/10 flex items-center justify-between shrink-0 shadow-lg relative z-20">
         <button onClick={() => setters.setShowMobileEditor(false)} className="flex items-center gap-2 text-brand-orange font-bold text-sm"><ArrowLeft size={20} /> Kembali</button>
         <h3 className="text-white font-bold text-sm truncate">{state.form.id ? 'Edit Wilayah' : 'Target Baru'}</h3>
         <div className="w-10"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar pb-20">
             <CityEditorPanel 
                form={state.form}
                setForm={setters.setForm}
                templates={state.templates}
                onSubmit={actions.handleSubmit}
                onReset={actions.resetForm}
                onGenerate={actions.generateNarrative}
                loading={state.loading}
                isGenerating={state.isGeneratingNarrative}
                hideHeader={true}
             />
      </div>
    </div>
  );

  return (
    <div className="relative space-y-8">
      
      {/* 1. TOP NAV & MAGIC GENERATOR */}
      <div className="bg-brand-card border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/5 pb-6">
              <div>
                  <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2"><Globe size={20} className="text-brand-orange"/> SEO Engine Solo</h3>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Digital Domination Control</p>
              </div>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 w-full md:w-auto">
                  <button onClick={() => setters.setModuleSubTab('cities')} className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${state.moduleSubTab === 'cities' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500 hover:text-white'}`}><Map size={14}/> Wilayah</button>
                  <button onClick={() => setters.setModuleSubTab('templates')} className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${state.moduleSubTab === 'templates' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500 hover:text-white'}`}><FileText size={14}/> Master Template</button>
              </div>
          </div>

          {state.moduleSubTab === 'cities' && (
              <div className="animate-fade-in">
                  <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2"><Sparkles size={16} className="text-brand-orange"/> Bulk Region Researcher</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative flex-1">
                          <Map className="absolute left-4 top-3.5 text-gray-500" size={18} />
                          <input value={state.regionInput} onChange={(e) => setters.setRegionInput(e.target.value)} placeholder="Masukkan wilayah (Cth: Jawa Tengah)" className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:border-brand-orange transition-all" />
                      </div>
                      <button onClick={actions.generateAITargets} disabled={state.genLoading} className="bg-brand-gradient text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-neon flex items-center justify-center gap-2 transition-all disabled:opacity-50">{state.genLoading ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18}/>} RISET WILAYAH</button>
                  </div>
                  <AISuggestionsPanel suggestions={state.suggestions} onPublish={actions.publishAllSuggestions} onClear={() => setters.setRegionInput('')} loading={state.loading} />
              </div>
          )}
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className={`w-full lg:grid lg:grid-cols-12 gap-8 items-start ${state.showMobileEditor ? 'hidden lg:grid' : 'block'}`}>
        
        {state.moduleSubTab === 'cities' ? (
            <>
                <div className="lg:col-span-8 h-auto lg:h-[800px]">
                    <CityListPanel state={state} setters={setters} onEdit={actions.handleEdit} onDelete={actions.handleDelete} onAdd={actions.openNewCity} />
                </div>
                <div className="hidden lg:block lg:col-span-4">
                    <CityEditorPanel form={state.form} setForm={setters.setForm} templates={state.templates} onSubmit={actions.handleSubmit} onReset={actions.resetForm} onGenerate={actions.generateNarrative} loading={state.loading} isGenerating={state.isGeneratingNarrative} />
                </div>
            </>
        ) : (
            <>
                <div className="lg:col-span-8 h-auto lg:h-[800px]">
                    <TemplateListPanel templates={state.templates} onEdit={setters.setTemplateForm} onAdd={() => setters.setTemplateForm({ id: 0, title: '', prompt_structure: '' })} />
                </div>
                <div className="lg:col-span-4">
                    <TemplateEditorPanel form={state.templateForm} setForm={setters.setTemplateForm} onSubmit={actions.handleTemplateSubmit} onReset={() => setters.setTemplateForm({ id: 0, title: '', prompt_structure: '' })} />
                </div>
            </>
        )}
      </div>

      {state.showMobileEditor && state.moduleSubTab === 'cities' && createPortal(<MobileEditorOverlay />, document.body)}

    </div>
  );
};
