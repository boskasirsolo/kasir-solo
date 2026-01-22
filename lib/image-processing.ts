
// --- IMAGE OPTIMIZATION (CLOUDINARY & UNSPLASH) ---
export const optimizeImage = (url: string, width: number = 1200) => {
  if (!url || typeof url !== 'string' || url === 'undefined') {
    return 'https://via.placeholder.com/1200x675?text=Mesin+Kasir+Solo';
  }

  if (url.includes('cloudinary.com')) {
    if (url.includes('f_auto,q_auto')) return url;
    // Paksa format auto (WebP/AVIF) di Cloudinary
    const params = [`f_auto`, `q_auto:best`, `c_limit`, `w_${width}`];
    return url.replace('/upload/', `/upload/${params.join(',')}/`);
  }

  if (url.includes('images.unsplash.com')) {
    try {
        const urlObj = new URL(url);
        urlObj.searchParams.set('w', width.toString());
        urlObj.searchParams.set('q', '90'); 
        urlObj.searchParams.set('fm', 'webp'); // Unsplash juga paksa WebP
        urlObj.searchParams.set('fit', 'max');
        return urlObj.toString();
    } catch(e) {
        return url;
    }
  }

  return url;
};

// --- CLIENT-SIDE WebP CONVERTER (V4.0 - WEBP HIGH FIDELITY) ---
export const autoCompressImage = async (file: File): Promise<File> => {
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

        // Jaga di resolusi 4K biar detail mesin kasir tetep gila
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

        // Rendering setingan dewa
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // KONVERSI KE WEBP DENGAN KUALITAS 0.9 (Ultra Sharp)
        const targetType = 'image/webp';
        const quality = 0.90; 

        canvas.toBlob((blob) => {
          if (blob) {
            // Ubah nama file, ganti ekstensinya jadi .webp
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const finalName = `${baseName}.webp`;
            
            const convertedFile = new File([blob], finalName, {
              type: targetType,
              lastModified: Date.now(),
            });
            
            console.log(`[MKS-WebP-Engine] Converted: ${file.name} (${(file.size / 1024).toFixed(0)}KB) -> ${finalName} (${(convertedFile.size / 1024).toFixed(0)}KB) Q:0.9`);
            resolve(convertedFile);
          } else {
            resolve(file);
          }
        }, targetType, quality);
      };

      img.onerror = () => resolve(file);
    };

    reader.onerror = () => resolve(file);
  });
};

// --- WATERMARK ENGINE (V4.0 - WEBP PRECISION) ---
export const addWatermarkToFile = async (file: File): Promise<File> => {
  // Semua file diproses lewat WebP Engine dulu
  const processedFile = await autoCompressImage(file);
  
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

        // Style Watermark MKS - Transparansi pas, tetep tegas
        const text = "PT MESIN KASIR SOLO";
        const fontSize = Math.floor(canvas.width / 22);
        ctx.font = `900 ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 12);
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)"; 
        ctx.fillText(text, 0, 0);
        ctx.restore();

        // Footer Text
        const smallSize = Math.floor(canvas.width / 55);
        ctx.font = `bold ${smallSize}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.textAlign = 'right';
        ctx.fillText("Official: MesinKasirSolo.my.id", canvas.width - 40, canvas.height - 40);

        canvas.toBlob((blob) => {
            if (blob) {
                // Return hasil akhir sebagai WebP kualitas 0.92 (sedikit lebih tinggi buat final)
                resolve(new File([blob], processedFile.name, { type: 'image/webp' }));
            } else {
                resolve(processedFile);
            }
        }, 'image/webp', 0.92);
      };
      img.onerror = () => resolve(processedFile);
    };
    reader.onerror = () => resolve(processedFile);
  });
};
