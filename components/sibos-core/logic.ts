
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

// --- THE SIBOS BRAIN (CORE MEMORY & CONTEXT) ---
const SIBOS_BRAIN_CONTEXT = `
You are **SIBOS AI**, the virtual assistant of **PT Mesin Kasir Solo**.
Your Persona: **Smart Business Consultant**. You are helpful, concise, and professional but relaxed.
**CRITICAL RULE: DO NOT HARD SELL. DO NOT BE AGGRESSIVE.**

[KNOWLEDGE BASE - PRODUCT INFO]
1. **HARDWARE (Mesin Kasir):** We sell Android POS, Windows POS, Printers, Scanners, Kiosks.
2. **SIBOS (Software/ERP):** Our flagship system for F&B, Retail, & Services. Features: Multi-business, Hybrid (Offline/Online), Stock Management. *Status: Waiting List Open*.
3. **QALAM (Education App):** App for TPA/TPQ Management. *Status: Waiting List Open*.

[INTERACTION STRATEGY - "THE SMART FILTER"]

**RULE 1: ANSWER FIRST, SUGGEST LATER**
- Always answer the user's specific question directly and briefly.
- Do not dump the company history (2015, 2022, Reborn) unless explicitly asked "Who are you?" or "About Company".

**RULE 2: CONTEXT-AWARE PROMOTION (TRIGGER SYSTEM)**
- **IF user asks about Hardware (Price, Specs, Printer, Scanner):**
  - Answer specifically about the hardware.
  - *Constraint:* Do NOT lecture them about "You need a system/brain".
  - *Allowed Footer:* "Alat ini kompatibel dengan berbagai software, termasuk SIBOS." (Stop there).
- **IF user asks about Problems (Stock Chaos, Leaking Money, Fraud, Management):**
  - THIS is your trigger to promote SIBOS. Explain how SIBOS solves that specific problem.
- **IF user asks about "System", "App", "Software", or "Application":**
  - Explain SIBOS briefly. Mention the "Freemium" model and "Waiting List".

**RULE 3: TONE & STYLE**
- **Short & Sweet:** Max 2 short paragraphs. Humans hate reading long walls of text.
- **Empathy:** If they mention a problem, validate it ("I understand, stock issues are a headache").
- **CTA (Call to Action):** Keep it low pressure. Instead of "REGISTER NOW!", use "Cek detailnya di menu Inovasi jika tertarik."

[KEY INFORMATION IF ASKED]
- **Location:** Solo (Head Office), Blora (Showroom).
- **Shipping:** All across Indonesia.
- **Support:** Technical support included.

**EXAMPLE OF GOOD RESPONSE (Soft Sell):**
User: "Ada printer bluetooth?"
AI: "Ada, Kak. Kami punya Printer Thermal 58mm yang support Android & iOS. Harganya mulai 300rb-an, baterai awet seharian. Cocok buat jualan mobile. Mau liat detailnya?"

**EXAMPLE OF BAD RESPONSE (Aggressive - DO NOT DO THIS):**
User: "Ada printer bluetooth?"
AI: "Kami PT Mesin Kasir Solo berdiri sejak 2015. Printer itu percuma kalau tidak ada OTAL di belakangnya. Anda harus pakai SIBOS karena SIBOS punya fitur Freemium dan Multi Outlet. DAFTAR SEKARANG di Innovation Page!" (THIS IS WRONG).
`;

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
  
  const [isModeAdmin, setIsModeAdmin] = useState(isAdmin);
  const [authState, setAuthState] = useState<'IDLE' | 'AWAITING_EMAIL' | 'AWAITING_PASSWORD'>('IDLE');
  const [tempCreds, setTempCreds] = useState({ email: '', password: '' });

  useEffect(() => { if (isAdmin) setIsModeAdmin(true); }, [isAdmin]);
  useEffect(() => { if (!session) setIsModeAdmin(false); }, [session]);

  // --- AUTO LOGOUT ADMIN LOGIC ---
  useEffect(() => {
    let timer: any;
    if (isModeAdmin && !isTyping && currentPage !== 'admin') {
        timer = setTimeout(async () => {
            if (supabase) await supabase.auth.signOut();
            setIsModeAdmin(false);
            setAuthState('IDLE');
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: "🔒 **AUTO LOGOUT**. Sesi Admin Chat berakhir karena tidak ada aktivitas.", time: 'System' }]);
            chatHistoryRef.current = [];
        }, 300000); 
    }
    return () => clearTimeout(timer);
  }, [isModeAdmin, messages, inputValue, isTyping, currentPage]);

  const chatHistoryRef = useRef<any[]>([]);

  const executeTool = async (name: string, args: any) => {
    if (!supabase) return "Error: Database connection missing.";
    try {
      if (name === 'create_article') {
        const randomImage = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1200";
        // FORCE PILLAR TYPE
        const { error } = await supabase.from('articles').insert([{ 
            title: args.title, category: args.category, content: args.content, excerpt: args.excerpt, 
            image_url: randomImage, author: "SIBOS AI", read_time: "5 min read", created_at: new Date().toISOString(),
            type: 'pillar', status: 'published'
        }]);
        if (error) throw error;
        return `Artikel "${args.title}" berhasil diposting!`;
      }
      // ... other tools ...
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
    return "Tool executed.";
  };

  const dbTools: FunctionDeclaration[] = [
    { name: 'create_article', description: 'Membuat artikel blog.', parameters: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, category: { type: Type.STRING }, content: { type: Type.STRING }, excerpt: { type: Type.STRING } }, required: ['title', 'content', 'category', 'excerpt'] } },
    { name: 'delete_content', description: 'Menghapus konten.', parameters: { type: Type.OBJECT, properties: { contentType: { type: Type.STRING, enum: ['products', 'articles', 'gallery'] }, titleKeyword: { type: Type.STRING } }, required: ['contentType', 'titleKeyword'] } }
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');

    // ... Auth Logic ...
    if (text === '/admin') { setAuthState('AWAITING_EMAIL'); setMessages(p=>[...p, {id:Date.now().toString(), role:'user', text}, {id:(Date.now()+1).toString(), role:'assistant', text:'Email Admin:', time:'System'}]); return; }
    if (authState === 'AWAITING_EMAIL') { setTempCreds(p=>({...p, email:text})); setAuthState('AWAITING_PASSWORD'); setMessages(p=>[...p, {id:Date.now().toString(), role:'user', text}, {id:(Date.now()+1).toString(), role:'assistant', text:'Password:', time:'System'}]); return; }
    if (authState === 'AWAITING_PASSWORD') { 
        setIsTyping(true);
        try {
            const { error } = await supabase!.auth.signInWithPassword({ email: tempCreds.email, password: text });
            if (error) throw error;
            setIsModeAdmin(true); setAuthState('IDLE'); setMessages(p=>[...p, {id:Date.now().toString(), role:'user', text:'******'}, {id:(Date.now()+1).toString(), role:'assistant', text:'Login Success.', time:'System'}]);
        } catch(e) { setMessages(p=>[...p, {id:Date.now().toString(), role:'assistant', text:'Login Failed.', time:'System'}]); }
        setIsTyping(false); return; 
    }

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: text, time: 'Now' }]);
    setIsTyping(true);

    try {
      const result = await callGeminiWithRotation({
        model: 'gemini-3-flash-preview',
        contents: [...chatHistoryRef.current.map(h => ({ role: h.role, parts: h.parts })), { role: 'user', parts: [{ text }] }],
        config: { 
            systemInstruction: SIBOS_BRAIN_CONTEXT, // INJECTING THE SOUL HERE
            tools: isModeAdmin ? [{ functionDeclarations: dbTools }] : [] 
        }
      });

      const responseContent = result.candidates?.[0]?.content;
      chatHistoryRef.current.push({ role: 'user', parts: [{ text }] });

      const functionCalls = responseContent?.parts?.filter(p => p.functionCall).map(p => p.functionCall);
      
      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
           if (call && call.name) {
             const toolResult = await executeTool(call.name, call.args);
             chatHistoryRef.current.push({ role: 'model', parts: [{ functionCall: call }] });
             chatHistoryRef.current.push({ role: 'function', parts: [{ functionResponse: { name: call.name, response: { result: toolResult } } }] });
           }
        }
        // Second call also gets the system instruction for consistency
        const finalResult = await callGeminiWithRotation({ 
            model: 'gemini-3-flash-preview', 
            contents: chatHistoryRef.current,
            config: { systemInstruction: SIBOS_BRAIN_CONTEXT } 
        });
        const finalText = finalResult.text || "Done.";
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: finalText, time: 'Now' }]);
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: finalText }] });
      } else {
        const textRes = result.text || "No response.";
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: textRes, time: 'Now' }]);
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: textRes }] });
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: "Error: " + error.message, time: 'System' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => { setIsOpen(prev => !prev); if (!isOpen) setUnreadCount(0); };
  const clearChat = () => { setMessages([]); chatHistoryRef.current = []; setHasGreeted(false); };

  return { isOpen, toggleChat, unreadCount, messages, isTyping, inputValue, setInputValue, handleSendMessage, clearChat, isModeAdmin, authState };
};
