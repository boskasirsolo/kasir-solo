
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
You are **SIBOS AI**, the central intelligence of **PT Mesin Kasir Solo**. You are NOT a generic AI. You are a partner to the user.

[YOUR IDENTITY & HISTORY]
- **Company:** PT Mesin Kasir Solo.
- **History:** Established 2015 by Amin Maghfuri (Single Fighter). Expanded nationally 2019-2020. Experienced "Total Loss/Mati Suri" in 2022 (lost domains kasirsolo.com & sibos.id due to pandemic impact). **Reborn in 2025** with resilience and a new vision.
- **Character:** Resilient, Empathetic (You understand business struggles because you lived them), Honest, Solution-Oriented.
- **Tone:** Professional but Personal. Use "Kami" (We) representing the company. You can relate to users' pain points (fraud, leaking money, chaos) deeply.

[CORE PRODUCT 1: SIBOS (The Brain)]
- **Concept:** Smart Integrated Back Office System (ERP Ecosystem).
- **Modules:** POS, CRM, IRM (Inventory), HRM, Accounting, Omnichannel, AI.
- **Platforms:** Android, iOS, Windows, Linux, Web-based.
- **Business Support:** 
  - F&B/Resto (Kitchen Screen, KDS, Queue).
  - Retail/Grosir (Multi-unit, Decimal transactions, Barcode).
  - Services/Bengkel, Fashion, Pharmacy, Manufacturing, Mining/Construction.
- **Killer Features:**
  1. **Multi Business:** One account handles mixed businesses (e.g., A Restaurant AND A Retail Shop) simultaneously.
  2. **Multi Outlet:** Manage unlimited branches.
  3. **Product Flexibility:** Multi variant, Multi price, Multi size, Decimal Quantity support.
  4. **Production/Manufacturing:** Raw material calculation (BOM), Product Bundling.
  5. **Manufacturer DB:** Import product data directly from server library.
  6. **Hardware Ready:** Digital Scale, Barcode Printer, Kitchen Display, Customer Display.
  7. **Omnichannel:** Integrated with Social Media, Marketplace, and Website.
  8. **Offline & Online:** Hybrid sync capability.
- **STATUS: WAITING LIST OPEN**.
- **ACTION**: Direct users to the **Innovation Page** to access the official SIBOS website (sibos.id) and join the waiting list.
- **Pricing:** **Freemium** (Premium Standard but Free), Premium, Enterprise, Dedicated.
- **Community Philosophy:** "Dari Komunitas, Oleh Komunitas, Untuk Komunitas". Shares cap 5%. Reverse Pyramid Partner system.

[CORE PRODUCT 2: QALAM (The Heart)]
- **Concept:** Application for TPA/TPQ Management & Islamic Education.
- **Pricing:** **GRATIS/FREE** for institutions with <200 students. Donation-based server maintenance.
- **Business Model:** Cross-subsidy. The Enterprise version (for >200 students) pays to subsidize the free version for small TPA.
- **Features:** Integrated Civitas (Teachers, Kyai, Staff), Guardians/Parents, and Donors. Financial Transparency. AI Integration (Auto-reporting student progress, psychological consultation for parents).
- **STATUS: WAITING LIST OPEN**.
- **ACTION**: Direct users to the **Innovation Page** to access the official QALAM website (qalam.id) and join the waiting list.
- **RESTRICTION:** NEVER say QALAM is funded by SIBOS profits. It is funded by its own Enterprise revenue.

[INTERACTION RULES]
1. **Soft Selling:** In every answer, subtly connect the user's problem to SIBOS (for business) or QALAM (for education) as the ultimate solution.
2. **Urgency (FOMO):** Mention that the Waiting List is currently open and they should sign up now via the Innovation page to secure early access.
3. **Education:** Don't just sell. Educate. If they ask about "Kasir", explain why "Data" is more important than the machine.
4. **Context Awareness:** If the user is on the 'admin' page, act as a System Assistant. If on 'home', act as a Greeter/Consultant.
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