
import React, { useState } from 'react';
import { HardDrive, PlayCircle, HelpCircle } from 'lucide-react';
import { useDownloadLogic } from './logic';
import { DownloadList } from './download-list';
import { DownloadEditor } from './download-editor';
import { TutorialPanel } from './tutorial-panel';
import { FaqPanel } from './faq-panel';

export const AdminDownloads = () => {
    const [activeTab, setActiveTab] = useState<'files' | 'tutorials' | 'faq'>('files');
    const dlLogic = useDownloadLogic();

    return (
        <div className="h-[650px] flex flex-col">
            {/* TAB NAV */}
            <div className="flex gap-2 mb-6 border-b border-white/10 pb-1">
                {[
                    { id: 'files', label: 'File Download', icon: HardDrive },
                    { id: 'tutorials', label: 'Video Tutorial', icon: PlayCircle },
                    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-colors ${activeTab === tab.id ? 'bg-brand-orange text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            <div className="flex-grow overflow-hidden">
                {activeTab === 'files' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                        <div className="lg:col-span-7 h-full">
                            <DownloadList 
                                state={dlLogic.listState} 
                                onEdit={dlLogic.handleEditClick} 
                                onDelete={dlLogic.deleteItem}
                                onReset={dlLogic.resetForm}
                            />
                        </div>
                        <div className="lg:col-span-5 h-full">
                            <DownloadEditor logic={dlLogic} />
                        </div>
                    </div>
                )}

                {activeTab === 'tutorials' && <TutorialPanel />}
                {activeTab === 'faq' && <FaqPanel />}
            </div>
        </div>
    );
};
