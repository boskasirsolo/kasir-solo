
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
