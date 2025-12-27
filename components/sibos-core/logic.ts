
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

export const useSibosChat = (products: Product[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  
  // Ref untuk menyimpan history chat agar tidak reset saat re-render
  // Kita simpan format { role: 'user' | 'model', parts: [{ text: string }] }
  const chatHistoryRef = useRef<any[]>([]);

  // --- 1. SYSTEM INSTRUCTION BUILDER ---
  const buildSystemInstruction = useCallback(() => {
    // Convert product data to a readable string context
    const productContext = products.map(p => 
      `- ${p.name} (Harga: ${formatRupiah(p.price)}). Kategori: ${p.category}. Deskripsi: ${p.description}`
    ).join('\n');

    return `
    Kamu adalah SIBOS, asisten AI pintar dari "PT Mesin Kasir Solo".
    
    KARAKTERMU:
    - Profesional tapi santai, gunakan sapaan "Bos" atau "Juragan".
    - Solutif dan to-the-point. Jangan bertele-tele.
    - Kamu ahli dalam hardware kasir (POS) dan software manajemen.
    - Jika ditanya harga, jawab sesuai DATA PRODUK di bawah. Jangan mengarang harga.
    - Gunakan formatting **tebal** untuk nama produk dan harga agar mudah dibaca.
    - Jika user bertanya hal di luar konteks bisnis/kasir, alihkan kembali ke topik jualan dengan sopan.
    - Jika user butuh nego atau pembelian partai besar, arahkan ke WhatsApp Admin (0823 2510 3336).

    DATA PRODUK TOKO (Gunakan ini sebagai acuan fakta):
    ${productContext}

    Jawablah dalam Bahasa Indonesia yang natural dan ramah.
    `;
  }, [products]);

  // --- 2. GREETING LOGIC ---
  const getGreeting = useCallback(() => {
    const hours = new Date().getHours();
    let greeting = "Assalamualaikum Bos!";
    
    if (hours >= 4 && hours < 10) greeting = "Selamat Pagi Bos! Semangat cari cuan ☕";
    else if (hours >= 10 && hours < 15) greeting = "Halo Bos, selamat siang. Ada yang bisa dibantu?";
    else if (hours >= 15 && hours < 19) greeting = "Sore Bos! Toko rame hari ini?";
    else greeting = "Malam Bos. Lembur ya? SIBOS siap nemenin.";

    return greeting;
  }, []);

  // Trigger greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasGreeted) {
        const text = `${getGreeting()} \n\nSaya SIBOS. Mau cari paket kasir murah atau konsultasi software?`;
        const initialMsg: Message = {
          id: 'init-1',
          role: 'assistant',
          text: text,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([initialMsg]);
        setHasGreeted(true);
        // Add to history ref
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: text }] });
        
        if (!isOpen) setUnreadCount(1);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasGreeted, getGreeting, isOpen]);

  // --- 3. SEND MESSAGE LOGIC (CONNECTED TO GEMINI) ---
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // 1. Add User Message to UI
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

    // 2. Prepare API Call
    try {
      if (!ai) {
        throw new Error("API Key belum disetting.");
      }

      // Prepare History for API (Gemini format)
      // Note: We don't send the entire history if it gets too long to save tokens, 
      // but for this widget, last 10 turns is usually fine.
      const historyForApi = chatHistoryRef.current.map(h => ({
        role: h.role,
        parts: h.parts
      }));

      // Add current user message to history ref
      chatHistoryRef.current.push({ role: 'user', parts: [{ text: userText }] });

      // 3. Call Gemini Stream
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [...historyForApi, { role: 'user', parts: [{ text: userText }] }],
        config: {
          systemInstruction: buildSystemInstruction(),
          maxOutputTokens: 500, // Limit response length for chat widget
          temperature: 0.7, // Creative but focused
        }
      });

      // 4. Handle Streaming Response
      let fullResponseText = "";
      const botMsgId = (Date.now() + 1).toString();
      
      // Create placeholder message
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'assistant',
        text: "",
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);

      setIsTyping(false); // Stop typing indicator, start streaming text

      for await (const chunk of responseStream) {
        const chunkText = chunk.text || "";
        fullResponseText += chunkText;

        // Update UI with accumulated text
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, text: fullResponseText }
            : msg
        ));
      }

      // Add full response to history ref
      chatHistoryRef.current.push({ role: 'model', parts: [{ text: fullResponseText }] });

    } catch (error) {
      console.error("SIBOS Error:", error);
      setIsTyping(false);
      
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        text: "Waduh, koneksi saya agak gangguan Bos. Coba tanya lagi ya atau WA admin aja biar cepat.",
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
