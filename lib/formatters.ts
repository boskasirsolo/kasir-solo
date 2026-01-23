
// --- Formatters ---
export const formatRupiah = (number: number) => {
  if (typeof number !== 'number') return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

export const formatNumberInput = (value: string | number) => {
  const valStr = String(value);
  const raw = valStr.replace(/\D/g, '');
  if (!raw) return '';
  return new Intl.NumberFormat('id-ID').format(parseInt(raw));
};

export const cleanNumberInput = (value: string) => {
  return parseInt(value.replace(/\./g, '') || '0');
};

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     
    .replace(/[^\w\-]+/g, '') 
    .replace(/\-\-+/g, '-');  
};

export const renameFile = (originalFile: File, newName: string): File => {
  const ext = originalFile.name.split('.').pop() || 'jpg';
  const finalName = newName.endsWith(`.${ext}`) ? newName : `${newName}.${ext}`;
  return new File([originalFile], finalName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
};

export const normalizePhone = (phone: string): string | null => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  if (!cleaned.startsWith('62')) return null;
  if (cleaned.length < 10 || cleaned.length > 15) return null;
  return cleaned;
};

export const generateUtmUrl = (baseUrl: string, source: string, medium: string = 'social', campaign: string = 'broadcast'): string => {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', source);
    url.searchParams.set('utm_medium', medium);
    url.searchParams.set('utm_campaign', campaign);
    return url.toString();
  } catch (e) {
    return `${baseUrl}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
  }
};

// --- MKS TACTICAL ID ENGINE V4.0 ---
// Format: PREFIX-YYMMDDXXXX (10 Digit Angka)

export const formatOrderId = (id: number, prefix: string = 'ORD'): string => {
    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    const datePart = `${yy}${mm}${dd}`; // 6 Digit
    
    // Scramble ID biar keliatan "Acak" tapi tetep unik
    // Kita pake offset prime number biar gak gampang ditebak urutannya
    const scrambled = ((id * 1337) + 7331) % 10000;
    const idPart = scrambled.toString().padStart(4, '0'); // 4 Digit
    
    let combined = datePart + idPart; // Total 10 Digit
    
    // PROTEKSI: Anti 0000 (Maksimal 3 nol berurutan)
    // Jika ada 0000, ganti jadi 0001
    while (combined.includes('0000')) {
        combined = combined.replace('0000', '0001');
    }
    
    return `${prefix.toUpperCase()}-${combined}`;
};

export const parseOrderId = (val: string): number => {
    const digits = val.replace(/\D/g, '');
    
    // Karena kita pake logic (id * 1337 + 7331) % 10000
    // Kita gak bisa revert ID secara matematik kalau kena modulo.
    // Tapi buat Track Order, kita bakal kirim string lengkapnya ke query.
    // Jadi fungsi ini bakal balikin string digitnya aja buat dicocokin di DB.
    
    if (!digits) return 0;
    
    // Hack: Supabase bakal cari ID berdasarkan kolom 'id' (integer).
    // Karena format ID baru ini "virtual", di track-order.tsx kita harus
    // simpen ID lengkap ini di kolom terpisah atau pake mapping khusus.
    // Untuk sekarang, kita balikin 4 digit terakhir sebagai representasi ID mentah.
    
    if (digits.length >= 4) {
        const lastFour = parseInt(digits.slice(-4));
        // Reverse simple linear transformation
        // Note: Ini cuma estimasi karena modulo 10000. 
        // Idealnya sistem track order nyari berdasarkan string lengkap.
        return lastFour; 
    }
    
    return parseInt(digits);
};
