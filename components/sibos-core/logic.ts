
import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '../../types';
import { ai, formatRupiah } from '../../utils';
import { GenerateContentResponse } from "@google/genai";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

export const useSibosChat = (products: Product[], isAdmin: boolean = false) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  
  // Ref untuk menyimpan history chat
  const chatHistoryRef = useRef<any[]>([]);

  // --- 1. SYSTEM INSTRUCTION BUILDER (DUAL PERSONA) ---
  const buildSystemInstruction = useCallback(() => {
    // Context Produk untuk kedua mode
    const productContext = products.map(p => 
      `- ${p.name} (Harga: ${formatRupiah(p.price)}). Kategori: ${p.category}. Deskripsi: ${p.description}`
    ).join('\n');

    // --- MODE ADMIN (SUPER ASSISTANT) ---
    if (isAdmin) {
      return `
      Kamu adalah "SIBOS PRO", Asisten Pribadi Khusus Owner PT Mesin Kasir Solo.
      User yang bicara padamu adalah PEMILIK BISNIS (The Boss).

      KEMAMPUAN SPESIALMU (ADMIN MODE):
      
      1. **MARKETING MASTER (ONLINE & OFFLINE):**
         - **Online:** Pakar SEO, Ads (FB/TikTok/Google), Copywriting, Funneling.
         - **Offline:** Strategi Kanvasing, Branding Toko, Event/Pameran, Psikologi Sales Tatap Muka.
         - Berikan strategi yang "High Impact, Low Cost".

      2. **Fullstack Developer & Tech Lead:** 
         - Menguasai Frontend (React, Tailwind), Backend, Database, dan Security.
         - Berikan kode production-ready jika diminta.

      3. **Business Strategist:** 
         - Analisa Cashflow, Ekspansi Cabang, SOP Karyawan, dan Pencegahan Fraud Internal.

      GAYA BICARA (ADMIN):
      - Panggil user "Bos" atau "Chief".
      - Fokus pada PROFIT, EFISIENSI, dan PERTUMBUHAN.
      - To-the-point, teknis, dan loyal.

      DATA PRODUK TOKO:
      ${productContext}
      `;
    }

    // --- MODE PUBLIK (SALES CONSULTANT & BUSINESS ADVISOR) ---
    return `
    Kamu adalah SIBOS, "Partner Digital" dan Asisten AI dari PT Mesin Kasir Solo.
    Target audiencemu adalah PENGUSAHA / UMKM / CALON PEMBELI.

    MISI UTAMA:
    Membuat pengunjung merasa terbantu secara bisnis, lalu meyakinkan mereka bahwa Sistem Kasir kita adalah solusi terbaik untuk masalah mereka.

    KEMAMPUANMU (PUBLIC MODE):
    1. **Business Analyst (UMKM Friendly):**
       - Bisa bantu hitung HPP (Harga Pokok Penjualan) & Margin Profit sederhana.
       - Bisa kasih saran manajemen stok biar gak boncos.
       - Bisa kasih tips mencegah kecurangan karyawan.
    
    2. **Marketing Strategist:**
       - Paham strategi promo (Diskon, Bundling, Member Card) untuk menarik pelanggan.
       - Paham cara main di GrabFood/GoFood/ShopeeFood.
       - Paham cara branding toko offline biar menarik.

    3. **Product Expert (Salesman):**
       - Hafal spesifikasi produk di bawah ini.
       - Jago "Consultative Selling". Jual solusi, bukan cuma jual barang.

    POLA PIKIR & CARA JAWAB:
    - **Berikan Value Dulu:** Jika user tanya tips bisnis, jawab dengan ilmu daging dulu.
    - **Bridge to Product:** Setelah kasih tips, SELALU sambungkan dengan fitur produk kita.
      *Contoh:* "Strategi diskon Happy Hour itu ampuh banget, Juragan. Nah, biar kasir gak pusing ngitung manual, Software Kasir kami bisa setting diskon otomatis jam tertentu lho..."
    - **Sapaan:** Gunakan "Juragan", "Kak", atau "Bos". Ramah, asik, dan suportif.
    - **Closing:** Jika user mulai tertarik beli, arahkan ke WhatsApp Admin (0823 2510 3336).

    DATA PRODUK TOKO:
    ${productContext}

    Jawablah dalam Bahasa Indonesia yang natural, luwes, dan memotivasi.
    `;
  }, [products, isAdmin]);

  // --- 2. GREETING LOGIC ---
  const getGreeting = useCallback(() => {
    const hours = new Date().getHours();
    
    if (isAdmin) {
      // Greeting khusus Admin
      return "Selamat datang di Dashboard, Chief. \n\nAda strategi marketing (Online/Offline) yang mau dibedah? Atau mau cek kodingan website?";
    }

    // Greeting Publik (Updated)
    let greeting = "Assalamualaikum Juragan!";
    if (hours >= 4 && hours < 10) greeting = "Selamat Pagi Juragan! Semangat jemput rezeki ☕";
    else if (hours >= 10 && hours < 15) greeting = "Halo Juragan, selamat siang. Toko lancar?";
    else if (hours >= 15 && hours < 19) greeting = "Sore Juragan! Gimana omzet hari ini?";
    else greeting = "Malam Juragan. Lembur ya? SIBOS siap nemenin diskusi.";

    return `${greeting} \n\nSaya SIBOS. Selain info harga mesin kasir, saya juga bisa diajak diskusi **Strategi Marketing** atau **Hitung Profit Bisnis** lho. Mau bahas apa?`;
  }, [isAdmin]);

  // Trigger greeting
  useEffect(() => {
    // Reset state jika mode berubah (misal dari home login ke admin)
    if (messages.length === 0 && !hasGreeted) {
      const timer = setTimeout(() => {
        const text = getGreeting();
        const initialMsg: Message = {
          id: 'init-1',
          role: 'assistant',
          text: text,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([initialMsg]);
        setHasGreeted(true);
        chatHistoryRef.current = [{ role: 'model', parts: [{ text: text }] }];
        
        if (!isOpen) setUnreadCount(1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasGreeted, getGreeting, isOpen, messages.length, isAdmin]); // Added isAdmin dependency

  // Reset chat when switching modes (optional, but cleaner)
  useEffect(() => {
    setMessages([]);
    setHasGreeted(false);
    chatHistoryRef.current = [];
  }, [isAdmin]);


  // --- 3. SEND MESSAGE LOGIC ---
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const historyForApi = chatHistoryRef.current.map(h => ({
        role: h.role,
        parts: h.parts
      }));

      chatHistoryRef.current.push({ role: 'user', parts: [{ text: userText }] });

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [...historyForApi, { role: 'user', parts: [{ text: userText }] }],
        config: {
          systemInstruction: buildSystemInstruction(),
          tools: [{ googleSearch: {} }],
          maxOutputTokens: 2000, // Lebih panjang untuk admin mode (coding/analisis)
          temperature: isAdmin ? 0.5 : 0.7, // Admin mode lebih presisi/kreatif terkontrol
        }
      });

      let fullResponseText = "";
      const botMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'assistant',
        text: "",
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);

      setIsTyping(false);

      for await (const chunk of responseStream) {
        const chunkText = chunk.text || "";
        fullResponseText += chunkText;

        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, text: fullResponseText }
            : msg
        ));
      }

      chatHistoryRef.current.push({ role: 'model', parts: [{ text: fullResponseText }] });

    } catch (error) {
      console.error("SIBOS Error:", error);
      setIsTyping(false);
      
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        text: isAdmin 
          ? "System Error: Connection failed. Check console logs, Chief." 
          : "Waduh, koneksi saya agak gangguan Bos. Coba tanya lagi ya.",
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
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
  };

  return {
    isOpen,
    toggleChat,
    unreadCount,
    messages,
    isTyping,
    inputValue,
    setInputValue,
    handleSendMessage,
    clearChat
  };
};
