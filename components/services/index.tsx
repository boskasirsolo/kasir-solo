
import React from 'react';
import { Globe, Layers, LineChart, ShieldCheck, Store, ArrowRight, FileSpreadsheet, Database, CheckCircle2, Megaphone, Anchor, TrendingUp, TrendingDown, Skull, ShieldAlert, Activity } from 'lucide-react';
import { ServicePageTemplate } from './template';
import { WEBSITE_DATA, WEBSITE_CALC, WEBAPP_DATA, WEBAPP_CALC, SEO_DATA, SEO_CALC, MAINTENANCE_DATA, MAINTENANCE_CALC } from './data';
import { SiteConfig } from '../../types';
import { AlertTriangle } from 'lucide-react';

export const WebsiteServicePage = ({ config }: { config?: SiteConfig }) => {
    const max = config?.quotaDigitalMax || 2;
    const used = config?.quotaDigitalUsed || 0;
    const remaining = Math.max(0, max - used);

    return (
        <ServicePageTemplate 
            title="Web Itu"
            highlight="Ruko Digital."
            subtitle="Jangan cuma sewa lapak (Sosmed) doang. Bangun 'Sertifikat Hak Milik' (SHM) lo sendiri di internet. Gue bantu lo punya aset digital yang gak bisa diban."
            icon={Globe}
            features={WEBSITE_DATA.features}
            calcData={WEBSITE_CALC}
            calcServiceName="Jasa Pembuatan Website (Ruko Digital)"
            steps={WEBSITE_DATA.steps}
            waNumber={config?.whatsappNumber}
            narrativeContent={
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
                                    Jadi sorry banget, gue cuma terima maksimal <strong>{max} Klien Digital</strong> per bulan biar kualitasnya terjaga. Sisa slot saat ini: <strong className="text-white">{remaining}</strong>.
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
                            {[
                                "Struktur Kategori Produk rapi (Standar Gudang).",
                                "Tombol 'Beli' yang nampol dan jelas.",
                                "Loading cepet biar pembeli gak kabur.",
                                "Siap integrasi sama sistem kasir/ERP nanti."
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3 text-gray-300">
                                    <CheckCircle2 className="text-brand-orange shrink-0" size={20} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            }
        />
    );
};

export const WebAppServicePage = ({ config }: { config?: SiteConfig }) => {
    const max = config?.quotaDigitalMax || 2;
    const used = config?.quotaDigitalUsed || 0;
    const remaining = Math.max(0, max - used);

    return (
        <ServicePageTemplate 
            title="Stop Jadi"
            highlight="Budak Excel."
            subtitle="Lupain aplikasi langganan yang fiturnya 'nanggung'. Bangun sistem operasi bisnis yang ngikutin cara kerja lo, bukan lo yang dipaksa ngikutin cara kerja aplikasi."
            icon={Layers}
            features={WEBAPP_DATA.features}
            calcData={WEBAPP_CALC}
            calcServiceName="Jasa Custom Web App (ERP)"
            steps={WEBAPP_DATA.steps}
            waNumber={config?.whatsappNumber}
            narrativeContent={
                <>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                            Lo Owner, Bukan <span className="text-red-500">Admin.</span>
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Masih jaman rekap nota manual tiap malem? Masih jaman stok opname pake kertas terus selisih mulu? Itu tanda <strong>sistem lo purba</strong>.
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Gue tawarkan <strong>Custom Web App (ERP)</strong>. Ini bukan aplikasi pasaran yang lo sewa (SaaS). Ini aplikasi yang lo <strong>Miliki Sepenuhnya</strong>. Database di tangan lo, source code di tangan lo.
                        </p>
                        <div className="bg-brand-dark border-l-4 border-brand-orange p-4 rounded-r-lg mt-6">
                            <p className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                                <AlertTriangle size={12}/> SLOT TERBATAS (MAX {max}/BULAN)
                            </p>
                            <p className="text-white italic text-sm">
                                "Pembuatan Software Custom butuh fokus tinggi. Gue gak bisa handle banyak sekaligus. Saat ini tersisa <strong>{remaining} slot</strong>. Pastikan lo booking slot jauh-jauh hari."
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-orange/10 blur-[80px] rounded-full"></div>
                        <div className="relative bg-brand-dark border border-white/10 rounded-2xl p-8 space-y-6">
                            <div className="flex items-center justify-between text-gray-500 mb-2">
                                <FileSpreadsheet size={32} />
                                <ArrowRight size={24} className="text-brand-orange animate-pulse" />
                                <Database size={32} className="text-brand-orange" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Revolusi Cara Kerja</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-gray-400">
                                    <span className="text-red-500">❌</span> 
                                    <span>Lupa catat pengeluaran kecil</span>
                                </li>
                                <li className="flex gap-3 text-sm text-gray-400">
                                    <span className="text-red-500">❌</span> 
                                    <span>Karyawan hapus transaksi (Fraud)</span>
                                </li>
                                <li className="flex gap-3 text-sm text-white font-bold bg-brand-orange/10 p-2 rounded">
                                    <CheckCircle2 className="text-brand-orange shrink-0" size={16} />
                                    <span>Semua tercatat & terlacak (Audit Trail)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            }
        />
    );
};

export const SeoServicePage = ({ config }: { config?: SiteConfig }) => {
    return (
        <ServicePageTemplate 
            title="Berhenti Membakar"
            highlight="Uang Iklan."
            subtitle="Iklan itu kayak sewa ruko, telat bayar langsung diusir. SEO itu kayak beli tanah, makin lama makin mahal harganya. Gue bantu lo bangun aset digital yang gak perlu setoran harian ke Google."
            icon={LineChart}
            features={SEO_DATA.features}
            calcData={SEO_CALC}
            calcServiceName="Jasa SEO & Traffic"
            steps={SEO_DATA.steps}
            waNumber={config?.whatsappNumber}
            narrativeContent={
                <>
                    <div className="relative order-2 md:order-1">
                        <div className="absolute inset-0 bg-brand-orange/10 blur-[80px] rounded-full"></div>
                        <div className="relative bg-brand-dark border border-white/10 rounded-2xl p-8 space-y-6">
                            <div className="flex items-center justify-between text-gray-500 mb-2">
                                <div className="text-center">
                                    <Megaphone size={32} className="text-red-500 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-red-500">PAID ADS</p>
                                    <p className="text-[10px]">Sewa Traffic (Ngontrak)</p>
                                </div>
                                <div className="h-px w-20 bg-gray-700"></div>
                                <div className="text-center">
                                    <Anchor size={32} className="text-brand-orange mx-auto mb-2" />
                                    <p className="text-xs font-bold text-brand-orange">SEO ORGANIC</p>
                                    <p className="text-[10px]">Aset Sendiri (SHM)</p>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-white">Sewa vs Beli</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-gray-400">
                                    <span className="text-red-500"><TrendingDown size={16}/></span> 
                                    <span>Ads: Budget abis = Traffic NOL.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-gray-400">
                                    <span className="text-red-500"><Skull size={16}/></span> 
                                    <span>Ads: Harga klik makin mahal tiap tahun.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-white font-bold bg-brand-orange/10 p-2 rounded">
                                    <CheckCircle2 className="text-brand-orange shrink-0" size={16} />
                                    <span>SEO: Investasi sekali, panen berkali-kali.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="order-1 md:order-2">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                            Sewa Lapak vs <span className="text-brand-orange">Beli Tanah.</span>
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Logikanya simpel. <strong>Paid Ads (Iklan)</strong> itu lo nyewa traffic. Begitu lo stop bayar, lo 'diusir' dari halaman depan Google.
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            <strong>SEO</strong> itu lo ngebangun jalan raya sendiri menuju toko lo. Lama di awal, berdarah-darah di awal, tapi begitu jadi... traffic ngalir terus gratisan 24 jam. Lo pilih mana? Jadi juragan tanah atau penyewa abadi?
                        </p>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-white font-bold bg-brand-orange/10 px-4 py-2 rounded-lg border border-brand-orange/20">
                                <TrendingUp size={18} className="text-brand-orange"/>
                                <span>Jatah Preman Digital</span>
                            </div>
                        </div>
                    </div>
                </>
            }
        />
    );
};

export const MaintenanceServicePage = ({ config }: { config?: SiteConfig }) => {
    return (
        <ServicePageTemplate 
            title="Punya Toko,"
            highlight="Gak Ada Satpam?"
            subtitle="Di dunia nyata lo pasang CCTV dan gembok. Di internet? Jangan biarkan pintu toko lo terbuka lebar buat maling. Gue jagain aset lo 24 jam."
            icon={ShieldCheck}
            features={MAINTENANCE_DATA.features}
            calcData={MAINTENANCE_CALC}
            calcServiceName="Jasa Maintenance & Keamanan"
            steps={MAINTENANCE_DATA.steps}
            waNumber={config?.whatsappNumber}
            narrativeContent={
                <>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                            Jangan Nunggu <span className="text-red-500">Kemalingan</span> Baru Teriak.
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Website itu kayak mesin mobil. Kalau gak pernah di-service, oli gak diganti, jangan kaget kalau tiba-tiba mogok di jalan pas lagi ngebut (baca: pas traffic lagi tinggi).
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Hacker gak peduli bisnis lo kecil atau gede. Mereka cuma cari celah. Sekali data pelanggan bocor atau website kena ransomware, reputasi yang lo bangun tahunan hancur dalam semalam.
                        </p>
                        <div className="bg-brand-dark border-l-4 border-red-500 p-4 rounded-r-lg">
                            <p className="text-white italic text-sm">
                                "Maintenance itu bukan biaya, tapi <strong>Asuransi Ketenangan</strong>. Lo fokus jualan, teknis biar gue yang jagain."
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/10 blur-[80px] rounded-full"></div>
                        <div className="relative bg-brand-dark border border-white/10 rounded-2xl p-8 space-y-6">
                            <div className="flex items-center justify-between text-gray-500 mb-2">
                                <ShieldAlert size={32} className="text-red-500 animate-pulse" />
                                <ArrowRight size={24} className="text-gray-600" />
                                <ShieldCheck size={32} className="text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Risiko vs Solusi</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400 text-sm">Server Down</span>
                                    <span className="text-red-400 text-xs font-bold">Hilang Omzet</span>
                                </li>
                                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400 text-sm">Kena Hack</span>
                                    <span className="text-red-400 text-xs font-bold">Hilang Data & Reputasi</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-white font-bold text-sm">Jasa Satpam Digital</span>
                                    <span className="text-green-400 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Tidur Nyenyak</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            }
        />
    );
};
