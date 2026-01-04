
import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, UserPlus, Zap, Target, Shield, Flame, XCircle, HeartHandshake, Mail, UploadCloud, FileText, CheckCircle2, Loader2, X, AlertTriangle } from 'lucide-react';
import { JobOpening } from '../types';
import { Button, Card, Badge, SectionHeader, Input, TextArea } from '../components/ui';
import { uploadToSupabase, supabase, renameFile, slugify, normalizePhone } from '../utils';

const JobCard: React.FC<{ job: JobOpening, onClick: () => void }> = ({ job, onClick }) => (
  <div onClick={onClick} className="h-full">
    <Card className="p-6 border border-white/5 hover:border-brand-orange/50 transition-all cursor-pointer group hover:-translate-y-1 h-full bg-brand-dark hover:bg-brand-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Badge className="mb-2 bg-brand-orange/10 text-brand-orange border-brand-orange/20">{job.division}</Badge>
          <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors">{job.title}</h3>
        </div>
        {job.is_active && <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>}
      </div>
      
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
        <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
        <span className="flex items-center gap-1"><Clock size={12}/> {job.type}</span>
      </div>

      <p className="text-sm text-gray-400 line-clamp-2 mb-6 leading-relaxed">
        {job.description}
      </p>

      <div className="flex items-center text-brand-orange text-xs font-bold uppercase tracking-widest gap-2 mt-auto">
        Buka Misi <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
      </div>
    </Card>
  </div>
);

// --- COMPONENT: APPLICATION FORM MODAL ---
const ApplicationModal = ({ 
    positionTitle, 
    onClose 
}: { 
    positionTitle: string, 
    onClose: () => void 
}) => {
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        phone: '',
        portfolio_url: '',
        cover_letter: ''
    });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) { // 2MB Limit
                alert("Woi, file kegedean! Maksimal 2MB aja. Kompres dulu.");
                return;
            }
            if (file.type !== 'application/pdf') {
                alert("Format wajib PDF. Jangan kirim Word atau JPG.");
                return;
            }
            setCvFile(file);
        }
    };

    const handleSubmit = async (e?: React.SyntheticEvent) => {
        if (e) e.preventDefault();
        if (!form.full_name || !form.email || !form.phone || !cvFile) {
            return alert("Data belum lengkap bos. Cek lagi Nama, Email, WA, sama CV.");
        }

        // STRICT VALIDATION
        const cleanPhone = normalizePhone(form.phone);
        if (!cleanPhone) {
            return alert("Nomor WA salah format. Pake 08xx atau 628xx.");
        }

        if (!supabase) {
            alert("Mode Demo: Form ini butuh koneksi Supabase beneran.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload CV to 'careers' bucket
            const seoName = `${slugify(form.full_name)}-cv-${slugify(positionTitle)}`;
            const fileToUpload = renameFile(cvFile, seoName);
            
            // NOTE: Uploading to 'careers' bucket, folder 'resumes'
            const { path: cvPath } = await uploadToSupabase(fileToUpload, 'resumes', 'careers');

            // 2. Insert into 'applicants' table
            const { error } = await supabase.from('applicants').insert([{
                full_name: form.full_name,
                email: form.email,
                phone: cleanPhone, // Use validated phone
                portfolio_url: form.portfolio_url,
                cv_url: cvPath,
                cover_letter: form.cover_letter,
                position: positionTitle,
                status: 'pending'
            }]);

            if (error) throw error;

            setIsSuccess(true);
        } catch (error: any) {
            console.error("Application Error:", error);
            alert(`Gagal kirim: ${error.message}. Coba lagi nanti atau WA admin.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose}></div>
                <div className="relative bg-brand-dark border border-green-500/30 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl animate-fade-in">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Berkas Masuk!</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        Sip, <span className="text-white font-bold">{form.full_name}</span>. Data lo udah di meja gue. Kalau profil lo "ngeri" dan cocok, gue atau tim inti bakal langsung WA lo.
                    </p>
                    <Button onClick={onClose} className="px-8 py-3 mx-auto shadow-neon">Siap, Ditunggu</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-brand-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col my-8 animate-fade-in">
                
                {/* Header */}
                <div className="p-5 border-b border-white/10 bg-brand-card rounded-t-2xl flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-white">Gabung Pasukan</h3>
                        <p className="text-xs text-brand-orange font-bold uppercase tracking-wider">Misi: {positionTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar max-h-[70vh]">
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1.5">Siapa Lo? (Identitas)</label>
                        <Input 
                            value={form.full_name} 
                            onChange={e => setForm({...form, full_name: e.target.value})} 
                            placeholder="Nama Lengkap (Sesuai KTP)" 
                            className="mb-2 text-sm"
                            autoFocus={true} 
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email Utama" type="email" className="text-sm"/>
                            <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="WhatsApp (Wajib Aktif)" type="tel" className="text-sm"/>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1.5">Pamerin Skill Lo (Portfolio)</label>
                        <Input value={form.portfolio_url} onChange={e => setForm({...form, portfolio_url: e.target.value})} placeholder="https://linkedin.com/in/..." className="text-sm"/>
                        <p className="text-[10px] text-gray-500 mt-1 italic">*Biar gue bisa kepo skill lo sedalam apa.</p>
                    </div>

                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1.5">Upload CV (Senjata Utama)</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                                cvFile ? 'border-brand-orange bg-brand-orange/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                            }`}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="application/pdf" 
                                onChange={handleFileChange}
                            />
                            <UploadCloud size={24} className={`mx-auto mb-2 ${cvFile ? 'text-brand-orange' : 'text-gray-500'}`} />
                            {cvFile ? (
                                <div>
                                    <p className="text-brand-orange text-sm font-bold truncate px-4">{cvFile.name}</p>
                                    <p className="text-gray-500 text-[10px]">Klik buat ganti file</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-300 text-sm font-bold">Drop PDF CV Disini</p>
                                    <p className="text-gray-500 text-[10px] mt-1">Maks. 2MB. Pastikan update terakhir.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1.5">Yakinin Gue (Pitching)</label>
                        <TextArea 
                            value={form.cover_letter} 
                            onChange={e => setForm({...form, cover_letter: e.target.value})} 
                            placeholder="Gak usah formal kayak surat lamaran CPNS. Ceritain kenapa skill lo bakal bikin bisnis ini makin kenceng..." 
                            className="h-24 text-sm"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="p-5 border-t border-white/10 bg-brand-card rounded-b-2xl">
                    <Button onClick={() => handleSubmit()} disabled={isSubmitting} className="w-full py-3 shadow-neon">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <><Mail size={16}/> KIRIM LAMARAN & BERJUANG</>}
                    </Button>
                    <p className="text-[10px] text-gray-500 text-center mt-3">
                        *Tenang, data lo aman di server gue. Gak bakal gue jual ke pihak ketiga.
                    </p>
                </div>
            </div>
        </div>
    );
};

const JobDetailModal = ({ job, onClose, onApply }: { job: JobOpening, onClose: () => void, onApply: () => void }) => {
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
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Misi Harian (Scope)</h4>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
           </div>
           
           <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Syarat Masuk (Specs)</h4>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-black/20 p-4 rounded-lg border border-white/5">
                 {job.requirements}
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-brand-card rounded-b-2xl flex justify-end gap-3">
           <Button variant="outline" onClick={onClose}>Tutup</Button>
           <button 
             onClick={onApply}
             className="px-6 py-2 bg-brand-orange hover:bg-brand-action text-white rounded-lg font-bold shadow-neon hover:shadow-neon-strong transition-all flex items-center gap-2"
           >
             <Briefcase size={18}/> AMBIL TANTANGAN INI
           </button>
        </div>
      </div>
    </div>
  );
};

export const CareerPage = ({ jobs }: { jobs: JobOpening[] }) => {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [showAppForm, setShowAppForm] = useState(false);
  const [applyPosition, setApplyPosition] = useState("Spontaneous Application");
  
  const activeJobs = jobs.filter(j => j.is_active);

  const handleApplyClick = (title: string) => {
      setApplyPosition(title);
      setSelectedJob(null); // Close detail modal
      setShowAppForm(true); // Open form modal
      // Automatically scroll to top to ensure modal is centered and user sees it
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section - The Hook */}
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

      {/* CULTURE MANIFESTO - The Why */}
      <section className="py-20 bg-brand-dark relative overflow-hidden">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">DNA <span className="text-brand-orange">GUE</span></h2>
               <p className="text-gray-400 text-sm max-w-2xl mx-auto">Gue pernah jatuh sejatuh-jatuhnya di 2022. Kehilangan domain, kehilangan aset. Gue bangkit lagi sendirian. Kalau mental lo tempe, lo gak bakal bertahan di sini.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {/* Value 1 */}
               <div className="p-8 bg-brand-card/30 border border-white/5 rounded-2xl hover:border-brand-orange/30 transition-all group">
                  <div className="w-14 h-14 bg-brand-dark border border-brand-orange/20 rounded-xl flex items-center justify-center text-brand-orange mb-6 group-hover:scale-110 transition-transform shadow-neon-text">
                     <Flame size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Tahan Banting (Resilience)</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Masalah teknis, komplain klien, deadline mepet itu makanan sehari-hari gue. Gue gak butuh orang yang dikit-dikit ngeluh (sambat). Gue butuh <em>Problem Solver</em> yang tenang pas badai dateng.
                  </p>
               </div>

               {/* Value 2 */}
               <div className="p-8 bg-brand-card/30 border border-white/5 rounded-2xl hover:border-brand-orange/30 transition-all group">
                  <div className="w-14 h-14 bg-brand-dark border border-brand-orange/20 rounded-xl flex items-center justify-center text-brand-orange mb-6 group-hover:scale-110 transition-transform shadow-neon-text">
                     <Target size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Impact Over Output</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Jangan bangga cuma karena lo 'lembur' atau 'kelihatan sibuk'. Gue cuma nilai hasil akhir. Kode lo bikin transaksi makin cepet? Desain lo bikin user paham? Itu yang gue itung.
                  </p>
               </div>

               {/* Value 3 */}
               <div className="p-8 bg-brand-card/30 border border-white/5 rounded-2xl hover:border-brand-orange/30 transition-all group">
                  <div className="w-14 h-14 bg-brand-dark border border-brand-orange/20 rounded-xl flex items-center justify-center text-brand-orange mb-6 group-hover:scale-110 transition-transform shadow-neon-text">
                     <HeartHandshake size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Empati ke User</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Klien gue itu pedagang pasar, ustadz TPA, dan pengusaha rintisan. Sistem lo harus membumi. Jangan bikin UI/UX rumit yang cuma dimengerti sama anak startup Jaksel.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* FILTER SECTION - The Filter */}
      <section className="py-16 bg-red-950/20 border-y border-red-500/10">
         <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center justify-center gap-2">
               <AlertTriangle className="text-red-500" /> JANGAN COBA-COBA MASUK KALAU:
            </h3>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
               {["Mental PNS (Cari Aman Doang)", "Baperan (Anti Kritik)", "Males Belajar Hal Baru", "Kerja Kayak Robot (Gak Ada Inisiatif)"].map((item, i) => (
                  <div key={i} className="bg-brand-black px-6 py-3 rounded-full border border-red-500/30 text-gray-300 text-sm flex items-center gap-2">
                     <span className="w-2 h-2 bg-red-500 rounded-full"></span> {item}
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* OPEN POSITIONS - The Opportunity */}
      <section className="py-24 bg-brand-black" id="openings">
        <div className="container mx-auto px-4">
          <SectionHeader title="Posisi" highlight="Tempur" subtitle="Kalau lo merasa punya DNA yang sama, ambil senjata lo dan gabung barisan." />
          
          {activeJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeJobs.map(job => (
                <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-brand-card/30 rounded-3xl border border-white/5">
               <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center mb-6 text-brand-orange shadow-neon">
                  <Shield size={32} />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Posisi Lagi Penuh</h3>
               <p className="text-gray-400 max-w-md text-center mb-8 leading-relaxed">
                 Tim inti gue lagi lengkap. Tapi, kalau lo ngerasa skill lo di atas rata-rata (Top 1%) dan yakin bisa kasih impact gila ke visi-misi Mesin Kasir Solo, coba paksa gue buat hire lo lewat tombol ini.
               </p>
               <Button 
                  onClick={() => handleApplyClick("Spontaneous Application (Jalur Nekat)")} 
                  className="px-8 py-4 text-base font-bold shadow-neon hover:shadow-neon-strong transition-transform hover:-translate-y-1 bg-gradient-to-r from-brand-orange to-red-600 text-white border-0"
               >
                  <FileText size={18} className="mr-2" /> Upload CV Spontan
               </Button>
            </div>
          )}

        </div>
      </section>

      {/* Modals */}
      {selectedJob && (
          <JobDetailModal 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
            onApply={() => handleApplyClick(selectedJob.title)}
          />
      )}

      {showAppForm && (
          <ApplicationModal 
            positionTitle={applyPosition} 
            onClose={() => setShowAppForm(false)} 
          />
      )}
    </div>
  );
};
