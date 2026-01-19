
import React from 'react';
import { ShieldCheck, BadgeCheck } from 'lucide-react';
import { SiteConfig } from '../../../types';

export const AboutLegality = ({ config }: { config?: SiteConfig }) => (
    <section className="py-20 bg-brand-black border-t border-white/5">
       <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
             <ShieldCheck size={40} className="mx-auto text-blue-500 mb-4" />
             <h2 className="text-3xl font-display font-bold text-white mb-2">Gue Main Bersih</h2>
             <p className="text-gray-400">Bisnis itu soal kepercayaan. Gue gak mau ngerusak nama yang udah gue bangun lagi dari nol. Ini buktinya gue legal.</p>
          </div>
          
          <div className="bg-brand-card/50 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg">
             <div className="flex-1 space-y-4 w-full">
                {config?.company_legal_name && (
                   <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gray-400 text-sm">Badan Hukum</span>
                      <span className="text-white font-bold text-sm flex items-center gap-2"><BadgeCheck size={14} className="text-blue-400"/> {config.company_legal_name}</span>
                   </div>
                )}
                {config?.nib_number && (
                   <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gray-400 text-sm">NIB (Izin Usaha)</span>
                      <span className="text-white font-mono text-sm">{config.nib_number}</span>
                   </div>
                )}
                {config?.ahu_number && (
                   <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gray-400 text-sm">SK Kemenkumham</span>
                      <span className="text-white font-mono text-sm">{config.ahu_number}</span>
                   </div>
                )}
                {config?.npwp_number && (
                   <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gray-400 text-sm">NPWP Perusahaan</span>
                      <span className="text-white font-mono text-sm">{config.npwp_number}</span>
                   </div>
                )}
                <div className="pt-2">
                   <p className="text-xs text-gray-500 leading-relaxed italic">
                      *Buat lo yang butuh dokumen asli buat vendor list atau tender, chat admin gue. Kita transparan.
                   </p>
                </div>
             </div>
             
             <div className="w-full md:w-auto flex justify-center">
                <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-xl text-center max-w-xs">
                    <p className="text-blue-200 text-xs font-bold mb-2 uppercase tracking-wider">Cek Validitas</p>
                    <p className="text-xs text-gray-400 mb-4">Lo bisa cek sendiri data perusahaan gue di web pemerintah biar yakin.</p>
                    <a href="https://oss.go.id" target="_blank" rel="noreferrer" className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors">
                       Buka OSS.GO.ID
                    </a>
                </div>
             </div>
          </div>
       </div>
    </section>
);
