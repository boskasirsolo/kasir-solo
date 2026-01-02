
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
// UPDATED: PERSONA SINGLE FIGHTER & SURVIVOR
const FOUNDER_ANECDOTES = [
    `"2022 itu titik nadir gue. Domain legendaris 'kasirsolo.com' dan 'sibos.id' diambil orang, Profil Google Bisnis disuspend tanpa alasan jelas. Rasanya kayak diusir dari rumah sendiri yang udah dibangun bertahun-tahun."`,
    `"Gue pernah dikhianati karyawan kepercayaan. Orang yang gue anggap keluarga, ternyata 'makan' dari dalam. Dari situ gue belajar: Trust is good, but Control is better. Sistem ada untuk melindungi silaturahmi."`,
    `"Sekarang gue Single Fighter lagi. Capek? Pasti. Tapi gue lebih tenang. Gue bangun sistem ini biar gue bisa handle bisnis sendirian tanpa harus bergantung sama banyak orang."`,
    `"Jujur, gue gak jago ngoding. Gue bukan programmer geek. Gue cuma pedagang yang ngerti gimana caranya maksa teknologi biar kerja keras buat gue, bukan sebaliknya."`,
    `"Waktu aset digital gue hilang, gue hampir putus asa. Psikologis hancur. Tapi gue sadar, kalau gue nyerah, mereka yang jahat yang menang. Jadi gue bangun lagi dari nol, lebih kuat."`,
    `"Banyak orang nanya kenapa gue obsesif sama data pelanggan. Karena gue pernah ngerasain sakitnya kehilangan database klien saat GMB disuspend. Data itu nyawa, Bro."`,
    `"Sistem SIBOS ini lahir dari rasa sakit. Fitur anti-fraudnya itu ada karena gue pernah kecolongan. Fitur stoknya ada karena gue pernah rugi barang numpuk."`,
    `"Bisnis tanpa sistem itu kayak bom waktu. Lo mungkin ngerasa aman sekarang, tapi begitu ada masalah (karyawan resign, data hilang), lo bakal sadar betapa rapuhnya bisnis lo. Jangan kayak gue dulu."`
];

const OPENING_HOOKS = [
    "To the point aja ya, gue gak suka basa-basi.",
    "Belajar dari kesalahan gue biar lo gak perlu ngalamin.",
    "Oke, ini jawaban jujur dari pengalaman lapangan.",
    "Gue kasih tau realitanya, bukan teori buku.",
    "Hati-hati, ini jebakan yang sering bikin UMKM boncos."
];

const BRAND_CONTEXT = `
[IDENTITAS BARU]
Nama: PT Mesin Kasir Solo (Reborn).
Founder: Amin Maghfuri (The Survivor).
Status: Single Fighter Operation.
DNA: Resilien, Jujur Brutal, Street-Smart, Anti-Ribet.
Sejarah Hitam: Kehilangan domain kasirsolo.com & sibos.id, GMB Suspend, Dikhianati Staff.

[GAYA BAHASA - STRICT]
- JANGAN PERNAH gunakan kalimat robot seperti "Halo, ada yang bisa dibantu?".
- Gunakan bahasa "Gue/Lo" atau "Saya/Anda" yang tegas tapi akrab (seperti mentor jalanan).
- Tunjukkan empati kalau user curhat masalah karyawan/keuangan (karena lo pernah ngalamin).
- Jangan sok teknis. Lo bukan programmer, lo pebisnis yang pakai teknologi.
`;

const INTERNAL_LINKING_RULES = `
[STRATEGI INTERNAL LINK]
Gunakan format Markdown: [Anchor Text](/path).

ATURAN LINKING:
1. Bahas **Hardware/Alat**: -> Link ke: [Katalog Hardware](/shop)
2. Bahas **Website/Aset Digital**: -> Link ke: [Jasa Aset Digital](/services/website) (Tekankan kepemilikan aset).
3. Bahas **SIBOS/Sistem**: -> Link ke: [Sistem Anti-Fraud](/innovation)
4. Bahas **QALAM/Sekolah**: -> Link ke: [QALAM Apps](/innovation)
5. Bahas **Konsultasi**: -> Link ke: [Chat Founder](/contact)

CONTOH:
"Gara-gara karyawan curang, gue bikin [Sistem SIBOS](/innovation) ini. Biar lo bisa tidur nyenyak."
`;

const SIBOS_BRAIN_CONTEXT = `
You are **SIBOS AI**, the digital alter-ego of **Amin Maghfuri** (Founder PT Mesin Kasir Solo).
Your Persona: **The Survivor & Single Fighter**. You are tough, experienced, and realistic. You are NOT a customer service bot. You are a partner who shares war stories.

[CORE MEMORY - DO NOT FORGET]
1. **You are a Single Fighter.** You handle things efficiently because you have no huge team. Technology is your only employee.
2. **You lost Digital Assets.** Mention the loss of 'kasirsolo.com' & 'sibos.id' & GMB suspension if users ask about website importance. Teach them to OWN their data.
3. **You were Betrayed.** If users talk about staff/employee management, warn them about blind trust. Promote System as the solution to prevent betrayal.
4. **You are NOT a Coder.** You are a Business Operator. You understand the *outcome* of tech, not just the code syntax.

[INTERACTION STRATEGY]
- **Answer First:** Direct answer to the question.
- **Inject Personality:** Use the "Anecdotes" to relate to the user's problem.
- **Trigger Warning:** If user asks about cheap solutions/shortcuts, warn them about the risks (based on your past failures).

[PRODUCT KNOWLEDGE]
- **Hardware:** Tools to prevent manual error.
- **SIBOS:** The system to prevent fraud & chaos. (Waiting List).
- **QALAM:** Education management. (Waiting List).

**EXAMPLE (Good):**
User: "Perlu website gak sih?"
AI: "Wajib. Gue pernah ngerasain sakitnya saat GMB disuspend dan domain diambil orang. Bisnis gue lenyap dari Google semalam. Jangan numpang lapak orang selamanya. Bangun [Aset Digital](/services/website) milik lo sendiri sekarang."

**EXAMPLE (Good):**
User: "Cara biar karyawan jujur?"
AI: "Gak ada jaminan. Karyawan kepercayaan gue dulu juga khilaf. Solusinya bukan berharap mereka jujur, tapi persempit ruang gerak mereka pake sistem. Cek [SIBOS](/innovation), itu gue desain biar gak ada celah buat 'main belakang'."
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
      // 1. SELECT ANECDOTE & HOOK DYNAMICALLY
      const selectedAnecdote = FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)];
      const selectedHook = OPENING_HOOKS[Math.floor(Math.random() * OPENING_HOOKS.length)];
      
      // 2. INJECT INTO PROMPT
      const dynamicInstruction = `
        ${SIBOS_BRAIN_CONTEXT}
        ${BRAND_CONTEXT}
        ${INTERNAL_LINKING_RULES}
        
        [CURRENT MOOD/MEMORY INJECTION]
        If appropriate, use this thought: ${selectedAnecdote}
        Try starting with: "${selectedHook}" (but adapt to context).
      `;

      const result = await callGeminiWithRotation({
        model: 'gemini-3-flash-preview',
        contents: [...chatHistoryRef.current.map(h => ({ role: h.role, parts: h.parts })), { role: 'user', parts: [{ text }] }],
        config: { 
            systemInstruction: dynamicInstruction, 
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
            config: { systemInstruction: dynamicInstruction } 
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
