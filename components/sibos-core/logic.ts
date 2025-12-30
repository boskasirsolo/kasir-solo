
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
  
  const [isModeAdmin, setIsModeAdmin] = useState(isAdmin);
  const [authState, setAuthState] = useState<'IDLE' | 'AWAITING_EMAIL' | 'AWAITING_PASSWORD'>('IDLE');
  const [tempCreds, setTempCreds] = useState({ email: '', password: '' });

  useEffect(() => { if (isAdmin) setIsModeAdmin(true); }, [isAdmin]);
  useEffect(() => { if (!session) setIsModeAdmin(false); }, [session]);

  // --- AUTO LOGOUT ADMIN LOGIC ---
  useEffect(() => {
    let timer: any;
    
    // Only trigger auto-logout if:
    // 1. User is in Admin Mode
    // 2. AI is not currently typing
    // 3. IMPORTANT: User is NOT on the main '/admin' dashboard page. 
    //    (If they are on the dashboard, we rely on Supabase session, not this widget's timer)
    
    if (isModeAdmin && !isTyping && currentPage !== 'admin') {
        timer = setTimeout(async () => {
            if (supabase) await supabase.auth.signOut();
            setIsModeAdmin(false);
            setAuthState('IDLE');
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: "🔒 **AUTO LOGOUT**. Sesi Admin Chat berakhir karena tidak ada aktivitas.", time: 'System' }]);
            chatHistoryRef.current = [];
        }, 300000); // Increased to 5 minutes (300s) for Chat-Only mode
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

    // ... Auth Logic Omitted for Brevity (Same as before) ...
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
        config: { tools: isModeAdmin ? [{ functionDeclarations: dbTools }] : [] }
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
        const finalResult = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: chatHistoryRef.current });
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
