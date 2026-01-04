
import React, { useState } from 'react';
import { Briefcase, Users } from 'lucide-react';
import { JobOpening } from '../../types';
import { useJobLogic, useApplicantLogic } from './logic';
import { JobList } from './job-list';
import { JobEditor } from './job-editor';
import { ApplicantList } from './applicant-list';

export const AdminCareer = ({ 
    jobs, 
    setJobs 
}: { 
    jobs: JobOpening[], 
    setJobs: (j: JobOpening[]) => void 
}) => {
    const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');
    const jobLogic = useJobLogic(jobs, setJobs);
    const applicantLogic = useApplicantLogic();

    return (
        <div>
            {/* SUB-NAV */}
            <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-1">
                <button 
                    onClick={() => setActiveTab('jobs')}
                    className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'jobs' ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                    <div className="flex items-center gap-2"><Briefcase size={16}/> Lowongan Kerja</div>
                </button>
                <button 
                    onClick={() => setActiveTab('applicants')}
                    className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'applicants' ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                    <div className="flex items-center gap-2"><Users size={16}/> Data Pelamar</div>
                </button>
            </div>

            {/* CONTENT */}
            {activeTab === 'jobs' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-[700px]">
                    {/* LIST (7 Columns) */}
                    <div className="lg:col-span-7 h-full">
                        <JobList state={jobLogic.listState} actions={jobLogic.actions} />
                    </div>

                    {/* EDITOR (5 Columns) */}
                    <div className="lg:col-span-5 h-full overflow-y-auto custom-scrollbar">
                        <JobEditor 
                            form={jobLogic.form}
                            setForm={jobLogic.setForm}
                            loading={jobLogic.loading}
                            aiLoading={jobLogic.aiLoading}
                            actions={jobLogic.actions}
                        />
                    </div>
                </div>
            ) : (
                <ApplicantList 
                    applicants={applicantLogic.applicants}
                    loading={applicantLogic.loading}
                    downloadCV={applicantLogic.downloadCV}
                    downloadingId={applicantLogic.downloadingId}
                    updateStatus={applicantLogic.updateStatus}
                    onRefresh={applicantLogic.fetchApplicants}
                />
            )}
        </div>
    );
};
