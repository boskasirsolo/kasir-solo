
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { JobOpening } from '../types';
import { CultureManifesto } from '../components/career/culture-manifesto';
import { JobBoard } from '../components/career/job-board';
import { JobDetailModal } from '../components/career/job-detail-modal';
import { ApplicationModal } from '../components/career/application-modal';

export const CareerPage = ({ jobs }: { jobs: JobOpening[] }) => {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [showAppForm, setShowAppForm] = useState(false);
  const [applyPosition, setApplyPosition] = useState("Spontaneous Application");

  const handleApply = (title: string) => {
    setApplyPosition(title);
    setSelectedJob(null);
    setShowAppForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in">
      <section className="relative py-24 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <UserPlus size={14} className="text-brand-orange" />
            <span className="text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">Join The Resistance</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Gue Gak Cari Karyawan,<br/>
            Gue Cari <span className="text-brand-orange">Partner Perjuangan.</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-400 leading-relaxed mb-10">
            PT Mesin Kasir Solo bukan tempat buat lo yang cuma cari "zona nyaman" 9-to-5. <br/>
            Ini markas buat lo yang mau ngebangun sistem buat nyelametin ribuan UMKM bareng gue.
          </p>
        </div>
      </section>

      <CultureManifesto />
      
      <JobBoard 
        jobs={jobs} 
        onSelect={setSelectedJob} 
        onNekat={() => handleApply("Jalur Nekat (Spontan)")} 
      />

      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} onApply={() => handleApply(selectedJob.title)} />
      )}

      {showAppForm && (
        <ApplicationModal positionTitle={applyPosition} onClose={() => setShowAppForm(false)} />
      )}
    </div>
  );
};
