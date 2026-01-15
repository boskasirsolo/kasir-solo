
import { useState, useMemo } from 'react';
import { CalcData, CalcOption } from './types';
import { formatRupiah, supabase } from '../../../utils';

export const useCalculator = (data: CalcData, serviceName: string, waNumber?: string, serviceSlug?: string) => {
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [activeDetailItem, setActiveDetailItem] = useState<CalcOption | null>(null);

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

    if (base) {
        total += base.price;
    }

    data.addons.filter(a => selectedAddons.includes(a.id)).forEach(addon => {
        total += addon.price;
    });

    const getRange = (val: number) => ({ min: val, max: val * 1.2 });

    return {
        total: getRange(total),
        baseLabel: base?.label || '',
        basePrice: base?.price || 0,
        hasSelection: !!base
    };
  }, [selectedBase, selectedAddons, data]);

  const handleConsultation = async (customerName?: string, customerPhone?: string) => {
    if (!selectedBase) return alert("Pilih paket dasar terlebih dahulu.");

    const activeAddons = data.addons
        .filter(a => selectedAddons.includes(a.id))
        .map(a => ({ label: a.label, price: a.price }));

    const addonsLabels = activeAddons
        .map(a => `- ${a.label}`)
        .join('\n');

    if (supabase && (customerName || customerPhone)) {
        setIsCapturing(true);
        try {
            await supabase.from('service_simulations').insert([{
                customer_name: customerName || 'User Website',
                customer_phone: customerPhone || '-',
                service_slug: serviceSlug || 'general',
                service_name: serviceName,
                base_option_label: calculation.baseLabel,
                base_option_price: calculation.basePrice,
                selected_addons: activeAddons,
                total_min: calculation.total.min,
                total_max: calculation.total.max,
                status: 'new'
            }]);
        } catch (e) {
            console.warn("DB Capture failed", e);
        } finally {
            setIsCapturing(false);
        }
    }

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
      handleConsultation,
      isCapturing,
      activeDetailItem,
      setActiveDetailItem
  };
};
