
import React, { useState, useMemo } from 'react';
import { Check, Plus, Calculator, ArrowRight, RefreshCw } from 'lucide-react';
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

  const calculation = useMemo(() => {
    const base = data.baseOptions.find(o => o.id === selectedBase);
    const basePrice = base ? base.price : 0;
    
    const addonsPrice = data.addons
      .filter(a => selectedAddons.includes(a.id))
      .reduce((acc, curr) => acc + curr.price, 0);

    const total = basePrice + addonsPrice;
    
    // Logic Range: Estimasi Total s/d Total + 20% (Buffer aman)
    const min = total;
    const max = total * 1.2;

    return { min, max, baseLabel: base?.label || '' };
  }, [selectedBase, selectedAddons, data]);

  const handleConsultation = () => {
    if (!selectedBase) return alert("Pilih paket dasar terlebih dahulu.");

    const addonsLabels = data.addons
        .filter(a => selectedAddons.includes(a.id))
        .map(a => `- ${a.label}`)
        .join('\n');

    const message = `Halo Mas Amin, saya sudah simulasi investasi untuk *${serviceName}*:%0A%0A` +
                    `📦 *Base:* ${calculation.baseLabel}%0A` +
                    `🚀 *Add-ons:*%0A${addonsLabels || '(Tidak ada)'}%0A%0A` +
                    `💰 *Estimasi Budget:* ${formatRupiah(calculation.min)} - ${formatRupiah(calculation.max)}%0A%0A` +
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
               
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Estimasi Investasi</p>
               
               {selectedBase ? (
                  <div className="space-y-1 animate-fade-in">
                     <p className="text-4xl font-display font-bold text-white tracking-tight">
                        {formatRupiah(calculation.min)}
                     </p>
                     <p className="text-sm text-gray-500">
                        s/d {formatRupiah(calculation.max)}
                     </p>
                     <div className="my-4 h-px bg-white/10"></div>
                     <p className="text-[10px] text-gray-400 italic leading-relaxed">
                        *Angka ini adalah estimasi kasar berdasarkan pilihan Anda. Harga final ditentukan setelah sesi konsultasi teknis.
                     </p>
                  </div>
               ) : (
                  <div className="py-8 text-center opacity-50">
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
