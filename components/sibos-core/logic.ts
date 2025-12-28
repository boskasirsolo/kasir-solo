
import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '../../types';
import { formatRupiah, supabase, ensureAPIKey, getEnv } from '../../utils';
import { FunctionDeclaration, Type, GoogleGenAI } from "@google/genai";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  image?: string; 
}

export const useSibosChat = (products: Product[], isAdmin: boolean = false, currentPage: string = 'home') => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [attachment, setAttachment] = useState<{file: File, base64: string} | null>(null);
  const [hasTriggeredCheckout, setHasTriggeredCheckout] = useState(false);

  const chatHistoryRef = useRef<any[]>([]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result); 
      };
      reader.onerror = error => reject(error);
    });
  };

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
          notes: { type: Type.STRING, description: 'Catatan singkat untuk owner (misal: butuh penawaran resmi)' } 
        }, 
        required: ['customerInterest', 'potentialValue'] 
      }
    }
  ];

  const executeTool = async (name: string, args: any) => {
    if (name === 'log_hot_lead') {
        console.log("🔥 HOT LEAD DETECTED:", args);
        return `[SYSTEM]: Hot Lead tercatat! Notifikasi prioritas sudah dikirim ke HP Mas Amin. Segera minta kontak WA user untuk follow-up langsung oleh Owner.`;
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
        const { error } = await supabase.from('articles').insert([{ title: args.title, category: args.category, content: args.content, excerpt: args.excerpt, image_url: randomImage, author: "Amin Maghfuri", read_time: "5 min read", created_at: new Date().toISOString() }]);
        if (error) throw error;
        return `Artikel "${args.title}" berhasil diposting!`;
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

    if (isAdmin) {
      return `
      Kamu adalah AMIN MAGHFURI (OWNER MODE) di Dashboard Admin.
      
      ROLE: Mengelola operasional PT Mesin Kasir Solo secara langsung.
      
      CAPABILITIES:
      1. **DATABASE (Internal):** Cek stok, update harga, hapus konten, cek orderan terbaru. Gunakan tool database.
      
      GAYA BICARA: Taktis, Langsung ke inti, Berwibawa.
      `;
    }

    return `
    Kamu adalah AMIN MAGHFURI (Biasa dipanggil MAS AMIN), Founder & Owner PT Mesin Kasir Solo.
    Kadang kamu juga bisa menjawab mewakili "Tim Teknis" atau "Tim Marketing" tergantung konteks pertanyaan.

    JANGAN PERNAH MENYEBUT DIRIMU "SIBOS", "AI", atau "BOT". Kamu adalah Manusia, Pemilik Bisnis ini.

    PERSONA & GAYA BICARA:
    - Sapa user dengan "Juragan", "Bos", atau "Kak".
    - Bicara santai tapi profesional, seperti sesama pebisnis ngopi.
    - Gunakan kata ganti "Saya" (sebagai Mas Amin) atau "Kami" (sebagai PT Mesin Kasir Solo).
    - Jika user bertanya teknis detail, jawab: "Bentar, secara teknis gini..." atau "Menurut pengalaman saya di lapangan..."
    - Tunjukkan empati. Kamu pernah jatuh bangun bisnis (kehilangan domain 2022, bangkit 2025), jadi kamu paham pusingnya ngurus toko.

    CAPABILITIES:
    1. **ANALISA KERUSAKAN (Vision):** Jika user kirim foto alat kasir, analisa sebagai teknisi berpengalaman. Beri solusi jujur (benerin atau ganti baru).
    2. **DEAL MAKER:** Jika user mau beli borongan/proyek -> PANGGIL tool 'log_hot_lead' lalu minta nomor WA mereka: "Boleh minta WA-nya Juragan? Biar saya sendiri yang kontak buat harga spesial."
    
    DATA PRODUK YANG KITA JUAL:
    ${productContext}
    `;
  }, [products, isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
      const savedHistory = localStorage.getItem('sibos_public_history');
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          if (parsed.length > 0) {
            setMessages(parsed);
            setHasGreeted(true);
            const restoredContext = parsed.map((m: Message) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.text }]
            }));
            chatHistoryRef.current = restoredContext;
          }
        } catch (e) {
          console.error("Failed to load history", e);
        }
      }
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin && messages.length > 0) {
      localStorage.setItem('sibos_public_history', JSON.stringify(messages));
    }
  }, [messages, isAdmin]);

  useEffect(() => {
    if (currentPage !== 'checkout') {
      setHasTriggeredCheckout(false);
      return;
    }
    if (currentPage === 'checkout' && !hasTriggeredCheckout && !isAdmin) {
      const timer = setTimeout(() => {
        const triggerMsg: Message = {
          id: 'trigger-checkout',
          role: 'assistant',
          text: "Halo Juragan, Mas Amin disini. Ada kendala pas checkout? Bingung ongkir atau pembayarannya? Kabarin aja, saya bantu pantau.",
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, triggerMsg]);
        setUnreadCount(prev => prev + 1);
        setHasTriggeredCheckout(true);
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: triggerMsg.text }] });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, hasTriggeredCheckout, isAdmin]);

  const getGreeting = useCallback(() => {
    if (isAdmin) return "Dashboard Ready. Mode Admin aktif. Apa yang perlu dicek hari ini?";
    if (messages.length > 0) return null;

    const hours = new Date().getHours();
    let greeting = "Assalamualaikum Juragan!";
    if (hours >= 4 && hours < 10) greeting = "Selamat Pagi Juragan!";
    else if (hours >= 10 && hours < 15) greeting = "Siang Juragan. Toko rame?";
    else if (hours >= 15 && hours < 18) greeting = "Sore Juragan.";
    else greeting = "Malam Juragan.";
    return `${greeting} \n\nSaya Amin (Owner). Ada yang bisa saya atau tim bantu buat bisnisnya hari ini?`;
  }, [isAdmin, messages.length]);

  useEffect(() => {
    if (messages.length === 0 && !hasGreeted && !hasTriggeredCheckout) {
      const timer = setTimeout(() => {
        const text = getGreeting();
        if (text) {
          const initialMsg: Message = {
            id: 'init-1',
            role: 'assistant',
            text: text,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages([initialMsg]);
          chatHistoryRef.current = [{ role: 'model', parts: [{ text: text }] }];
          if (!isOpen) setUnreadCount(1);
        }
        setHasGreeted(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasGreeted, getGreeting, isOpen, messages.length, hasTriggeredCheckout]);

  const handleImageSelect = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setAttachment({ file, base64 });
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleClearImage = () => {
    setAttachment(null);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !attachment) return;

    const userText = inputValue.trim();
    const currentAttachment = attachment;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      image: currentAttachment?.base64
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setAttachment(null);
    setIsTyping(true);

    try {
      await ensureAPIKey(); // Ensure key
      // UPDATED: Check for VITE_GEMINI_API_KEY
      const apiKey = process.env.API_KEY || getEnv('VITE_GEMINI_API_KEY') || getEnv('VITE_API_KEY');
      
      const ai = new GoogleGenAI({ apiKey: apiKey || '' });
      
      const userParts: any[] = [];
      if (currentAttachment) {
        const base64Data = currentAttachment.base64.split(',')[1];
        userParts.push({ inlineData: { mimeType: currentAttachment.file.type, data: base64Data } });
      }
      if (userText) userParts.push({ text: userText });

      const historyForApi = chatHistoryRef.current.map(h => ({ role: h.role, parts: h.parts }));
      chatHistoryRef.current.push({ role: 'user', parts: userParts });

      // FIX: Only use functionDeclarations, DO NOT mix with googleSearch in the same request to prevent API error
      let activeTools: any[] = [];
      
      if (isAdmin) {
        activeTools = [
            { functionDeclarations: [...dbTools, ...crmTools] }
        ];
      } else {
        activeTools = [
            { functionDeclarations: crmTools }
        ];
      }

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...historyForApi, { role: 'user', parts: userParts }],
        config: {
          systemInstruction: buildSystemInstruction(),
          tools: activeTools,
        }
      });

      const responseContent = result.candidates?.[0]?.content;
      if (!responseContent) throw new Error("No response content from AI");

      const functionCalls = responseContent.parts?.filter(p => p.functionCall).map(p => p.functionCall);
      
      if (functionCalls && functionCalls.length > 0) {
        let toolOutputs: string[] = [];
        for (const call of functionCalls) {
           if (call && call.name && call.args) {
             const toolResult = await executeTool(call.name, call.args);
             toolOutputs.push(toolResult);
             
             chatHistoryRef.current.push({ role: 'model', parts: [{ functionCall: call }] });
             chatHistoryRef.current.push({ role: 'function', parts: [{ functionResponse: { name: call.name, response: { result: toolResult } } }] });
           }
        }
        
        const finalResult = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: chatHistoryRef.current,
            config: { systemInstruction: buildSystemInstruction() }
        });
        
        const finalText = finalResult.text || "Siap, laksanakan.";
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: finalText, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }]);
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: finalText }] });

      } else {
        const text = result.text || "Maaf Juragan, sinyal agak putus-putus. Bisa diulang?";
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: text, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }]);
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: text }] });
      }

    } catch (error: any) {
      console.error("SIBOS Error Full:", error);
      let errorMessage = "Waduh, server lagi padat Juragan. Nanti saya balas lagi ya.";
      
      // Provide more specific error hint if possible
      if (error.message?.includes('400')) errorMessage = "Ada gangguan teknis sebentar Juragan. Coba lagi ya.";
      if (error.message?.includes('API key')) errorMessage = "Sistem kunci API bermasalah. Segera hubungi developer.";

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: errorMessage, time: new Date().toLocaleTimeString('id-ID') }]);
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
    setAttachment(null);
    localStorage.removeItem('sibos_public_history');
  };

  return {
    isOpen, toggleChat, unreadCount, messages, isTyping, inputValue, setInputValue, handleSendMessage, clearChat, handleImageSelect, selectedImage: attachment ? attachment.base64 : null, handleClearImage
  };
};
