
import React, { useState } from 'react';
import { useSocialStudio } from './logic';
import { ContentCalendar } from './calendar';
import { Product, Article, GalleryItem } from '../../types';
import { Calendar as CalendarIcon, Edit3 } from 'lucide-react';
import { SourcePickerPanel } from './sections/source-picker-panel';
import { ComposerPanel } from './sections/composer-panel';
import { PreviewPanel } from './sections/preview-panel';

export const AdminSocialStudio = ({
    products, articles, gallery
}: {
    products: Product[], articles: Article[], gallery: GalleryItem[]
}) => {
    const { source, composer, state, actions } = useSocialStudio(products, articles, gallery);
    const [studioMode, setStudioMode] = useState<'single' | 'calendar'>('single');

    return (
        <div className="flex flex-col h-auto lg:h-[850px] border-t border-white/5 bg-brand-black overflow-hidden rounded-xl border-b shadow-2xl">
            <div className="flex items-center gap-4 p-2 bg-black/40 border-b border-white/10 shrink-0">
                <button onClick={() => setStudioMode('single')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${studioMode === 'single' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500 hover:text-white'}`}><Edit3 size={14} /> Single Post</button>
                <button onClick={() => setStudioMode('calendar')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${studioMode === 'calendar' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500 hover:text-white'}`}><CalendarIcon size={14} /> Auto-Pilot Calendar</button>
            </div>

            {studioMode === 'calendar' ? (
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar"><ContentCalendar /></div>
            ) : (
                <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
                    <SourcePickerPanel source={source} onSelect={actions.handleSelectItem} />
                    <ComposerPanel source={source} composer={composer} state={state} actions={actions} />
                    <PreviewPanel source={source} composer={composer} state={state} actions={actions} />
                </div>
            )}
        </div>
    );
};
