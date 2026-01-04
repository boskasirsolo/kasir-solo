
import React from 'react';
import { Card, Input, TextArea, Button } from '../ui';
import { Send } from 'lucide-react';
import { CONTACT_CATEGORIES } from './types';

export const ContactForm = ({ 
    form, 
    setForm, 
    onSubmit, 
    onBlur 
}: { 
    form: any, 
    setForm: any, 
    onSubmit: (e: React.FormEvent) => void, 
    onBlur: () => void 
}) => {
    return (
        <Card className="p-6 md:p-8 bg-brand-dark/50 border-brand-orange/20 shadow-neon-text/5">
            <h3 className="text-2xl font-display font-bold text-white mb-6">Drop Pesan Disini</h3>
            <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Nama Panggilan</label>
                        <Input 
                            value={form.name} 
                            onChange={e => setForm({...form, name: e.target.value})} 
                            onBlur={onBlur}
                            placeholder="Mas / Mba ..."
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Nomor WhatsApp</label>
                        <Input 
                            value={form.phone} 
                            onChange={e => setForm({...form, phone: e.target.value})} 
                            onBlur={onBlur}
                            placeholder="0812xxxx"
                            type="tel"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Mau Bahas Apa?</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {CONTACT_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setForm({...form, category: cat})}
                                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                                form.category === cat 
                                ? 'bg-brand-orange text-white border-brand-orange' 
                                : 'bg-black/20 text-gray-400 border-brand-orange hover:bg-brand-orange hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Detail Pesan</label>
                    <TextArea 
                        value={form.message} 
                        onChange={e => setForm({...form, message: e.target.value})} 
                        placeholder="Ceritain kebutuhan atau masalah lo disini..."
                        className="h-32"
                    />
                </div>

                <Button type="submit" className="w-full py-4 text-sm font-bold shadow-neon hover:shadow-neon-strong">
                    <Send size={18} /> LANJUT KE WHATSAPP
                </Button>
                <p className="text-[10px] text-gray-500 text-center">
                    *Gue bakal bales secepatnya. Kalau urgent, mending telpon langsung.
                </p>
            </form>
        </Card>
    );
};
