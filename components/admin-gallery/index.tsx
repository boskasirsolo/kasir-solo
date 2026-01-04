import React from 'react';
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
    loading, actions, listState 
  } = useGalleryLogic(gallery, setGallery, testimonials, setTestimonials);

  return (
    <div className="flex h-[850px] border-t border-white/5 bg-brand-black overflow-hidden rounded-xl border-b shadow-2xl">
      
      {/* COLUMN 1: LIST (25%) */}
      <div className="w-[25%] min-w-[280px] border-r border-white/5">
          <ListPanel state={listState} actions={actions} activeId={form.id} />
      </div>

      {/* COLUMN 2: EDITOR (40%) */}
      <div className="w-[40%] min-w-[350px] border-r border-white/5">
          <EditorPanel 
             form={form} setForm={setForm}
             testiForm={testiForm} setTestiForm={setTestiForm}
             loading={loading}
             useWatermark={useWatermark} setUseWatermark={setUseWatermark}
             actions={actions}
          />
      </div>

      {/* COLUMN 3: PREVIEW (35%) */}
      <div className="w-[35%] min-w-[300px]">
          <PreviewPanel form={form} testiForm={testiForm} />
      </div>

    </div>
  );
};