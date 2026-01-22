
import { useEffect, useRef } from 'react';

export const useScrollReveal = () => {
    const elementsRef = useRef<HTMLElement[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Gak usah diunobserve biar bisa repeat kalo mau, 
                    // tapi biasanya sekali reveal cukup.
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Cari semua elemen dengan class 'reveal-on-scroll'
        const targets = document.querySelectorAll('.reveal-on-scroll');
        targets.forEach(t => observer.observe(t));

        return () => observer.disconnect();
    }, []);

    return null;
};
