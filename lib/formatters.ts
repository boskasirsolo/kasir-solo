
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

// NEW: Rename File Object
export const renameFile = (originalFile: File, newName: string): File => {
  const ext = originalFile.name.split('.').pop() || 'jpg';
  // Ensure the new name has an extension
  const finalName = newName.endsWith(`.${ext}`) ? newName : `${newName}.${ext}`;
  
  return new File([originalFile], finalName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
};

// NEW: Strict Phone Normalizer
export const normalizePhone = (phone: string): string | null => {
  // 1. Remove all non-numeric chars
  let cleaned = phone.replace(/\D/g, '');

  // 2. Handle specific prefixes
  // If starts with '0', replace with '62'
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } 
  // If starts with '8...', assume '628...'
  else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }

  // 3. Strict Validation
  // Must start with '62'
  if (!cleaned.startsWith('62')) return null;
  
  // Length check (Standard mobile/WA is usually 10-14 digits including country code)
  // e.g. 628123456789 (12)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return null;
  }

  return cleaned;
};

// NEW: UTM URL Generator
export const generateUtmUrl = (baseUrl: string, source: string, medium: string = 'social', campaign: string = 'broadcast'): string => {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', source);
    url.searchParams.set('utm_medium', medium);
    url.searchParams.set('utm_campaign', campaign);
    return url.toString();
  } catch (e) {
    // Fallback if URL is invalid (e.g. relative path)
    return `${baseUrl}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
  }
};
