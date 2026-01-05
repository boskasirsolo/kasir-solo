
// --- IMAGE OPTIMIZATION (CLOUDINARY & UNSPLASH) ---
export const optimizeImage = (url: string, width: number = 800) => {
  if (!url) return '';

  // 1. Handle Cloudinary
  if (url.includes('cloudinary.com')) {
    // Prevent double optimization if params already exist
    if (url.includes('f_auto,q_auto')) return url;

    // Params: 
    // f_auto: Format auto (WebP/AVIF)
    // q_auto:eco: Aggressive compression for speed
    // c_limit: Resize without upscaling (maintains aspect ratio)
    // w_{width}: Target width
    const params = [`f_auto`, `q_auto:eco`, `c_limit`, `w_${width}`];

    // Insert params after /upload/
    return url.replace('/upload/', `/upload/${params.join(',')}/`);
  }

  // 2. Handle Unsplash (Common in Mock Data)
  if (url.includes('images.unsplash.com')) {
    try {
        const urlObj = new URL(url);
        urlObj.searchParams.set('w', width.toString());
        urlObj.searchParams.set('q', '75'); // Eco quality
        urlObj.searchParams.set('fm', 'webp'); // Next-gen format
        urlObj.searchParams.set('fit', 'max'); // Prevent upscaling
        return urlObj.toString();
    } catch(e) {
        // Fallback if URL parsing fails
        return url;
    }
  }

  // 3. Fallback for others (return original)
  return url;
};

// --- WATERMARK ENGINE (SECURITY) ---
export const addWatermarkToFile = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            resolve(file); // Fallback if canvas fails
            return;
        }

        // Set dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Watermark Configuration
        const text = "PT MESIN KASIR SOLO";
        const fontSize = Math.floor(canvas.width / 15); // Responsive font size
        ctx.font = `900 ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Style 1: Center Diagonal (The Fortress)
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6); // -30 degrees
        
        // Shadow/Outline for visibility on any background
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.strokeText(text, 0, 0);

        // Main Text
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; // White semi-transparent
        ctx.fillText(text, 0, 0);
        ctx.restore();

        // Style 2: Bottom Right Copyright (Subtle)
        ctx.save();
        const smallSize = Math.floor(canvas.width / 35);
        ctx.font = `bold ${smallSize}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;
        ctx.textAlign = 'right';
        ctx.fillText("© Original Asset by MesinKasirSolo.com", canvas.width - 20, canvas.height - 20);
        ctx.restore();

        // Convert back to File
        canvas.toBlob((blob) => {
            if (blob) {
                const watermarkedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                });
                resolve(watermarkedFile);
            } else {
                resolve(file);
            }
        }, file.type, 0.9); // 0.9 quality
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};
