
import React from 'react';
import { Search, RefreshCw, Filter, Video, FileText, CheckCircle, XCircle, Truck, Wrench, MessageCircle, Save, X, ExternalLink } from 'lucide-react';
import { useRMALogic } from './logic';
import { RMAStatus, RMA_STATUS_CONFIG } from './types';
import { LoadingSpinner, Button, TextArea } from '../ui';

const StatusChip = ({ status }: { status: RMAStatus }) => {
    const config = RMA_STATUS_CONFIG[status];
    return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${config.color}`}>
            {config.label}
        </span>
    );
};

export const AdminRMA = () => {
    const { state, actions } = useRMALogic();

    return (
        <div className="h-[800px] flex flex-col bg-brand-black border border-white/5 rounded-xl overflow-hidden relative">
            
            {/* HEADER TOOLBAR */}
            <div className="p-4 bg-brand-dark border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search size={14} className="absolute left-3 top-3 text-gray-500" />
                        <input 
                            value={state.searchTerm}
                            onChange={(e) => actions.setSearchTerm(e.target.value)}
                            placeholder="Cari Order ID / SN / WA..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-brand-orange outline-none"
                        />
                    </div>
                    <button onClick={actions.refresh} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"><RefreshCw size={16}/></button>
                </div>

                <div className="flex gap-2 overflow-x-auto custom-scrollbar w-full md:w-auto pb-2 md:pb-0">
                    <button onClick={() => actions.setSelectedStatus('all')} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${state.selectedStatus === 'all' ? 'bg-white/10 text-white border-white/20' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>All</button>
                    {(Object.keys(RMA_STATUS_CONFIG) as RMAStatus[]).map(s => (
                        <button 
                            key={s} 
                            onClick={() => actions.setSelectedStatus(s)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${state.selectedStatus === s ? RMA_STATUS_CONFIG[s].color : 'bg-transparent text-gray-500 border-white/5'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* LIST CONTENT */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-brand-dark/50">
                {state.loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>
                ) : state.filteredTickets.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 text-xs italic border-2 border-dashed border-white/5 rounded-xl">Belum ada tiket klaim.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {state.filteredTickets.map(ticket => (
                            <div 
                                key={ticket.id} 
                                onClick={() => actions.openDetail(ticket)}
                                className="bg-brand-card border border-white/5 hover:border-brand-orange/50 p-4 rounded-xl cursor-pointer group transition-all relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-mono text-[10px] text-gray-500">#{ticket.id}</span>
                                    <StatusChip status={ticket.status} />
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-brand-orange transition-colors">{ticket.issue_type}</h4>
                                <p className="text-xs text-gray-400 mb-4 line-clamp-2">Order: <span className="font-mono text-white">{ticket.order_id}</span> • {ticket.customer_phone}</p>
                                
                                <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-white/5 pt-3 mt-auto">
                                    <span>{new Date(ticket.created_at).toLocaleDateString('id-ID')}</span>
                                    <span className="uppercase font-bold text-brand-orange">{ticket.solution_preference}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* DETAIL MODAL (SIDEBAR STYLE) */}
            {state.selectedTicket && (
                <div className="absolute inset-y-0 right-0 w-full md:w-[500px] bg-brand-card border-l border-white/10 shadow-2xl flex flex-col z-50 animate-slide-in-right">
                    {/* Modal Header */}
                    <div className="p-5 border-b border-white/10 flex justify-between items-center bg-brand-dark shrink-0">
                        <div>
                            <h3 className="text-lg font-bold text-white">Tiket #{state.selectedTicket.id}</h3>
                            <p className="text-xs text-gray-500 font-mono">Order ID: {state.selectedTicket.order_id}</p>
                        </div>
                        <button onClick={actions.closeDetail} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X size={20}/></button>
                    </div>

                    {/* Modal Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                        
                        {/* Status Control */}
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Update Status Workflow</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => actions.updateStatus(state.selectedTicket!.id, 'approved')} className="flex items-center justify-center gap-1 py-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white text-[10px] font-bold transition-all"><Truck size={12}/> APPROVE (KIRIM)</button>
                                <button onClick={() => actions.updateStatus(state.selectedTicket!.id, 'received')} className="flex items-center justify-center gap-1 py-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white text-[10px] font-bold transition-all"><Wrench size={12}/> TERIMA (CEK)</button>
                                <button onClick={() => actions.updateStatus(state.selectedTicket!.id, 'completed')} className="flex items-center justify-center gap-1 py-2 rounded bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white text-[10px] font-bold transition-all"><CheckCircle size={12}/> SELESAI</button>
                                <button onClick={() => actions.updateStatus(state.selectedTicket!.id, 'rejected')} className="flex items-center justify-center gap-1 py-2 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white text-[10px] font-bold transition-all"><XCircle size={12}/> TOLAK</button>
                            </div>
                        </div>

                        {/* Issue Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Serial Number (Fisik)</label>
                                <p className="text-sm font-mono font-bold text-white bg-white/5 p-2 rounded border border-white/5">{state.selectedTicket.serial_number}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Kronologi User</label>
                                <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-3 rounded border border-white/5 italic">"{state.selectedTicket.chronology}"</p>
                            </div>
                        </div>

                        {/* Evidence */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2"><Video size={12}/> Bukti Digital</label>
                            <div className="grid grid-cols-2 gap-2">
                                <a href={state.selectedTicket.evidence_urls.unboxing} target="_blank" className="flex items-center justify-center gap-2 p-3 rounded bg-brand-orange/10 border border-brand-orange/30 text-brand-orange hover:bg-brand-orange hover:text-white transition-all text-xs font-bold">
                                    <ExternalLink size={14}/> VIDEO UNBOXING
                                </a>
                                {state.selectedTicket.evidence_urls.damage ? (
                                    <a href={state.selectedTicket.evidence_urls.damage} target="_blank" className="flex items-center justify-center gap-2 p-3 rounded bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-xs font-bold">
                                        <ExternalLink size={14}/> VIDEO KENDALA
                                    </a>
                                ) : (
                                    <div className="flex items-center justify-center p-3 rounded bg-black/20 text-gray-600 text-xs italic">Tanpa Video Kendala</div>
                                )}
                            </div>
                        </div>

                        {/* Admin Notes */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block flex items-center gap-2"><FileText size={12}/> Catatan Teknisi (Internal)</label>
                            <TextArea 
                                value={state.adminNote}
                                onChange={(e) => actions.setAdminNote(e.target.value)}
                                placeholder="Tulis hasil diagnosa / alasan penolakan di sini..."
                                className="h-32 text-xs bg-black/40 border-white/10"
                            />
                            <div className="flex justify-end mt-2">
                                <button onClick={actions.saveNote} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-bold text-white transition-all">
                                    <Save size={14}/> Simpan Catatan
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 border-t border-white/10 bg-brand-dark shrink-0">
                        <a 
                            href={actions.getWaLink(state.selectedTicket)}
                            target="_blank"
                            className="flex items-center justify-center w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg transition-all gap-2 text-sm"
                        >
                            <MessageCircle size={18} /> UPDATE CUSTOMER VIA WA
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};
