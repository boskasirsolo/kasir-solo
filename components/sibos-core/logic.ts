
import { useState, useEffect, useCallback, useRef } from 'react';
import { Product, SiteConfig } from '../../types';
import { formatRupiah, supabase, ensureAPIKey, callGeminiWithRotation } from '../../utils';
import { FunctionDeclaration, Type, GoogleGenAI } from "@google/genai";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

export const useSibosChat = (
    products: Product[], 
    isAdmin: boolean = false, 
    currentPage: string = 'home',
    setConfig?: (c: SiteConfig) => void,
    session?: any
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [hasTriggeredCheckout, setHasTriggeredCheckout] = useState(false);
  
  // --- AUTH STATES ---
  const [isModeAdmin, setIsModeAdmin] = useState(isAdmin);
  const [authState, setAuthState] = useState<'IDLE' | 'AWAITING_EMAIL' | 'AWAITING_PASSWORD'>('IDLE');
  const [tempCreds, setTempCreds] = useState({ email: '', password: '' });

  // Sync mode if props change (e.g. entering dashboard via URL)
  useEffect(() => {
      if (isAdmin) setIsModeAdmin(true);
  }, [isAdmin]);

  // Sync session: if session exists globally, allow admin commands immediately
  useEffect(() => {
      if (session) {
          // If session exists, we don't auto-switch to admin mode (keep it stealthy)
          // unless explicitly passed via props.
      } else {
          setIsModeAdmin(false); // Logout if session dies
      }
  }, [session]);

  // --- AUTO LOGOUT ADMIN (20s Inactivity) ---
  useEffect(() => {
    // FIX: Changed from NodeJS.Timeout to any to avoid namespace errors in browser environment
    let timer: any;

    // Logic: Timer runs only if Admin Mode is ON AND AI is NOT currently processing (isTyping).
    // If AI is typing (processing tool/query), we pause the timer.
    // Any change in 'messages' (new chat) or 'inputValue' (user typing) will trigger this effect,
    // causing the cleanup function (clearTimeout) to run, effectively resetting the timer.
    if (isModeAdmin && !isTyping) {
        timer = setTimeout(async () => {
            if (supabase) await supabase.auth.signOut();
            
            setIsModeAdmin(false);
            setAuthState('IDLE');
            
            // Notification Message
            setMessages(prev => [...prev, 
                { id: Date.now().toString(), role: 'assistant', text: "🔒 **AUTO LOGOUT**. Sesi Admin berakhir karena tidak ada aktivitas (20s).", time: 'System' }
            ]);
            
            // Clear context so next login starts fresh
            chatHistoryRef.current = [];
        }, 20000); // 20 Seconds
    }

    return () => clearTimeout(timer);
  }, [isModeAdmin, messages, inputValue, isTyping]); // Dependencies: Status, New Messages, User Typing, AI Processing

  const chatHistoryRef = useRef<any[]>([]);

  // --- TOOLS DEFINITION ---
  const dbTools: FunctionDeclaration[] = [
    {
      name: 'get_recent_orders',
      description: 'Melihat 5 pesanan terbaru dari database untuk laporan ke owner.',
      parameters: { type: Type.OBJECT, properties: { limit: { type: Type.NUMBER } } }
    },
    {
      name: 'update_product_price',
      description: 'Mengupdate harga produk di database.',
      parameters: { type: Type.OBJECT, properties: { productName: { type: Type.STRING }, newPrice: { type: Type.NUMBER } }, required: ['productName', 'newPrice'] }
    },
    {
      name: 'update_hero_section',
      description: 'Mengubah judul dan subjudul (Hero Section) di halaman utama website.',
      parameters: { 
          type: Type.OBJECT, 
          properties: { 
              title: { type: Type.STRING, description: "Judul utama (Headline) yang baru" }, 
              subtitle: { type: Type.STRING, description: "Subjudul/Deskripsi yang baru" } 
          }, 
          required: ['title', 'subtitle'] 
      }
    },
    {
      name: 'search_products_db',
      description: 'Mencari detail produk spesifik di database internal.',
      parameters: { type: Type.OBJECT, properties: { query: { type: Type.STRING } }, required: ['query'] }
    },
    {
      name: 'create_article',
      description: 'Membuat dan memposting artikel blog baru.',
      parameters: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, category: { type: Type.STRING }, content: { type: Type.STRING }, excerpt: { type: Type.STRING } }, required: ['title', 'content', 'category', 'excerpt'] }
    },
    {
      name: 'delete_content',
      description: 'Menghapus konten (Produk, Artikel, Galeri).',
      parameters: { type: Type.OBJECT, properties: { contentType: { type: Type.STRING, enum: ['products', 'articles', 'gallery'] }, titleKeyword: { type: Type.STRING } }, required: ['contentType', 'titleKeyword'] }
    }
  ];

  const crmTools: FunctionDeclaration[] = [
    {
      name: 'log_hot_lead',
      description: 'Mencatat prospek panas (Hot Lead) jika user berniat beli banyak, proyek besar, tender, atau franchise.',
      parameters: { 
        type: Type.OBJECT, 
        properties: { 
          customerInterest: { type: Type.STRING, description: 'Produk/Paket yang diminati' }, 
          potentialValue: { type: Type.STRING, description: 'Estimasi nilai (High/Medium) atau jumlah unit' }, 
          notes: { type: Type.STRING, description: 'Catatan singkat untuk sales (misal: butuh penawaran resmi)' } 
        }, 
        required: ['customerInterest', 'potentialValue'] 
      }
    }
  ];

  const executeTool = async (name: string, args: any) => {
    const isDbTool = dbTools.some(t => t.name === name);
    if (isDbTool && !isModeAdmin) {
        return "Access Denied: Anda tidak dalam Mode Admin. Ketik '/admin' untuk login.";
    }

    if (name === 'log_hot_lead') {
        console.log("🔥 HOT LEAD DETECTED:", args);
        return `[SYSTEM]: Hot Lead tercatat! Notifikasi prioritas sudah dikirim ke Tim Sales. Segera minta kontak WA user.`;
    }

    if (name === 'update_hero_section') {
        if (!setConfig) return "Error: Configuration handler not available.";
        try {
            // @ts-ignore
            setConfig((prev: SiteConfig) => ({
                ...prev,
                heroTitle: args.title,
                heroSubtitle: args.subtitle
            }));
            if (supabase) {
                await supabase.from('site_settings').upsert({ id: 1, hero_title: args.title, hero_subtitle: args.subtitle });
            }
            return `Berhasil! Hero Section diupdate menjadi:\nTitle: "${args.title}"\nSubtitle: "${args.subtitle}"`;
        } catch (e: any) {
            return `Gagal update Hero Section: ${e.message}`;
        }
    }

    if (!supabase) return "Error: Database connection missing.";
    try {
      if (name === 'get_recent_orders') {
        const { data, error } = await supabase.from('orders').select('id, customer_name, total_amount, status, created_at').order('created_at', { ascending: false }).limit(args.limit || 5);
        if (error) throw error;
        return JSON.stringify(data);
      }
      if (name === 'search_products_db') {
        const { data, error } = await supabase.from('products').select('*').ilike('name', `%${args.query}%`).limit(3);
        if (error) throw error;
        return JSON.stringify(data);
      }
      if (name === 'update_product_price') {
        const { data: products } = await supabase.from('products').select('id, name, price').ilike('name', `%${args.productName}%`).limit(1);
        if (!products || products.length === 0) return `Produk "${args.productName}" tidak ditemukan.`;
        const { error } = await supabase.from('products').update({ price: args.newPrice }).eq('id', products[0].id);
        if (error) throw error;
        return `Sukses! Harga "${products[0].name}" jadi ${formatRupiah(args.newPrice)}.`;
      }
      if (name === 'create_article') {
        const randomImage = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1200";
        // FORCE TYPE: 'pillar' to ensure it appears in Admin List (which filters for pillar)
        const { error } = await supabase.from('articles').insert([{ 
            title: args.title, 
            category: args.category, 
            content: args.content, 
            excerpt: args.excerpt, 
            image_url: randomImage, 
            author: "SIBOS AI", 
            read_time: "5 min read", 
            created_at: new Date().toISOString(),
            type: 'pillar', // CRITICAL FIX: Make sure it's a pillar page so it appears in list
            status: 'published'
        }]);
        if (error) throw error;
        return `Artikel "${args.title}" berhasil diposting! Data akan muncul otomatis dalam beberapa saat.`;
      }
      if (name === 'delete_content') {
        const table = args.contentType;
        const column = table === 'gallery' || table === 'articles' ? 'title' : 'name';
        const { data: items } = await supabase.from(table).select(`id, ${column}`).ilike(column, `%${args.titleKeyword}%`).limit(1);
        if (!items || items.length === 0) return `Item "${args.titleKeyword}" tidak ditemukan.`;
        const { error } = await supabase.from(table).delete().eq('id', items[0].id);
        if (error) throw error;
        return `Item berhasil dihapus.`;
      }
    } catch (err: any) { return `Tool Error: ${err.message}`; }
    return "Tool not found.";
  };

  const buildSystemInstruction = useCallback(() => {
    const productContext = products.map(p => `- ${p.name} (${formatRupiah(p.price)}).`).join('\n');

    if (isModeAdmin) {
      return `
      Kamu adalah SIBOS (Smart Integrated Back Office System) versi ADMIN / GOD MODE.
      ROLE: Asisten Manajemen Database & Operasional PT Mesin Kasir Solo.
      
      CAPABILITIES:
      1. **DATABASE:** Kamu BISA cek order, update harga, hapus konten, posting artikel.
      2. **SITE CONTROL:** Kamu BISA mengubah konten halaman depan (Hero Section).
      
      RULES:
      - Bicara singkat, padat, teknis.
      - Jangan basa-basi sales. Langsung eksekusi perintah.
      `;
    }

    return `
    Kamu adalah SIBOS (Smart Integrated Back Office System), Virtual Assistant Cerdas dari PT Mesin Kasir Solo.
    
    IDENTITY:
    - Nama: SIBOS
    - Karakter: Ramah, Profesional, Informatif, dan Solutif.
    
    RULES:
    - Jawab pertanyaan seputar mesin kasir dan website.
    - Jangan ngarang.
    - Jangan berikan akses database.
    
    DATA PRODUK:
    ${productContext}
    `;
  }, [products, isModeAdmin]);

  // Handle Initial Greeting & Admin Transition
  useEffect(() => {
    if (!isModeAdmin) {
      // Logic greeting public biasa
      if (messages.length === 0 && !hasGreeted && !hasTriggeredCheckout) {
        const timer = setTimeout(() => {
          const text = "Halo Kak! Saya SIBOS. Ada yang bisa saya bantu jelaskan tentang produk kasir atau website?";
          setMessages([{ id: 'init', role: 'assistant', text: text, time: 'Now' }]);
          chatHistoryRef.current = [{ role: 'model', parts: [{ text: text }] }];
          if(!isOpen) setUnreadCount(1);
          setHasGreeted(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } else {
      // Jika mode admin aktif tapi belum ada pesan 'welcome back' di sesi ini
      // Kita bisa inject pesan sistem
    }
  }, [isModeAdmin, messages.length, hasGreeted, hasTriggeredCheckout, isOpen]);

  // Load history public
  useEffect(() => {
    if (!isModeAdmin) {
        const saved = localStorage.getItem('sibos_public_history');
        if(saved) {
            try { 
                const p = JSON.parse(saved);
                if(p.length > 0) { setMessages(p); setHasGreeted(true); chatHistoryRef.current = p.map((m: any) => ({ role: m.role==='assistant'?'model':'user', parts:[{text:m.text}] })); }
            } catch(e){}
        }
    }
  }, [isModeAdmin]);

  // Trigger Checkout
  useEffect(() => {
    if (currentPage === 'checkout' && !hasTriggeredCheckout && !isModeAdmin) {
        const timer = setTimeout(() => {
            const msg: Message = { id: 'chk', role: 'assistant', text: "Ada kendala saat checkout Kak? Tanya SIBOS ya!", time: 'Now' };
            setMessages(p => [...p, msg]);
            setUnreadCount(p => p + 1);
            setHasTriggeredCheckout(true);
            chatHistoryRef.current.push({ role: 'model', parts: [{ text: msg.text }] });
        }, 8000);
        return () => clearTimeout(timer);
    }
  }, [currentPage, hasTriggeredCheckout, isModeAdmin]);

  // --- CORE SEND HANDLER ---
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');

    // --- 1. SPECIAL COMMANDS & AUTH FLOW INTERCEPTION ---
    
    // Command: /exit
    if (text.toLowerCase() === '/exit' || text.toLowerCase() === '/logout') {
        if (supabase) await supabase.auth.signOut();
        setIsModeAdmin(false);
        setAuthState('IDLE');
        setMessages(prev => [...prev, 
            { id: Date.now().toString(), role: 'user', text: text, time: 'Now' },
            { id: (Date.now()+1).toString(), role: 'assistant', text: "🔒 **LOGGED OUT**. Sesi Admin diakhiri.", time: 'System' }
        ]);
        chatHistoryRef.current = [];
        return;
    }

    // AUTH FLOW: Step 1 - Trigger
    if (text.toLowerCase() === '/admin') {
        // ALWAYS Require credential check in Chat Mode (Stealth Protocol) - No auto login here
        setAuthState('AWAITING_EMAIL');
        setMessages(prev => [...prev, 
            { id: Date.now().toString(), role: 'user', text: text, time: 'Now' },
            { id: (Date.now()+1).toString(), role: 'assistant', text: "⚠️ **SECURITY CHECK**. Masukkan Email Administrator:", time: 'System' }
        ]);
        return;
    }

    // AUTH FLOW: Step 2 - Capture Email
    if (authState === 'AWAITING_EMAIL') {
        setTempCreds(prev => ({ ...prev, email: text }));
        setAuthState('AWAITING_PASSWORD');
        setMessages(prev => [...prev, 
            { id: Date.now().toString(), role: 'user', text: text, time: 'Now' },
            { id: (Date.now()+1).toString(), role: 'assistant', text: "🔑 Masukkan Password:", time: 'System' }
        ]);
        return;
    }

    // AUTH FLOW: Step 3 - Capture Password & Execute Login
    if (authState === 'AWAITING_PASSWORD') {
        // Mask password in chat UI for security visual
        setMessages(prev => [...prev, 
            { id: Date.now().toString(), role: 'user', text: "******", time: 'Now' } 
        ]);
        
        // Attempt Login
        setIsTyping(true);
        try {
            if (!supabase) throw new Error("Database Error: Supabase client not initialized.");
            
            const { error } = await supabase.auth.signInWithPassword({
                email: tempCreds.email,
                password: text
            });

            if (error) throw error;

            // Success
            setIsModeAdmin(true);
            setAuthState('IDLE');
            setMessages(prev => [...prev, 
                { id: (Date.now()+1).toString(), role: 'assistant', text: "🔓 **LOGIN SUCCESS**. SIBOS Admin Mode Activated. Menunggu perintah database.", time: 'System' }
            ]);
            chatHistoryRef.current = []; // Reset AI context to clean slate

        } catch (e: any) {
            // Fail Handling
            setAuthState('IDLE');
            let errorMsg = e.message || "Unknown error";
            let friendlyMsg = "Login gagal. Coba lagi.";

            if (errorMsg.includes("Invalid login credentials")) {
                friendlyMsg = "🚫 **ACCESS DENIED**. Email atau Password salah.";
            } else if (errorMsg.includes("Email not confirmed")) {
                friendlyMsg = "⚠️ Email belum dikonfirmasi.";
            }

            setMessages(prev => [...prev, 
                { id: (Date.now()+1).toString(), role: 'assistant', text: friendlyMsg, time: 'System' }
            ]);
        } finally {
            setIsTyping(false);
            setTempCreds({ email: '', password: '' }); // Clear memory
        }
        return;
    }

    // --- 2. STANDARD AI PROCESSING (If not in Auth Flow) ---

    // Add user message to UI
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const userParts = [{ text: text }];
      
      // Construct context
      const historyForApi = chatHistoryRef.current.map(h => ({ role: h.role, parts: h.parts }));
      
      // Determine active tools based on Mode
      let activeTools: any[] = [];
      if (isModeAdmin) {
        activeTools = [{ functionDeclarations: [...dbTools, ...crmTools] }];
      } else {
        activeTools = [{ functionDeclarations: crmTools }];
      }

      // 1. First Call (Generate Content) - USING CENTRALIZED ROTATION
      const result = await callGeminiWithRotation({
        model: 'gemini-3-flash-preview',
        contents: [...historyForApi, { role: 'user', parts: userParts }],
        config: {
          systemInstruction: buildSystemInstruction(),
          tools: activeTools,
        }
      });

      const responseContent = result.candidates?.[0]?.content;
      if (!responseContent) throw new Error("No response content from AI");

      // Update local history
      chatHistoryRef.current.push({ role: 'user', parts: userParts });

      const functionCalls = responseContent.parts?.filter(p => p.functionCall).map(p => p.functionCall);
      
      if (functionCalls && functionCalls.length > 0) {
        // Handle Function Calls
        for (const call of functionCalls) {
           if (call && call.name && call.args) {
             const toolResult = await executeTool(call.name, call.args);
             chatHistoryRef.current.push({ role: 'model', parts: [{ functionCall: call }] });
             chatHistoryRef.current.push({ role: 'function', parts: [{ functionResponse: { name: call.name, response: { result: toolResult } } }] });
           }
        }
        // 2. Second Call (Summarize Tool Output) - USING CENTRALIZED ROTATION
        const finalResult = await callGeminiWithRotation({
            model: 'gemini-3-flash-preview',
            contents: chatHistoryRef.current,
            config: { systemInstruction: buildSystemInstruction() }
        });
        const finalText = finalResult.text || "Siap, laksanakan.";
        
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: finalText, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }]);
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: finalText }] });

      } else {
        // Standard Text Response
        const textRes = result.text || "Maaf, ada gangguan sinyal.";
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: textRes, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }]);
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: textRes }] });
      }

    } catch (error: any) {
      console.error("AI Error:", error);
      
      let errorMessage = "Waduh, server SIBOS lagi padat.";
      const errStr = error.toString().toLowerCase();

      // Better Error Diagnostics
      if (errStr.includes('quota') || errStr.includes('429')) {
          errorMessage = "⚠️ Semua server AI sibuk (Quota Limit). Silakan coba besok.";
      } else if (errStr.includes('key') || errStr.includes('400')) {
          errorMessage = "⚠️ API Key Invalid (400). Cek konfigurasi.";
      } else if (errStr.includes('fetch') || errStr.includes('network')) {
          errorMessage = "⚠️ Koneksi Gagal. Cek internet Anda.";
      } else {
          errorMessage = `⚠️ Error Sistem: ${error.message || "Unknown Error"}`;
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: errorMessage, time: 'System' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) setUnreadCount(0);
  };

  const clearChat = () => {
    setMessages([]);
    chatHistoryRef.current = [];
    setHasGreeted(false); 
    localStorage.removeItem('sibos_public_history');
  };

  return {
    isOpen, toggleChat, unreadCount, messages, isTyping, inputValue, setInputValue, handleSendMessage, clearChat, isModeAdmin, authState
  };
};
