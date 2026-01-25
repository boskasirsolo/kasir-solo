
import React from 'react';
import { MapPin, Clock, ArrowRight, Shield } from 'lucide-react';
import { JobOpening } from '../../types';
import { Card, Badge, SectionHeader, Button } from '../ui';

export const JobBoard = ({ jobs, onSelect, onNekat }: { jobs: JobOpening[], onSelect: (j: JobOpening) => void, onNekat: () => void }) => {
    const activeJobs = jobs.filter(j => j.is_active);

    return (
        <section className="py-24 bg-brand-black" id="openings">
            <div className="container mx-auto px-4">
                <SectionHeader title="Posisi" highlight="Tempur" subtitle="Kalau lo merasa punya DNA yang sama, ambil senjata lo dan gabung barisan." />
                
                {activeJobs.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeJobs.map(job => (
                            <div key={job.id} onClick={() => onSelect(job)} className="h-full cursor-pointer group">
                                <Card className="p-6 border border-white/5 hover:border-brand-orange/50 transition-all bg-brand-dark h-full">
                                    <Badge className="mb-2 bg-brand-orange/10 text-brand-orange border-brand-orange/20">{job.division}</Badge>
                                    <h3 className="text-xl font-bold text-white group-hover:text-brand-orange mb-4">{job.title}</h3>
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                                        <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                                        <span className="flex items-center gap-1"><Clock size={12}/> {job.type}</span>
                                    </div>
                                    <div className="flex items-center text-brand-orange text-xs font-bold uppercase tracking-widest gap-2 mt-auto">
                                        Buka Misi <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-4 bg-brand-card/30 rounded-3xl border border-white/5">
                        <Shield size={64} className="text-brand-orange mb-6 shadow-neon" />
                        <h3 className="text-2xl font-bold text-white mb-2">Gue Belum Buka Lowongan</h3>
                        <p className="text-gray-400 max-w-md text-center mb-8">Skill lo di atas rata-rata (Top 1%)? Coba paksa gue hire lo lewat jalur nekat.</p>
                        <Button onClick={onNekat} className="px-8 py-4 bg-gradient-to-r from-brand-orange to-red-600 shadow-neon">UPLOAD CV SPONTAN</Button>
                    </div>
                )}
            </div>
        </section>
    );
};
