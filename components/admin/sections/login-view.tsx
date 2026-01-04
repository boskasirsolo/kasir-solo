
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Input, Button, LoadingSpinner } from '../../ui';
import { useAdminLogin } from '../logic';

export const LoginView = () => {
    const navigate = useNavigate();
    const { email, setEmail, password, setPassword, loading, error, handleLogin } = useAdminLogin();

    return (
        <div className="min-h-screen flex items-center justify-center animate-fade-in bg-brand-dark relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[150px] animate-pulse-slow"></div>
            
            <button 
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-500 hover:text-brand-orange transition-colors group"
            >
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5 group-hover:border-brand-orange/30 transition-all">
                    <ArrowLeft size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">Kembali ke Beranda</span>
            </button>

            <form 
                onSubmit={handleLogin}
                className="bg-brand-card p-10 rounded-2xl border border-white/10 w-full max-w-md shadow-neon z-10"
            >
                <h2 className="text-3xl font-bold text-white mb-8 text-center font-display">Admin Portal</h2>
                
                <div className="space-y-4 mb-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <Input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email Administrator" 
                            className="pl-12"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <Input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password" 
                            className="pl-12"
                        />
                    </div>
                </div>

                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm mb-6 text-center">{error}</div>}
                
                <Button type="submit" className="w-full py-4 shadow-neon" disabled={loading}>
                    {loading ? <LoadingSpinner /> : "MASUK DASHBOARD"}
                </Button>
            </form>
        </div>
    );
};
