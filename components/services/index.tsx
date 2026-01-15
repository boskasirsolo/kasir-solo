
import React, { useState, useEffect } from 'react';
import { Globe, Layers, LineChart, ShieldCheck, Store, ArrowRight, FileSpreadsheet, Database, CheckCircle2, Megaphone, Anchor, TrendingUp, TrendingDown, Skull, ShieldAlert, Activity, AlertTriangle } from 'lucide-react';
import { ServicePageTemplate } from './template';
import { WEBSITE_DATA, WEBSITE_CALC, WEBAPP_DATA, WEBAPP_CALC, SEO_DATA, SEO_CALC, MAINTENANCE_DATA, MAINTENANCE_CALC } from './data';
import { SiteConfig, ServicePageData } from '../../types';
import { supabase } from '../../utils';
import { LoadingSpinner } from '../ui';

// --- ATOM: Fallback Icon Resolver ---
const getIcon = (name: string) => {
    switch(name) {
        case 'Globe': return Globe;
        case 'Layers': return Layers;
        case 'LineChart': return LineChart;
        case 'ShieldCheck': return ShieldCheck;
        default: return Globe;
    }
};

const ServicePageWrapper = ({ 
    slug, 
    fallbackData, 
    fallbackCalc, 
    fallbackSteps,
    defaultTitle,
    defaultHighlight,
    defaultSubtitle,
    config 
}: any) => {
    const [dbData, setDbData] = useState<ServicePageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            if (!supabase) { setLoading(false); return; }
            try {
                const { data } = await supabase.from('services').select('*').eq('slug', slug).maybeSingle();
                if (data) setDbData(data);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchService();
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size={32} /></div>;

    // Merge DB Data with Fallbacks
    const title = dbData?.title || defaultTitle;
    const highlight = dbData?.highlight || defaultHighlight;
    const subtitle = dbData?.subtitle || defaultSubtitle;
    const icon = getIcon(dbData?.icon_name || (slug === 'website' ? 'Globe' : slug === 'webapp' ? 'Layers' : slug === 'seo' ? 'LineChart' : 'ShieldCheck'));
    const features = dbData?.features || fallbackData.features;
    const steps = dbData?.steps || fallbackSteps;
    const calcData = dbData?.calc_data || fallbackCalc;

    const max = config?.quotaDigitalMax || 2;
    const used = config?.quotaDigitalUsed || 0;
    const remaining = Math.max(0, max - used);

    // Narrative logic specific to slug but can be overwritten by DB if we add narrative column (optional)
    const renderNarrative = () => {
        if (slug === 'website') return (
            <>
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-orange/20 blur-[80px] rounded-full"></div>
                    <div className="relative bg-brand-dark border border-white/10 rounded-2xl p-8 space-y-6">
                        <div className="flex items-center gap-4 text-white">
                            <Store size={40} className="text-gray-500" />
                            <ArrowRight size={24} className="text-brand-orange animate-pulse" />
                            <Globe size={40} className="text-brand-orange" />
                        </div>
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                            <p className="text-red-400 text-sm font-bold flex items-center gap-2 mb-2">
                                <AlertTriangle size={16} /> INFO KUOTA: MAX {max} SLOT/BULAN
                            </p>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Gue <strong>Single Fighter</strong> untuk urusan coding & strategi. Gue gak mau oper ke anak magang terus hasilnya ampas.
                            </p>
                            <p className="text-gray-300 text-sm leading-relaxed mt-2">
                                Sisa slot saat ini: <strong className="text-white">{remaining}</strong>.
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                        Kenapa Harus Sama <span className="text-brand-orange">Tukang Kasir?</span>
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Karena gue ngerti <strong>duit masuk</strong>. Gue gak peduli web lo warna-warni kalau gak ada yang beli. Gue desain web lo layaknya toko fisik yang siap transaksi.
                    </p>
                    <ul className="space-y-4">
                        {["Struktur rapi (Standar Gudang).", "Tombol 'Beli' yang nampol.", "Loading cepet biar pembeli gak kabur.", "Siap integrasi sistem kasir."].map((item, i) => (
                            <li key={i} className="flex gap-3 text-gray-300"><CheckCircle2 className="text-brand-orange shrink-0" size={20} /><span>{item}</span></li>
                        ))}
                    </ul>
                </div>
            </>
        );

        if (slug === 'webapp') return (
            <>
                <div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">Lo Owner, Bukan <span className="text-red-500">Admin.</span></h2>
                    <p className="text-gray-400 leading-relaxed mb-6">Masih jaman rekap nota manual tiap malem? Itu tanda <strong>sistem lo purba</strong>.</p>
                    <div className="bg-brand-dark border-l-4 border-brand-orange p-4 rounded-r-lg mt-6">
                        <p className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-2"><AlertTriangle size={12}/> SLOT TERBATAS (MAX {max}/BULAN)</p>
                        <p className="text-white italic text-sm">"Tersisa <strong>{remaining} slot</strong>. Pastikan lo booking slot jauh-jauh hari."</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-orange/10 blur-[80px] rounded-full"></div>
                    <div className="relative bg-brand-dark border border-white/10 rounded-2xl p-8 space-y-6">
                        <div className="flex items-center justify-between text-gray-500 mb-2"><FileSpreadsheet size={32} /><ArrowRight size={24} className="text-brand-orange animate-pulse" /><Database size={32} className="text-brand-orange" /></div>
                        <h3 className="text-xl font-bold text-white">Revolusi Cara Kerja</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-gray-400">❌ Lupa catat pengeluaran kecil</li>
                            <li className="flex gap-3 text-sm text-gray-400">❌ Karyawan hapus transaksi</li>
                            <li className="flex gap-3 text-sm text-white font-bold bg-brand-orange/10 p-2 rounded"><CheckCircle2 className="text-brand-orange shrink-0" size={16} /><span>Semua tercatat & terlacak</span></li>
                        </ul>
                    </div>
                </div>
            </>
        );

        if (slug === 'seo') return (
            <>
                <div className="relative order-2 md:order-1">
                    <div className="absolute inset-0 bg-brand-orange/10 blur-[80px] rounded-full"></div>
                    <div className="relative bg-brand-dark border border-white/10 rounded-2xl p-8 space-y-6">
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                            <div className="text-center"><Megaphone size={32} className="text-red-500 mx-auto mb-2" /><p className="text-xs font-bold text-red-500">PAID ADS</p></div>
                            <div className="h-px w-20 bg-gray-700"></div>
                            <div className="text-center"><Anchor size={32} className="text-brand-orange mx-auto mb-2" /><p className="text-xs font-bold text-brand-orange">SEO ORGANIC</p></div>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-gray-400"><TrendingDown size={16}/> Ads: Budget abis = Traffic NOL.</li>
                            <li className="flex gap-3 text-sm text-white font-bold bg-brand-orange/10 p-2 rounded"><CheckCircle2 className="text-brand-orange shrink-0" size={16} /><span>SEO: Investasi sekali, panen berkali-kali.</span></li>
                        </ul>
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">Sewa Lapak vs <span className="text-brand-orange">Beli Tanah.</span></h2>
                    <p className="text-gray-400 leading-relaxed mb-6"><strong>SEO</strong> itu lo ngebangun jalan raya sendiri menuju toko lo. Traffic ngalir terus gratisan 24 jam.</p>
                </div>
            </>
        );

        return (
            <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">Maintenance & <span className="text-brand-orange">Security.</span></h2>
                <p className="text-gray-400 leading-relaxed">Gue jagain aset digital lo biar lo bisa tidur nyenyak tanpa takut kena hack.</p>
            </div>
        );
    };

    return (
        <ServicePageTemplate 
            title={title}
            highlight={highlight}
            subtitle={subtitle}
            icon={icon}
            features={features.map((f: any) => ({ ...f, icon: getIcon(f.icon) || Globe }))}
            calcData={calcData}
            calcServiceName={title + " " + highlight}
            steps={steps}
            waNumber={config?.whatsappNumber}
            serviceSlug={slug}
            narrativeContent={renderNarrative()}
        />
    );
};

export const WebsiteServicePage = ({ config }: { config?: SiteConfig }) => (
    <ServicePagePageWrapper 
        slug="website"
        fallbackData={WEBSITE_DATA}
        fallbackCalc={WEBSITE_CALC}
        fallbackSteps={WEBSITE_DATA.steps}
        defaultTitle="Web Itu"
        defaultHighlight="Ruko Digital."
        defaultSubtitle="Jangan cuma sewa lapak (Sosmed) doang. Bangun 'Sertifikat Hak Milik' (SHM) lo sendiri di internet."
        config={config}
    />
);

export const WebAppServicePage = ({ config }: { config?: SiteConfig }) => (
    <ServicePagePageWrapper 
        slug="webapp"
        fallbackData={WEBAPP_DATA}
        fallbackCalc={WEBAPP_CALC}
        fallbackSteps={WEBAPP_DATA.steps}
        defaultTitle="Stop Jadi"
        defaultHighlight="Budak Excel."
        defaultSubtitle="Lupain aplikasi langganan yang fiturnya 'nanggung'. Bangun sistem operasi bisnis yang lo miliki selamanya."
        config={config}
    />
);

export const SeoServicePage = ({ config }: { config?: SiteConfig }) => (
    <ServicePagePageWrapper 
        slug="seo"
        fallbackData={SEO_DATA}
        fallbackCalc={SEO_CALC}
        fallbackSteps={SEO_DATA.steps}
        defaultTitle="Berhenti Membakar"
        defaultHighlight="Uang Iklan."
        defaultSubtitle="Iklan itu kayak sewa ruko, telat bayar langsung diusir. SEO itu kayak beli tanah, makin lama makin mahal harganya."
        config={config}
    />
);

export const MaintenanceServicePage = ({ config }: { config?: SiteConfig }) => (
    <ServicePagePageWrapper 
        slug="maintenance"
        fallbackData={MAINTENANCE_DATA}
        fallbackCalc={MAINTENANCE_CALC}
        fallbackSteps={MAINTENANCE_DATA.steps}
        defaultTitle="Punya Toko,"
        defaultHighlight="Gak Ada Satpam?"
        defaultSubtitle="Di dunia nyata lo pasang CCTV dan gembok. Di internet? Jangan biarkan pintu toko lo terbuka lebar buat maling."
        config={config}
    />
);

const ServicePagePageWrapper = ServicePageWrapper;
