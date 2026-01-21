
// --- IMAGE OPTIMIZATION (CLOUDINARY & UNSPLASH) ---
export const optimizeImage = (url: string, width: number = 1200) => {
  if (!url) return '';

  if (url.includes('cloudinary.com')) {
    if (url.includes('f_auto,q_auto')) return url;
    // Set ke q_auto:best biar Cloudinary gak pelit kualitas
    const params = [`f_auto`, `q_auto:best`, `c_limit`, `w_${width}`];
    return url.replace('/upload/', `/upload/${params.join(',')}/`);
  }

  if (url.includes('images.unsplash.com')) {
    try {
        const urlObj = new URL(url);
        urlObj.searchParams.set('w', width.toString());
        urlObj.searchParams.set('q', '95'); // High quality unsplash
        urlObj.searchParams.set('fm', 'webp');
        urlObj.searchParams.set('fit', 'max');
        return urlObj.toString();
    } catch(e) {
        return url;
    }
  }

  return url;
};

// --- CLIENT-SIDE AUTO COMPRESSOR (V3.0 - ULTRA SHARP) ---
export const autoCompressImage = async (file: File, maxSizeMB: number = 5): Promise<File> => {
  // Kalau file di bawah 5MB, JANGAN DISENTUH. Biar kualitas aslinya keluar.
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

        // Limit resolusi di 4K murni (4096px)
        const MAX_DIM = 4096;
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

        // ULTRA SMOOTHING SETTINGS
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        // Gunakan format asli, quality 0.98 (Hampir Perfect)
        const targetType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = 0.98; 

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: targetType,
              lastModified: Date.now(),
            });
            console.log(`[MKS-Ultra-Sharp] ${(file.size / 1024 / 1024).toFixed(1)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(1)}MB (Q: 0.98)`);
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, targetType, quality);
      };

      img.onerror = () => {
        resolve(file);
      };
    };

    reader.onerror = () => resolve(file);
  });
};

// --- WATERMARK ENGINE (V3.0 - HD PRECISION) ---
export const addWatermarkToFile = async (file: File): Promise<File> => {
  // Hanya kompres file raksasa (di atas 7MB) sebelum di-watermark
  const processedFile = file.size > 7 * 1024 * 1024 ? await autoCompressImage(file, 5) : file;
  
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

        // Watermark Style - Lebih Elegan
        const text = "PT MESIN KASIR SOLO";
        const fontSize = Math.floor(canvas.width / 22);
        ctx.font = `900 ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 12);
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 15;
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)"; 
        ctx.fillText(text, 0, 0);
        ctx.restore();

        // Footer Text
        const smallSize = Math.floor(canvas.width / 55);
        ctx.font = `bold ${smallSize}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.textAlign = 'right';
        ctx.fillText("Aset Resmi: MesinKasirSolo.my.id", canvas.width - 40, canvas.height - 40);

        canvas.toBlob((blob) => {
            if (blob) {
                resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
                resolve(processedFile);
            }
        }, 'image/jpeg', 0.98); // Kualitas output watermark juga 0.98
      };
      img.onerror = () => resolve(processedFile);
    };
    reader.onerror = () => resolve(processedFile);
  });
};
