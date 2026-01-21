
// --- IMAGE OPTIMIZATION (CLOUDINARY & UNSPLASH) ---
export const optimizeImage = (url: string, width: number = 800) => {
  if (!url) return '';

  if (url.includes('cloudinary.com')) {
    if (url.includes('f_auto,q_auto')) return url;
    const params = [`f_auto`, `q_auto:eco`, `c_limit`, `w_${width}`];
    return url.replace('/upload/', `/upload/${params.join(',')}/`);
  }

  if (url.includes('images.unsplash.com')) {
    try {
        const urlObj = new URL(url);
        urlObj.searchParams.set('w', width.toString());
        urlObj.searchParams.set('q', '75');
        urlObj.searchParams.set('fm', 'webp');
        urlObj.searchParams.set('fit', 'max');
        return urlObj.toString();
    } catch(e) {
        return url;
    }
  }

  return url;
};

// --- CLIENT-SIDE AUTO COMPRESSOR ---
export const autoCompressImage = async (file: File, maxSizeMB: number = 2): Promise<File> => {
  if (file.size <= maxSizeMB * 1024 * 1024) return file;

  console.log(`[AutoCompress] File ${file.name} kegedean (${(file.size / 1024 / 1024).toFixed(2)}MB). Mengecilkan...`);

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

        // Max dimension 1920px (Full HD) biar gak pecah tapi ringan
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            console.log(`[AutoCompress] Beres! Sekarang cuma ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8); // 80% quality is sweet spot
      };
    };
  });
};

// --- WATERMARK ENGINE (SECURITY) ---
export const addWatermarkToFile = async (file: File): Promise<File> => {
  // Pastikan file sudah dikompres dulu biar ringan diproses watermark
  const lightFile = await autoCompressImage(file);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(lightFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            resolve(lightFile);
            return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const text = "PT MESIN KASIR SOLO";
        const fontSize = Math.floor(canvas.width / 15);
        ctx.font = `900 ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.strokeText(text, 0, 0);
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillText(text, 0, 0);
        ctx.restore();

        ctx.save();
        const smallSize = Math.floor(canvas.width / 35);
        ctx.font = `bold ${smallSize}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;
        ctx.textAlign = 'right';
        ctx.fillText("© Original Asset by MesinKasirSolo.com", canvas.width - 20, canvas.height - 20);
        ctx.restore();

        canvas.toBlob((blob) => {
            if (blob) {
                const watermarkedFile = new File([blob], file.name, {
                    type: lightFile.type,
                    lastModified: Date.now(),
                });
                resolve(watermarkedFile);
            } else {
                resolve(lightFile);
            }
        }, lightFile.type, 0.9);
      };
      img.onerror = () => resolve(lightFile);
    };
    reader.onerror = () => resolve(lightFile);
  });
};
