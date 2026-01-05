
import { useState, useMemo } from 'react';
import { CalcData } from './types';
import { formatRupiah } from '../../../utils';

export const useCalculator = (data: CalcData, serviceName: string, waNumber?: string) => {
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

    let total = 0;

    // Process Base Option
    if (base) {
        total += base.price;
    }

    // Process Addons
    data.addons.filter(a => selectedAddons.includes(a.id)).forEach(addon => {
        total += addon.price;
    });

    // Helper to calculate range (Price to Price + 20% to imply estimation)
    const getRange = (val: number) => ({ min: val, max: val * 1.2 });

    return {
        total: getRange(total),
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
    if (calculation.total.min > 0) estimateText += `Estimasi Investasi Awal: ${formatRupiah(calculation.total.min)} - ${formatRupiah(calculation.total.max)}%0A`;

    const message = `Halo Mas Amin, saya sudah simulasi investasi untuk *${serviceName}*:%0A%0A` +
                    `📦 *Base:* ${calculation.baseLabel}%0A` +
                    `🚀 *Add-ons:*%0A${addonsLabels || '(Tidak ada)'}%0A%0A` +
                    `*${estimateText}*` +
                    `Bisa diskusi detailnya?`;

    const targetWa = waNumber || "6282325103336";
    window.open(`https://wa.me/${targetWa}?text=${message}`, '_blank');
  };

  return {
      selectedBase, setSelectedBase,
      selectedAddons, toggleAddon,
      calculation,
      handleConsultation
  };
};
