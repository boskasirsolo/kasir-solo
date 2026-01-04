
import React from 'react';
import { LoadingSpinner } from '../ui';
import { Calendar, Download } from 'lucide-react';
import { Applicant } from './types';

export const ApplicantList = ({ 
    applicants, 
    loading, 
    downloadCV, 
    downloadingId, 
    updateStatus, 
    onRefresh 
}: any) => {
    return (
        <div className="bg-brand-dark border border-white/5 rounded-xl overflow-hidden flex flex-col h-[700px]">
            {/* Header */}
            <div className="p-4 bg-black/20 border-b border-white/5 flex justify-between items-center shrink-0">
                <div>
                    <h4 className="text-white font-bold text-sm">Database Pelamar</h4>
                    <p className="text-xs text-gray-500">Privasi Terjamin: CV hanya bisa diakses oleh Admin.</p>
                </div>
                <button onClick={onRefresh} className="text-xs text-brand-orange hover:underline">Refresh Data</button>
            </div>

            {/* Table */}
            <div className="overflow-auto custom-scrollbar flex-grow">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-white/5 text-gray-500 font-bold uppercase text-[10px] sticky top-0 backdrop-blur-md z-10">
                        <tr>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Nama Pelamar</th>
                            <th className="p-4">Posisi</th>
                            <th className="p-4">Kontak</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">CV / Resume</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center"><LoadingSpinner /></td></tr>
                        ) : applicants.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500 italic">Belum ada pelamar masuk.</td></tr>
                        ) : (
                            applicants.map((app: Applicant) => (
                                <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 whitespace-nowrap text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12}/>
                                            {new Date(app.created_at).toLocaleDateString('id-ID')}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-white">{app.full_name}</div>
                                        {app.portfolio_url && <a href={app.portfolio_url} target="_blank" className="text-[10px] text-blue-400 hover:underline truncate max-w-[150px] block">Link Portfolio</a>}
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-brand-orange/10 text-brand-orange px-2 py-1 rounded text-[10px] font-bold border border-brand-orange/20">
                                            {app.position}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs">
                                        <div className="mb-1">{app.email}</div>
                                        <div className="text-gray-500">{app.phone}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <select 
                                            value={app.status || 'pending'}
                                            onChange={(e) => updateStatus(app.id, e.target.value)}
                                            className={`bg-black border border-white/10 text-[10px] rounded px-2 py-1 outline-none cursor-pointer font-bold uppercase ${
                                                app.status === 'interview' ? 'text-blue-400 border-blue-500/30' :
                                                app.status === 'rejected' ? 'text-red-400 border-red-500/30' :
                                                app.status === 'accepted' ? 'text-green-400 border-green-500/30' :
                                                'text-yellow-500 border-yellow-500/30'
                                            }`}
                                        >
                                            <option value="pending">Reviewing</option>
                                            <option value="interview">Interview</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => downloadCV(app)}
                                            disabled={downloadingId === app.id}
                                            className="inline-flex items-center gap-2 bg-white/5 hover:bg-brand-orange hover:text-white text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/10"
                                        >
                                            {downloadingId === app.id ? <LoadingSpinner size={12}/> : <Download size={14} />}
                                            Download PDF
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
