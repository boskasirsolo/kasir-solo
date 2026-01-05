
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
    <div className="flex flex-col lg:flex-row h-auto lg:h-[850px] border-t border-white/5 bg-brand-black overflow-hidden rounded-xl border-b shadow-2xl">
      
      {/* COLUMN 1: LIST (25%) */}
      <div className="w-full lg:w-[25%] h-[400px] lg:h-full border-r-0 lg:border-r border-b lg:border-b-0 border-white/5 min-w-[280px]">
          <ListPanel state={listState} actions={actions} activeId={form.id} />
      </div>

      {/* COLUMN 2: EDITOR (40%) */}
      <div className="w-full lg:w-[40%] h-[600px] lg:h-full border-r-0 lg:border-r border-b lg:border-b-0 border-white/5 min-w-[350px]">
          <EditorPanel 
             form={form} setForm={setForm}
             testiForm={testiForm} setTestiForm={setTestiForm}
             loading={loading}
             useWatermark={useWatermark} setUseWatermark={setUseWatermark}
             actions={actions}
          />
      </div>

      {/* COLUMN 3: PREVIEW (35%) */}
      <div className="w-full lg:w-[35%] h-[400px] lg:h-full min-w-[300px]">
          <PreviewPanel form={form} testiForm={testiForm} />
      </div>

    </div>
  );
};
