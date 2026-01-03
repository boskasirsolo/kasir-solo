
import React, { useState, useMemo } from 'react';
import { Check, Plus, Calculator, ArrowRight, RefreshCw, Calendar, Clock } from 'lucide-react';
import { formatRupiah } from '../utils';
import { Button } from './ui';

export interface CalcOption {
  id: string;
  label: string;
  price: number;
  desc?: string;
}

export interface CalcData {
  title: string;
  subtitle: string;
  baseLabel: string;
  baseOptions: CalcOption[];
  addonLabel: string;
  addons: CalcOption[];
}

export const InvestmentSimulator = ({ 
  data, 
  serviceName 
}: { 
  data: CalcData, 
  serviceName: string 
}) => {
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(prev => prev.filter(x => x !== id));
    } else {
      setSelectedAddons(prev => [...prev, id]);
    }
  };

  // Helper to detect frequency from label text
  const getFrequency = (label: string): 'onetime' | 'monthly' | 'yearly' => {
    const l = label.toLowerCase();
    if (l.includes('per bulan') || l.includes('/ bulan') || l.includes('monthly')) return 'monthly';
    if (l.includes('per tahun') || l.includes('/ tahun') || l.includes('yearly')) return 'yearly';
    return 'onetime';
  };

  const calculation = useMemo(() => {
    const base = data.baseOptions.find(o => o.id === selectedBase);
    
    let oneTimeTotal = 0;
    let monthlyTotal = 0;
    let yearlyTotal = 0;

    // Process Base Option
    if (base) {
        const freq = getFrequency(base.label);
        if (freq === 'monthly') monthlyTotal += base.price;
        else if (freq === 'yearly') yearlyTotal += base.price;
        else oneTimeTotal += base.price;
    }

    // Process Addons
    data.addons.filter(a => selectedAddons.includes(a.id)).forEach(addon => {
        const freq = getFrequency(addon.label);
        if (freq === 'monthly') monthlyTotal += addon.price;
        else if (freq === 'yearly') yearlyTotal += addon.price;
        else oneTimeTotal += addon.price;
    });

    // Helper to calculate range (Price to Price + 20%)
    const getRange = (val: number) => ({ min: val, max: val * 1.2 });

    return {
        oneTime: getRange(oneTimeTotal),
        monthly: getRange(monthlyTotal),
        yearly: getRange(yearlyTotal),
        baseLabel: base?.label || '',
        hasSelection: !!base
    };
  }, [selectedBase, selectedAddons, data]);

  const handleConsultation = () => {
    if (!selectedBase) return alert("Pilih paket dasar terlebih dahulu.");

    const addonsLabels = data.addons
        .filter(a => selectedAddons.includes(a.id))
        .map(a => `- ${a.label}`)
        .join('\n');

    let estimateText = "";
    if (calculation.oneTime.min > 0) estimateText += `💰 Awal: ${formatRupiah(calculation.oneTime.min)} - ${formatRupiah(calculation.oneTime.max)} (Sekali Bayar)%0A`;
    if (calculation.monthly.min > 0) estimateText += `📅 Rutin: ${formatRupiah(calculation.monthly.min)} (Per Bulan)%0A`;
    if (calculation.yearly.min > 0) estimateText += `🗓 Rutin: ${formatRupiah(calculation.yearly.min)} (Per Tahun)%0A`;

    const message = `Halo Mas Amin, saya sudah simulasi investasi untuk *${serviceName}*:%0A%0A` +
                    `📦 *Base:* ${calculation.baseLabel}%0A` +
                    `🚀 *Add-ons:*%0A${addonsLabels || '(Tidak ada)'}%0A%0A` +
                    `*Estimasi Budget:*%0A${estimateText}%0A` +
                    `Bisa diskusi detailnya?`;
    
    window.open(`https://wa.me/6282325103336?text=${message}`, '_blank');
  };

  return (
    <div className="bg-brand-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      {/* HEADER */}
      <div className="p-6 md:p-10 border-b border-white/5 bg-black/20 text-center">
         <div className="inline-flex items-center justify-center p-3 bg-brand-orange/10 rounded-full text-brand-orange mb-4 shadow-neon">
            <Calculator size={32} />
         </div>
         <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{data.title}</h2>
         <p className="text-gray-400">{data.subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-12">
         
         {/* LEFT: OPTIONS */}
         <div className="lg:col-span-7 p-6 md:p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-white/5">
            
            {/* STEP 1: BASE */}
            <div>
               <h4 className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs">1</span>
                  {data.baseLabel}
               </h4>
               <div className="grid gap-3">
                  {data.baseOptions.map(opt => (
                     <div 
                        key={opt.id}
                        onClick={() => setSelectedBase(opt.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                           selectedBase === opt.id 
                           ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text/20' 
                           : 'bg-white/5 border-white/5 hover:border-white/20'
                        }`}
                     >
                        <div>
                           <h5 className={`font-bold ${selectedBase === opt.id ? 'text-white' : 'text-gray-300'}`}>{opt.label}</h5>
                           {opt.desc && <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>}
                        </div>
                        <div className="text-right">
                           <span className={`text-sm font-bold ${selectedBase === opt.id ? 'text-brand-orange' : 'text-gray-500'}`}>
                              {formatRupiah(opt.price)}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* STEP 2: ADDONS */}
            <div>
               <h4 className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs">2</span>
                  {data.addonLabel}
               </h4>
               <div className="grid md:grid-cols-2 gap-3">
                  {data.addons.map(opt => {
                     const isSelected = selectedAddons.includes(opt.id);
                     return (
                        <div 
                           key={opt.id}
                           onClick={() => toggleAddon(opt.id)}
                           className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 group ${
                              isSelected
                              ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                              : 'bg-white/5 border-white/5 hover:border-white/20'
                           }`}
                        >
                           <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                              isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-600 bg-black'
                           }`}>
                              {isSelected && <Check size={12} />}
                           </div>
                           <div className="flex-1">
                              <h5 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{opt.label}</h5>
                              <p className="text-[10px] text-gray-500">{formatRupiah(opt.price)}</p>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>

         </div>

         {/* RIGHT: TOTAL & CTA */}
         <div className="lg:col-span-5 p-6 md:p-10 bg-black/40 flex flex-col justify-center">
            <div className="bg-brand-card border border-white/10 rounded-2xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Calculator size={120} />
               </div>
               
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Estimasi Investasi</p>
               
               {calculation.hasSelection ? (
                  <div className="space-y-6 animate-fade-in">
                     
                     {/* ONE TIME TOTAL */}
                     {calculation.oneTime.min > 0 && (
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                                <Clock size={10} className="text-brand-orange"/> Biaya Awal (Sekali Bayar)
                            </p>
                            <p className="text-3xl font-display font-bold text-white tracking-tight">
                                {formatRupiah(calculation.oneTime.min)}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                                s/d {formatRupiah(calculation.oneTime.max)}
                            </p>
                        </div>
                     )}

                     {/* MONTHLY TOTAL */}
                     {calculation.monthly.min > 0 && (
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                                <Calendar size={10} className="text-blue-400"/> Biaya Rutin Bulanan
                            </p>
                            <p className="text-2xl font-display font-bold text-blue-400 tracking-tight">
                                {formatRupiah(calculation.monthly.min)}
                            </p>
                        </div>
                     )}

                     {/* YEARLY TOTAL */}
                     {calculation.yearly.min > 0 && (
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                                <RefreshCw size={10} className="text-green-400"/> Biaya Rutin Tahunan
                            </p>
                            <p className="text-2xl font-display font-bold text-green-400 tracking-tight">
                                {formatRupiah(calculation.yearly.min)}
                            </p>
                        </div>
                     )}

                     <div className="mt-4 h-px bg-white/10"></div>
                     <p className="text-[10px] text-gray-400 italic leading-relaxed">
                        *Angka ini adalah estimasi kasar berdasarkan pilihan Anda. Harga final ditentukan setelah sesi konsultasi teknis.
                     </p>
                  </div>
               ) : (
                  <div className="py-12 text-center opacity-50">
                     <p className="text-xl font-bold text-gray-600">-- IDR --</p>
                     <p className="text-xs text-gray-500 mt-2">Pilih paket di kiri dulu</p>
                  </div>
               )}

               <div className="mt-8">
                  <Button 
                     onClick={handleConsultation}
                     disabled={!selectedBase}
                     className="w-full py-4 text-sm font-bold shadow-neon hover:shadow-neon-strong"
                  >
                     KIRIM HASIL KE WHATSAPP <ArrowRight size={16} />
                  </Button>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};
