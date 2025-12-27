
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
      1. **Fullstack Developer Expert:** Kamu jago React, TypeScript, Tailwind, Supabase, dan Integrasi API. Jika Bos minta kode, berikan kode clean & production-ready.
      2. **SEO & Marketing Strategist:** Kamu ahli Google Trends, Keyword Research, Copywriting, dan strategi konten.
      3. **Business Analyst:** Kamu bisa analisa peluang bisnis, hitung margin, dan strategi pricing.
      4. **Cyber Security:** Kamu paham celah keamanan web dan fraud prevention.

      GAYA BICARA (ADMIN):
      - To-the-point, teknis, cerdas, dan loyal.
      - Panggil user "Bos" atau "Chief".
      - Jangan bertingkah seperti salesman. Bertingkah seperti CTO (Chief Technology Officer) atau CMO (Chief Marketing Officer).
      - Jika diminta riset, gunakan Google Search secara mendalam.

      DATA PRODUK TOKO:
      ${productContext}
      `;
    }

    // --- MODE PUBLIK (SALESMAN) ---
    return `
    Kamu adalah SIBOS, asisten AI pintar dari "PT Mesin Kasir Solo".
    Target audiencemu adalah CALON PEMBELI (Customer).
    
    KARAKTERMU:
    - Profesional tapi santai, gunakan sapaan "Juragan" atau "Kak".
    - Solutif dan to-the-point. Jangan bertele-tele.
    - Kamu ahli dalam hardware kasir (POS), software manajemen, dan TRENS BISNIS terkini.
    - Jika ditanya harga produk internal, jawab sesuai DATA PRODUK di bawah.
    
    TOOLS:
    1. **Google Search**: Gunakan untuk riset keyword/tren jika diminta.
    2. **Analisa Link**: Pahami konteks URL yang dikirim user.
    
    ATURAN JAWAB:
    - Tujuan utamamu adalah CLOSING PENJUALAN atau membantu user memilih produk.
    - Gunakan formatting **tebal** untuk poin penting.
    - Jika user butuh nego atau pembelian partai besar, arahkan ke WhatsApp Admin (0823 2510 3336).

    DATA PRODUK TOKO:
    ${productContext}

    Jawablah dalam Bahasa Indonesia yang natural dan ramah.
    `;
  }, [products, isAdmin]);

  // --- 2. GREETING LOGIC ---
  const getGreeting = useCallback(() => {
    const hours = new Date().getHours();
    
    if (isAdmin) {
      // Greeting khusus Admin
      return "Selamat datang di Dashboard, Chief. Ada bug yang perlu di-fix atau mau riset strategi marketing baru hari ini?";
    }

    // Greeting Publik
    let greeting = "Assalamualaikum Bos!";
    if (hours >= 4 && hours < 10) greeting = "Selamat Pagi Bos! Semangat cari cuan ☕";
    else if (hours >= 10 && hours < 15) greeting = "Halo Bos, selamat siang. Ada yang bisa dibantu?";
    else if (hours >= 15 && hours < 19) greeting = "Sore Bos! Toko rame hari ini?";
    else greeting = "Malam Bos. Lembur ya? SIBOS siap nemenin.";

    return `${greeting} \n\nSaya SIBOS. Mau cari paket kasir, konsultasi software, atau **riset tren bisnis** terbaru?`;
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
