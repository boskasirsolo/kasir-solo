
import React from 'react';
import { Loader2, Rocket } from 'lucide-react';
import { PhoneMockup } from '../ui-parts';

export const PreviewPanel = ({ source, composer, state, actions }: any) => (
    <div className="w-full lg:w-[30%] min-w-[320px] bg-black/80 flex flex-col border-l border-white/5">
        <div className="p-4 border-b border-white/5 text-center shrink-0">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">3. Preview & Launch</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] overflow-hidden">
            <div className="scale-75 lg:scale-90 transform origin-center">
                <PhoneMockup 
                    image={state.customImage || source.selectedItem?.image || ''} 
                    caption={composer.captions[composer.activeTab === 'master' ? 'instagram' : composer.activeTab]} 
                    platform={composer.activeTab === 'master' ? 'instagram' : composer.activeTab} 
                />
            </div>
        </div>
        <div className="p-6 border-t border-white/5 bg-brand-dark shrink-0">
            <button 
                onClick={actions.broadcastPost} 
                disabled={state.isPosting || !source.selectedItem} 
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-neon flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
                {state.isPosting ? <Loader2 size={20} className="animate-spin"/> : <Rocket size={20} />} BROADCAST SEKARANG
            </button>
            <p className="text-[10px] text-gray-500 text-center mt-3 truncate">
                Target: {Object.entries(composer.platforms).filter(([_,v])=>v).map(([k])=>k).join(', ')}
            </p>
        </div>
    </div>
);
