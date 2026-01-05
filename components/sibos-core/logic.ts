
import { useState, useEffect, useRef } from 'react';
import { Product, SiteConfig } from '../../types';
import { supabase } from '../../utils';
import { SibosAI } from '../../services/ai/sibos'; // UPDATED IMPORT

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
  
  const [isModeAdmin, setIsModeAdmin] = useState(isAdmin);
  const [authState, setAuthState] = useState<'IDLE' | 'AWAITING_EMAIL' | 'AWAITING_PASSWORD'>('IDLE');
  const [tempCreds, setTempCreds] = useState({ email: '', password: '' });

  // Gemini History Format: { role: 'user'|'model', parts: [{text: ...}] }
  const chatHistoryRef = useRef<{ role: string; parts: any[] }[]>([]);

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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');

    // ... Auth Logic (Local) ...
    if (text === '/admin') { 
        setAuthState('AWAITING_EMAIL'); 
        setMessages(p=>[...p, {id:Date.now().toString(), role:'user', text, time: 'Now'}, {id:(Date.now()+1).toString(), role:'assistant', text:'Email Admin:', time:'System'}]); 
        return; 
    }
    if (authState === 'AWAITING_EMAIL') { 
        setTempCreds(p=>({...p, email:text})); 
        setAuthState('AWAITING_PASSWORD'); 
        setMessages(p=>[...p, {id:Date.now().toString(), role:'user', text, time: 'Now'}, {id:(Date.now()+1).toString(), role:'assistant', text:'Password:', time:'System'}]); 
        return; 
    }
    if (authState === 'AWAITING_PASSWORD') { 
        setIsTyping(true);
        try {
            const { error } = await supabase!.auth.signInWithPassword({ email: tempCreds.email, password: text });
            if (error) throw error;
            setIsModeAdmin(true); setAuthState('IDLE'); 
            setMessages(p=>[...p, {id:Date.now().toString(), role:'user', text:'******', time: 'Now'}, {id:(Date.now()+1).toString(), role:'assistant', text:'Login Success. Welcome back, Founder.', time:'System'}]);
        } catch(e) { 
            setMessages(p=>[...p, {id:Date.now().toString(), role:'assistant', text:'Login Failed.', time:'System'}]); 
        }
        setIsTyping(false); 
        return; 
    }

    // --- MAIN CHAT LOGIC DELEGATED TO SIBOS AI SERVICE ---
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: text, time: 'Now' }]);
    setIsTyping(true);

    try {
      // Call the Brain
      const responseText = await SibosAI.chat(chatHistoryRef.current, text, isModeAdmin);
      
      // Update UI
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: responseText, time: 'Now' }]);
      
      // Update History for Context
      chatHistoryRef.current.push({ role: 'user', parts: [{ text }] });
      chatHistoryRef.current.push({ role: 'model', parts: [{ text: responseText }] });

    } catch (error: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: "Error: " + error.message, time: 'System' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => { setIsOpen(prev => !prev); if (!isOpen) setUnreadCount(0); };
  const clearChat = () => { setMessages([]); chatHistoryRef.current = []; };

  return { isOpen, toggleChat, unreadCount, messages, isTyping, inputValue, setInputValue, handleSendMessage, clearChat, isModeAdmin, authState };
};
