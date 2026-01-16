
import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';
import { GalleryItem, Testimonial } from '../../types';
import { useGalleryLogic } from './logic';
import { ListPanel } from './list-panel';
import { EditorPanel } from './editor-panel';
import { PreviewPanel } from './preview-panel';

export const AdminGallery = ({ 
  gallery, setGallery, testimonials, setTestimonials
}: { 
  gallery: GalleryItem[], setGallery: (g: GalleryItem[]) => void,
  testimonials: Testimonial[], setTestimonials: (t: Testimonial[]) => void
}) => {
  const { 
    form, setForm, 
    testiForm, setTestiForm,
    useWatermark, setUseWatermark,
    loading, actions, listState,
    showMobileEditor, setShowMobileEditor
  } = useGalleryLogic(gallery, setGallery, testimonials, setTestimonials);

  const MobileEditorOverlay = () => (
    <div className="fixed inset-0 z-[9999] bg-brand-black flex flex-col animate-fade-in overflow-hidden lg:hidden">
      <div className="p-4 bg-brand-card border-b border-white/10 flex items-center justify-between shrink-0 shadow-lg relative z-20">
         <button 
            onClick={() => setShowMobileEditor(false)}
            className="flex items-center gap-2 text-brand-orange font-bold text-sm"
         >
            <ArrowLeft size={20} /> Kembali
         </button>
         <h3 className="text-white font-bold text-sm truncate max-w-[200px]">
            {form.id ? 'Edit Project' : 'Project Baru'}
         </h3>
         <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-10 custom-scrollbar pb-20">
          <div className="animate-fade-in">
             <EditorPanel 
                form={form} setForm={setForm}
                testiForm={testiForm} setTestiForm={setTestiForm}
                loading={loading}
                useWatermark={useWatermark} setUseWatermark={setUseWatermark}
                actions={actions}
                hideHeader={true}
             />
          </div>
          <div className="animate-fade-in border-t border-white/10 pt-8" style={{ animationDelay: '0.1s' }}>
             <PreviewPanel form={form} testiForm={testiForm} />
          </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <div className={`flex flex-col lg:flex-row h-auto lg:h-[850px] border-t border-white/5 bg-brand-black overflow-hidden lg:rounded-xl border-b shadow-2xl ${showMobileEditor ? 'hidden lg:flex' : 'flex'}`}>
        
        {/* COLUMN 1: LIST (25%) */}
        <div className="w-full lg:w-[25%] h-[400px] lg:h-full border-r-0 lg:border-r border-b lg:border-b-0 border-white/5 min-w-[280px]">
            <ListPanel state={listState} actions={actions} activeId={form.id} />
        </div>

        {/* COLUMN 2: EDITOR (40%) - Desktop Only in this container */}
        <div className="hidden lg:flex lg:w-[40%] h-[600px] lg:h-full border-r-0 lg:border-r border-b lg:border-b-0 border-white/5 min-w-[350px]">
            <EditorPanel 
               form={form} setForm={setForm}
               testiForm={testiForm} setTestiForm={setTestiForm}
               loading={loading}
               useWatermark={useWatermark} setUseWatermark={setUseWatermark}
               actions={actions}
            />
        </div>

        {/* COLUMN 3: PREVIEW (35%) - Desktop Only in this container */}
        <div className="hidden lg:flex lg:w-[35%] h-[400px] lg:h-full min-w-[300px]">
            <PreviewPanel form={form} testiForm={testiForm} />
        </div>
      </div>

      {/* MOBILE PORTAL */}
      {showMobileEditor && createPortal(<MobileEditorOverlay />, document.body)}
    </div>
  );
};
