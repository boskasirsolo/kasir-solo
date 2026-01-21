
// --- IMAGE OPTIMIZATION (CLOUDINARY & UNSPLASH) ---
export const optimizeImage = (url: string, width: number = 800) => {
  if (!url) return '';

  if (url.includes('cloudinary.com')) {
    if (url.includes('f_auto,q_auto')) return url;
    const params = [`f_auto`, `q_auto:best`, `c_limit`, `w_${width}`];
    return url.replace('/upload/', `/upload/${params.join(',')}/`);
  }

  if (url.includes('images.unsplash.com')) {
    try {
        const urlObj = new URL(url);
        urlObj.searchParams.set('w', width.toString());
        urlObj.searchParams.set('q', '90'); // High quality unsplash
        urlObj.searchParams.set('fm', 'webp');
        urlObj.searchParams.set('fit', 'max');
        return urlObj.toString();
    } catch(e) {
        return url;
    }
  }

  return url;
};

// --- CLIENT-SIDE AUTO COMPRESSOR (V2.1 - ULTRA HIGH QUALITY) ---
export const autoCompressImage = async (file: File, maxSizeMB: number = 3): Promise<File> => {
  // Jika file sudah di bawah 3MB, jangan disentuh! Biarkan kualitas originalnya.
  if (file.size <= maxSizeMB * 1024 * 1024) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Limit resolusi max 4K (3840px) biar bener-bener tajam buat zoom
        const MAX_DIM = 3840;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          } else {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);

        // Smoothing settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        // Kita pake format original, tapi quality kita set tinggi (0.95)
        const targetType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = 0.95; // Ultra High Quality

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: targetType,
              lastModified: Date.now(),
            });
            console.log(`[MKS-Pro-Compress] Optimization: ${(file.size / 1024 / 1024).toFixed(1)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(1)}MB (Q: 0.95)`);
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, targetType, quality);
      };

      img.onerror = () => {
        console.warn("[MKS-Compress] Gagal load, bypass original.");
        resolve(file);
      };
    };

    reader.onerror = () => resolve(file);
  });
};

// --- WATERMARK ENGINE (V2.1 - HD RENDERING) ---
export const addWatermarkToFile = async (file: File): Promise<File> => {
  // Hanya kompres kalau file aslinya di atas 4MB biar canvas gak lag
  const processedFile = file.size > 4 * 1024 * 1024 ? await autoCompressImage(file, 4) : file;
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(processedFile);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(processedFile);

        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0);

        // Style Watermark MKS - Lebih Halus
        const text = "PT MESIN KASIR SOLO";
        const fontSize = Math.floor(canvas.width / 20);
        ctx.font = `900 ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 10);
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; // Lebih tipis biar gak ganggu detail produk
        ctx.fillText(text, 0, 0);
        ctx.restore();

        // Footer Text
        const smallSize = Math.floor(canvas.width / 50);
        ctx.font = `bold ${smallSize}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = 'right';
        ctx.fillText("Official Asset: MesinKasirSolo.com", canvas.width - 40, canvas.height - 40);

        canvas.toBlob((blob) => {
            if (blob) {
                // Return sebagai file kualitas tinggi
                resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
                resolve(processedFile);
            }
        }, 'image/jpeg', 0.95);
      };
      img.onerror = () => resolve(processedFile);
    };
    reader.onerror = () => resolve(processedFile);
  });
};
