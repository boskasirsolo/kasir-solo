
import { JobOpening } from '../../types';

export interface JobFormState {
    id: number | null;
    title: string;
    division: string;
    type: 'Full-time' | 'Part-time' | 'Internship' | 'Freelance';
    location: string;
    description: string;
    requirements: string;
    is_active: boolean;
}

export interface Applicant {
    id: number;
    created_at: string;
    full_name: string;
    email: string;
    phone: string;
    portfolio_url?: string;
    cv_url: string;
    cover_letter?: string;
    position: string;
    status: 'pending' | 'interview' | 'rejected' | 'accepted';
}

export interface JobAiLoading {
    desc: boolean;
    req: boolean;
}
