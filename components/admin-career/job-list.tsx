
import React from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { JobOpening } from '../../types';

export const JobList = ({ 
    state, 
    actions 
}: { 
    state: any, 
    actions: any 
}) => {
    return (
        <div className="bg-brand-dark rounded-xl border border-white/5 flex flex-col h-full overflow-hidden md:sticky md:top-6">
            <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
                <div className="relative flex-grow">
                    <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                    <input 
                        type="text" 
                        value={state.searchTerm}
                        onChange={(e) => state.setSearchTerm(e.target.value)}
                        placeholder="Cari lowongan..." 
                        className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                    />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Total: {state.filteredJobs.length}</span>
            </div>

            <div className="p-4 space-y-3 flex-grow overflow-y-auto custom-scrollbar">
                {state.filteredJobs.length === 0 && <p className="text-center text-gray-500 text-xs py-10">Belum ada lowongan aktif.</p>}
                {state.filteredJobs.map((job: JobOpening) => (
                    <div key={job.id} className="bg-brand-card p-4 rounded-lg border border-white/5 flex justify-between items-start group hover:border-brand-orange/30 transition-colors">
                        <div>
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                {job.title}
                                {!job.is_active && <span className="text-[9px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20">CLOSED</span>}
                            </h4>
                            <div className="flex gap-3 text-xs text-gray-400 mt-1">
                                <span>{job.division}</span>
                                <span>•</span>
                                <span>{job.type}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => actions.handleEditClick(job)} className="text-blue-400 hover:text-white p-1 bg-blue-500/10 rounded hover:bg-blue-500"><Edit size={14}/></button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); actions.deleteJob(job.id); }} className="text-red-400 hover:text-white p-1 bg-red-500/10 rounded hover:bg-red-500"><Trash2 size={14}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};