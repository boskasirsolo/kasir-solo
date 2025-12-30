import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, UserPlus, Coffee, Ghost } from 'lucide-react';
import { JobOpening } from '../types';
import { Button, Card, Badge, SectionHeader } from '../components/ui';

const JobCard: React.FC<{ job: JobOpening, onClick: () => void }> = ({ job, onClick }) => (
  <div onClick={onClick} className="h-full">
    <Card className="p-6 border border-white/5 hover:border-brand-orange/50 transition-all cursor-pointer group hover:-translate-y-1 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Badge className="mb-2 bg-brand-orange/10 text-brand-orange border-brand-orange/20">{job.division}</Badge>
          <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors">{job.title}</h3>
        </div>
        {job.is_active && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>}
      </div>
      
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
        <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
        <span className="flex items-center gap-1"><Clock size={12}/> {job.type}</span>
      </div>

      <p className="text-sm text-gray-400 line-clamp-2 mb-6 leading-relaxed">
        {job.description}
      </p>

      <div className="flex items-center text-brand-orange text-xs font-bold uppercase tracking-widest gap-2">
        Lihat Detail <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
      </div>
    </Card>
  </div>
);

const JobDetailModal = ({ job, onClose }: { job: JobOpening, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-brand-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-brand-card rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{job.title}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-400">
               <span className="text-brand-orange font-bold">{job.division}</span>
               <span>•</span>
               <span>{job.type}</span>
               <span>•</span>
               <span>{job.location}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
             <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
           <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Deskripsi Pekerjaan</h4>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
           </div>
           
           <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Kualifikasi</h4>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-black/20 p-4 rounded-lg border border-white/5">
                 {job.requirements}
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-brand-card rounded-b-2xl flex justify-end gap-3">
           <Button variant="outline" onClick={onClose}>Tutup</Button>
           <a 
             href={`https://wa.me/6282325103336?text=Halo HRD PT Mesin Kasir Solo, saya ingin melamar posisi: ${job.title}. Berikut CV saya...`}
             target="_blank"
             rel="noreferrer"
             className="px-6 py-2 bg-brand-orange hover:bg-brand-action text-white rounded-lg font-bold shadow-neon hover:shadow-neon-strong transition-all flex items-center gap-2"
           >
             <Briefcase size={18}/> Lamar Sekarang
           </a>
        </div>
      </div>
    </div>
  );
};

export const CareerPage = ({ jobs }: { jobs: JobOpening[] }) => {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const activeJobs = jobs.filter(j => j.is_active);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <UserPlus size={14} className="text-brand-orange" />
            <span className="text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">We Are Hiring</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Bangun Masa Depan <br/><span className="text-brand-orange">Digital Indonesia</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed mb-10">
            Bergabunglah dengan tim yang berdedikasi membantu jutaan UMKM naik kelas melalui teknologi. Bukan sekadar kerja, tapi berkarya.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-brand-black">
        <div className="container mx-auto px-4">
          
          {activeJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeJobs.map(job => (
                <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-brand-card/50 rounded-3xl border-2 border-dashed border-white/5">
               <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                  <Ghost size={40} />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Belum Ada Lowongan</h3>
               <p className="text-gray-400 max-w-md mx-auto mb-8">
                 Saat ini belum ada posisi terbuka. Namun kami selalu mencari talenta berbakat. Kirimkan CV terbaikmu untuk database kami.
               </p>
               <a 
                 href="mailto:hrd@kasirsolo.com?subject=General Application - [Nama Anda]"
                 className="inline-flex items-center gap-2 px-8 py-3 border border-white/20 hover:border-brand-orange text-white rounded-xl font-bold transition-all hover:bg-brand-orange/10"
               >
                 <Coffee size={18}/> Kirim General CV
               </a>
            </div>
          )}

        </div>
      </section>

      {/* Culture Teaser */}
      <section className="py-20 bg-brand-dark border-t border-white/5">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-8">Kenapa Bergabung?</h2>
            <div className="grid md:grid-cols-3 gap-8">
               <div className="p-6">
                  <div className="text-brand-orange font-display font-bold text-4xl mb-2">01</div>
                  <h4 className="text-white font-bold mb-2">Impactful Work</h4>
                  <p className="text-gray-400 text-sm">Karyamu dipakai ribuan bisnis setiap hari.</p>
               </div>
               <div className="p-6">
                  <div className="text-brand-orange font-display font-bold text-4xl mb-2">02</div>
                  <h4 className="text-white font-bold mb-2">Continuous Learning</h4>
                  <p className="text-gray-400 text-sm">Akses ke course premium & mentorship.</p>
               </div>
               <div className="p-6">
                  <div className="text-brand-orange font-display font-bold text-4xl mb-2">03</div>
                  <h4 className="text-white font-bold mb-2">Cool Office</h4>
                  <p className="text-gray-400 text-sm">Lingkungan kerja nyaman, free coffee & snacks.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Modal */}
      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};