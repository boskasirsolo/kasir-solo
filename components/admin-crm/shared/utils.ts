/**
 * PARSER: Bedah teks catatan (notes) dari database ke objek terstruktur.
 * Digunakan untuk identifikasi niat beli juragan (Hardware vs Service).
 */
export const parseIntel = (notes?: string) => {
    if (!notes) return {};
    const data: any = {};
    const lines = notes.split('\n');
    lines.forEach(line => {
        if (line.includes('🏢USAHA:')) data.usaha = line.split('🏢USAHA:')[1]?.trim();
        if (line.includes('📦PAKET:')) data.paket = line.split('📦PAKET:')[1]?.trim();
        if (line.includes('💰ESTIMASI:')) data.estimasi = line.split('💰ESTIMASI:')[1]?.trim();
        if (line.includes('🚀ADDONS:')) data.addons = line.split('🚀ADDONS:')[1]?.trim();
        if (line.includes('📍ALAMAT:')) data.alamat = line.split('📍ALAMAT:')[1]?.trim();
        if (line.includes('SOURCE:')) data.source = line.split('SOURCE:')[1]?.trim();
    });
    return data;
};