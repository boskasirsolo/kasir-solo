
import { useState, useMemo, useRef } from 'react';
import { CalcData, CalcOption } from './types';
import { formatRupiah, supabase, normalizePhone } from '../../../utils';

export const useCalculator = (data: CalcData, serviceName: string, waNumber?: string, serviceSlug?: string) => {
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [activeDetailItem, setActiveDetailItem] = useState<CalcOption | null>(null);
  
  const lastCapturedPhone = useRef<string>('');

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

  // NEW: Shadow Lead Capture
  const handleShadowCapture = async (customerData: any) => {
    if (!customerData.name || !customerData.phone || customerData.phone.length < 9) return;
    
    const cleanPhone = normalizePhone(customerData.phone);
    if (!cleanPhone || cleanPhone === lastCapturedPhone.current) return;

    if (!supabase) return;

    try {
        // Masuk ke tabel leads (Shadow Leads)
        await supabase.from('leads').insert([{
            name: customerData.name,
            phone: cleanPhone,
            source: `simulation_shadow_${serviceSlug || 'general'}`,
            interest: `Simulasi: ${serviceName} (${calculation.baseLabel || 'Belum pilih paket'})`,
            notes: `Perusahaan: ${customerData.company || '-'}\nAlamat: ${customerData.address || '-'}\nKategori: ${customerData.category || '-'}`,
            status: 'new'
        }]);
        lastCapturedPhone.current = cleanPhone;
        console.log("Shadow lead captured");
    } catch (e) {
        console.warn("Shadow capture failed", e);
    }
  };

  const handleConsultation = async (customerData: {
      name: string;
      phone: string;
      company?: string;
      address?: string;
      category?: string;
  }) => {
    if (!selectedBase) return alert("Pilih paket dasar terlebih dahulu.");

    const activeAddons = data.addons
        .filter(a => selectedAddons.includes(a.id))
        .map(a => ({ label: a.label, price: a.price }));

    const addonsLabels = activeAddons
        .map(a => `- ${a.label}`)
        .join('\n');

    if (supabase) {
        setIsCapturing(true);
        try {
            await supabase.from('service_simulations').insert([{
                customer_name: customerData.name || 'User Website',
                customer_phone: customerData.phone || '-',
                service_slug: serviceSlug || 'general',
                service_name: serviceName,
                base_option_label: calculation.baseLabel,
                base_option_price: calculation.basePrice,
                selected_addons: activeAddons,
                total_min: calculation.total.min,
                total_max: calculation.total.max,
                status: 'new',
                company_name: customerData.company || '-',
                address: customerData.address || '-',
                business_category: customerData.category || '-',
                notes: `Log Simulasi: ${serviceName}`
            }]);
        } catch (e) {
            console.warn("DB Capture failed", e);
        } finally {
            setIsCapturing(false);
        }
    }

    let estimateText = "";
    if (calculation.total.min > 0) estimateText += `Estimasi Investasi Awal: ${formatRupiah(calculation.total.min)} - ${formatRupiah(calculation.total.max)}%0A`;

    const message = `*KONSULTASI SOLUSI DIGITAL*%0A%0A` +
                    `👤 *Nama:* ${customerData.name}%0A` +
                    `📱 *WA:* ${customerData.phone}%0A` +
                    `🏢 *Usaha:* ${customerData.company || '-'}%0A` +
                    `📍 *Lokasi:* ${customerData.address || '-'}%0A` +
                    `🏷️ *Kategori:* ${customerData.category || '-'}%0A%0A` +
                    `🛠️ *Layanan:* ${serviceName}%0A` +
                    `📦 *Paket:* ${calculation.baseLabel}%0A` +
                    `🚀 *Add-ons:*%0A${addonsLabels || '(Tidak ada)'}%0A%0A` +
                    `*${estimateText}*` +
                    `Bisa diskusi detailnya Mas Amin?`;

    const targetWa = waNumber || "6282325103336";
    window.open(`https://wa.me/${targetWa}?text=${message}`, '_blank');
  };

  return {
      selectedBase, setSelectedBase,
      selectedAddons, toggleAddon,
      calculation,
      handleConsultation,
      handleShadowCapture,
      isCapturing,
      activeDetailItem,
      setActiveDetailItem
  };
};
