import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '../../types';
import { ai, formatRupiah, supabase } from '../../utils';
import { FunctionDeclaration, Type } from "@google/genai";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  image?: string; // Support visual history
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

  // Ref untuk history chat context
  const chatHistoryRef = useRef<any[]>([]);

  // --- HELPER: IMAGE TO BASE64 ---
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

  // --- TOOLS DEFINITION (Sama seperti sebelumnya) ---
  const adminTools: FunctionDeclaration[] = [
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
      description: 'Mencari detail produk spesifik di database.',
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

  const executeTool = async (name: string, args: any) => {
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
        const { error } = await supabase.from('articles').insert([{ title: args.title, category: args.category, content: args.content, excerpt: args.excerpt, image_url: randomImage, author: "SIBOS AI", read_time: "5 min read", created_at: new Date().toISOString() }]);
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
      return `Kamu adalah SIBOS PRO (Admin Mode). Fokus: Data, Profit, Efisiensi. Panggil "Chief". Akses Database Aktif.`;
    }

    return `
    Kamu adalah SIBOS (Sales Consultant PT Mesin Kasir Solo).
    
    1. **VISION (Dokter Gadget):** Jika user kirim foto barang rusak/kuno, analisan modelnya (misal: "Wah ini Epson TM-U220 lama ya Bos"). Berikan solusi upgrade ke produk kita yang lebih modern. Tunjukkan empati teknis.
    2. **SALES:** Bantu UMKM pilih kasir. Panggil "Juragan".
    
    DATA PRODUK:
    ${productContext}
    `;
  }, [products, isAdmin]);

  // --- 1. MEMORY OF ELEPHANT (Load History) ---
  useEffect(() => {
    // Hanya load history untuk user publik (bukan admin) biar privasi admin terjaga per sesi
    if (!isAdmin) {
      const savedHistory = localStorage.getItem('sibos_public_history');
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          // Cek kalau history udah kadaluarsa (misal > 7 hari), clear aja biar gak berat
          // Untuk simpelnya kita load semua dulu
          if (parsed.length > 0) {
            setMessages(parsed);
            setHasGreeted(true);
            
            // Reconstruct minimal context for AI (Text only for simplicity)
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

  // --- 2. MEMORY OF ELEPHANT (Save History) ---
  useEffect(() => {
    if (!isAdmin && messages.length > 0) {
      localStorage.setItem('sibos_public_history', JSON.stringify(messages));
    }
  }, [messages, isAdmin]);

  // --- 3. BEHAVIORAL TRIGGER (Si Sales Peka) ---
  useEffect(() => {
    // Reset trigger kalau pindah halaman selain checkout
    if (currentPage !== 'checkout') {
      setHasTriggeredCheckout(false);
      return;
    }

    // Jika di halaman checkout dan belum ditrigger
    if (currentPage === 'checkout' && !hasTriggeredCheckout && !isAdmin) {
      const timer = setTimeout(() => {
        const triggerMsg: Message = {
          id: 'trigger-checkout',
          role: 'assistant',
          text: "Ragu sama ongkirnya ya Juragan? Atau bingung cara transfernya? Sini SIBOS bantu cek ongkir termurah atau pandu pembayarannya. Santai aja...",
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, triggerMsg]);
        setUnreadCount(prev => prev + 1);
        setHasTriggeredCheckout(true);
        
        // Add to history context
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: triggerMsg.text }] });
        
        // Play sound effect (optional/advanced, skip for now)
      }, 8000); // 8 detik bengong di checkout -> Trigger SIBOS

      return () => clearTimeout(timer);
    }
  }, [currentPage, hasTriggeredCheckout, isAdmin]);

  // --- 4. DEFAULT GREETING ---
  const getGreeting = useCallback(() => {
    if (isAdmin) return "SIBOS PRO Online. Database Access Ready.";
    
    // Greeting yang lebih personal kalo ada history
    if (messages.length > 0) return null; // Udah ada history, gak usah greeting ulang

    const hours = new Date().getHours();
    let greeting = "Assalamualaikum Juragan!";
    if (hours >= 4 && hours < 10) greeting = "Pagi Juragan!";
    else if (hours >= 10 && hours < 15) greeting = "Siang Juragan. Toko rame?";
    else greeting = "Malam Juragan.";
    return `${greeting} \n\nAda yang bisa SIBOS bantu soal mesin kasir hari ini?`;
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


  // --- 5. SEND MESSAGE (Sama seperti sebelumnya) ---
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
      const userParts: any[] = [];
      if (currentAttachment) {
        const base64Data = currentAttachment.base64.split(',')[1];
        userParts.push({ inlineData: { mimeType: currentAttachment.file.type, data: base64Data } });
      }
      if (userText) userParts.push({ text: userText });

      const historyForApi = chatHistoryRef.current.map(h => ({ role: h.role, parts: h.parts }));
      chatHistoryRef.current.push({ role: 'user', parts: userParts });

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...historyForApi, { role: 'user', parts: userParts }],
        config: {
          systemInstruction: buildSystemInstruction(),
          tools: isAdmin ? [{ functionDeclarations: adminTools }] : [{ googleSearch: {} }],
        }
      });

      const responseContent = result.candidates?.[0]?.content;
      if (!responseContent) throw new Error("No response");

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
        const finalText = finalResult.text || "Perintah dijalankan.";
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: finalText, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }]);
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: finalText }] });

      } else {
        const text = result.text || "";
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: text, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }]);
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: text }] });
      }

    } catch (error) {
      console.error("SIBOS Error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: "Maaf Chief/Juragan, sistem sedang sibuk.", time: new Date().toLocaleTimeString('id-ID') }]);
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
    localStorage.removeItem('sibos_public_history'); // Hapus ingatan gajah juga
  };

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

  return {
    isOpen, toggleChat, unreadCount, messages, isTyping, inputValue, setInputValue, handleSendMessage, clearChat, handleImageSelect, selectedImage: attachment ? attachment.base64 : null, handleClearImage
  };
};