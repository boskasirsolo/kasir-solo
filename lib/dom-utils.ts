
// --- DOM UTILITIES ---
export const injectGoogleTags = (gaId?: string, gscCode?: string) => {
  if (typeof window === 'undefined') return;

  if (gaId && !document.getElementById('ga-script')) {
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.id = 'ga-inline';
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(inlineScript);
  }

  if (gscCode && !document.querySelector('meta[name="google-site-verification"]')) {
    const meta = document.createElement('meta');
    meta.name = "google-site-verification";
    meta.content = gscCode;
    document.head.appendChild(meta);
  }
};
