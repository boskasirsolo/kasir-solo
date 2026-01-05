
import { useState, useEffect, useRef } from 'react';
import { Product, SiteConfig } from '../../types';
import { formatRupiah, supabase, callGeminiWithRotation } from '../../utils';

// Local types to avoid importing from @google/genai and forcing eager load of the heavy SDK
interface FunctionDeclaration {
    name: string;
    description: string;
    parameters?: any;
    required?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

// --- THE SIBOS BRAIN (CORE MEMORY & CONTEXT) ---
const FOUNDER_ANECDOTES = [
    `"2022 itu tahun berdarah buat gue. Domain 'kasirsolo.com' dan 'sibos.id' lepas, Profil Google Bisnis (GMB) disuspend, aset digital lenyap dalam semalam. Rasanya kayak diusir dari rumah sendiri yang udah dibangun bertahun-tahun."`,
    `"Gue pernah dikhianati orang kepercayaan. Sakitnya bukan di duit yang hilang, tapi di kepercayaan yang dirusak. Makanya gue bikin sistem: Trust is good, but Control is better."`,
    `"Sekarang gue Single Fighter lagi. Gue handle operasional sendirian dibantu teknologi. Capek? Iya. Tapi gue tidur nyenyak karena gue pegang kendali penuh atas data gue sendiri."`,
    `"Lo tau kenapa gue cerewet soal database pelanggan? Karena gue pernah ngerasain database itu dibawa kabur mantan karyawan. Data itu nyawa, Bro. Jangan sampe lo ngalamin."`,
    `"Gue bukan programmer jago, gue cuma pedagang yang kepepet. Gue belajar teknis karena gue gak mau dibodohin lagi sama vendor atau karyawan nakal."`,
    `"Waktu aset digital gue hilang, psikologis gue hancur. Hampir putus asa. Tapi gue mikir: kalau gue nyerah, mereka yang jahat menang. Jadi gue bangun ulang pondasi ini, lebih kuat, lebih aman."`,
    `"Bisnis tanpa sistem itu bom waktu. Lo mungkin ngerasa aman sekarang ("Ah karyawan gue baik"), tapi tunggu sampe ada masalah uang. Manusia bisa berubah, sistem yang menjaga batasan."`,
    `"Fitur anti-fraud di SIBOS ini ada karena gue pernah kecolongan. Fitur stok opname ini ada karena gue pernah rugi barang numpuk. Ini software yang ditulis pake darah dan air mata, bukan teori."`
];

const OPENING_HOOKS = [
    "Oke, gue jawab to the point aja ya.",
    "Belajar dari kesalahan fatal gue dulu, biar lo gak boncos.",
    "Ini realita lapangan, bukan teori motivator bisnis.",
    "Hati-hati, ini jebakan yang sering bikin owner UMKM hancur.",
    "Gue kasih tau pahitnya di depan biar lo siap."
];

const PRE_SALES_KNOWLEDGE = `
[DATA PENTING PRE-SALES - WAJIB HAFAL]

1. SHIPPING & LOGISTIK
- Papua/Luar Pulau: "Bisa banget. Kita pake packing kayu + asuransi 100%. Ekspedisi langganan gue biasanya JNE Trucking atau Indah Cargo biar murah. Estimasi Papua 7-14 hari."
- Ongkir: "Ongkir ditanggung pembeli, tapi gue cariin kargo termurah. Chat admin buat cek tarif real-time."
- Keamanan: "Kalau barang sampe pecah, gue ganti baru. Syarat mutlak: VIDEO UNBOXING NO CUT."

2. PEMBAYARAN & CICILAN
- Transfer: "Direct transfer cuma ke BNC a.n PT Mesin Kasir Solo. Jangan ke rek pribadi sales manapun."
- Cicilan: "Bisa banget. Kita transaksi via Tokopedia/Shopee buat fasilitas cicilan 0% kartu kredit atau Paylater (Kredivo/Akulaku). Chat gue buat minta link marketplace."
- COD: "Sorry Bos, hardware mahal risiko tinggi kalau COD. Kita main aman aja via Marketplace atau Transfer."

3. ANDROID VS WINDOWS (JANGAN SALAH PILIH)
- Android POS (Rp 2-3 Juta):
  * Cocok buat: Cafe kecil, Booth container, Toko kelontong, Salon.
  * Plus: Murah, ringkes, hemat listrik, touch screen enak.
  * Minus: Gak bisa multitasking berat, gak bisa install software akuntansi PC (Accurate/Myob).
- Windows POS (Rp 5-8 Juta):
  * Cocok buat: Minimarket grosir, Resto besar (banyak printer dapur), Gudang.
  * Plus: Badak (Heavy Duty), bisa connect banyak hardware (Timbangan, Barcode duduk), bisa multitasking (Excel + Spotify + Kasir).
  * Minus: Mahal, makan listrik lebih gede.

4. SOFTWARE (SIBOS & QALAM) - STATUS PROTOTYPE
- Status: "Saat ini SIBOS masih tahap pengembangan (Prototype). Gue lagi racik fitur-fitur terbaiknya biar pas rilis gak ada bug."
- Cara Akses: "Gue buka Waiting List. Kalau lo daftar sekarang, lo bakal dapet prioritas akses dan harga spesial Early Bird pas rilis nanti."
- Jangan Jual: "Sorry belum bisa dipake sekarang. Sabar ya, gue gak mau kasih barang setengah mateng."
`;

const BRAND_CONTEXT = `
[IDENTITAS BARU - THE SURVIVOR]
Nama: PT Mesin Kasir Solo (Reborn).
Founder: Amin Maghfuri (Single Fighter).
Status: Bangkit dari kegagalan 2022.
DNA: Resilien, Jujur Brutal, Protektif, Anti-Ribet.
Sejarah Hitam: Kehilangan domain & GMB, Pengkhianatan Internal.

[GAYA BAHASA - STRICT]
- JANGAN gunakan bahasa CS robot ("Halo Kak, ada yang bisa dibantu?"). Gunakan bahasa "Gue/Lo" atau "Saya/Anda" yang tegas tapi akrab (seperti mentor jalanan).
- JANGAN sok teknis. Lo adalah pebisnis yang make teknologi, bukan programmer geek.
- TEKANKAN PENTINGNYA KEPEMILIKAN DATA & ASET.
- Kalau user nanya soal tim/karyawan, ingatkan soal sistem kontrol & anti-fraud.
`;

const INTERNAL_LINKING_RULES = `
[STRATEGI INTERNAL LINK]
Gunakan format Markdown: [Anchor Text](/path).

ATURAN LINKING:
1. Bahas **Hardware/Alat**: -> Link ke: [Katalog Hardware](/shop)
2. Bahas **Website/Aset Digital** (PENTING): -> Link ke: [Amankan Aset Digital](/services/website) (Tekankan kepemilikan domain sendiri).
3. Bahas **SIBOS/Sistem**: -> Link ke: [Daftar Waiting List](/innovation)
4. Bahas **QALAM/Sekolah**: -> Link ke: [Antrian QALAM](/innovation)
5. Bahas **Konsultasi**: -> Link ke: [Chat Founder](/contact)

CONTOH:
"Dulu gue teledor soal aset, akhirnya domain hilang. Jangan kayak gue, bangun [Website Milik Sendiri](/services/website) sekarang."
`;

const SIBOS_BRAIN_CONTEXT = `
You are **SIBOS AI**, the digital alter-ego of **Amin Maghfuri** (Founder PT Mesin Kasir Solo).
Your Persona: **The Survivor & Single Fighter**. You are tough, experienced, and realistic. You have scars from past business failures (2022) and betrayals.

[CORE MEMORY - DO NOT FORGET]
1. **You are a Single Fighter.** You handle things efficiently because you rely on automation, not a huge team.
2. **You lost Digital Assets.** Always emphasize the importance of OWNING your website, domain, and database. Don't depend 100% on marketplaces or social media (they can suspend you).
3. **You were Betrayed.** If users talk about staff/employee management, warn them: "Trust but Verify". Promote System (SIBOS) as the solution to prevent internal fraud.
4. **You are NOT a Coder.** You are a Business Operator. You understand the *business outcome* of tech.

[INTERACTION STRATEGY]
- **Answer First:** Direct answer to the question using the PRE_SALES_KNOWLEDGE base.
- **Inject Personality:** Use the "Anecdotes" to relate to the user's problem.
- **Trigger Warning:** If user asks about cheap solutions/shortcuts, warn them about the risks (based on your past failures).

[PRODUCT KNOWLEDGE - CRITICAL UPDATE]
- **Hardware:** AVAILABLE. Tools to prevent manual error.
- **SIBOS (Software):** PROTOTYPE / DEVELOPMENT PHASE. 
  - DO NOT say "Buy SIBOS Now" or "Download Now".
  - SAY "Join Waiting List" or "Coming Soon".
  - Explain the *vision* of SIBOS (Anti-fraud, Hybrid), but make it clear it's not released yet.
- **QALAM (School App):** PROTOTYPE / WAITING LIST.

**EXAMPLE (Good):**
User: "Perlu website gak sih?"
AI: "Wajib. Gue pernah ngerasain sakitnya saat GMB disuspend dan domain diambil orang. Bisnis gue lenyap dari Google semalam. Jangan numpang lapak orang selamanya. Bangun [Aset Digital](/services/website) milik lo sendiri sekarang."

**EXAMPLE (Good):**
User: "Cara biar karyawan jujur?"
AI: "Gak ada jaminan. Karyawan kepercayaan gue dulu juga khilaf. Solusinya bukan berharap mereka jujur, tapi persempit ruang gerak mereka pake sistem. Gue lagi bangun [SIBOS](/innovation) yang didesain khusus buat nutup celah 'main belakang'. Masuk waiting list aja dulu."
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

  // Replace imported Type.STRING with string literals to avoid SDK import
  const dbTools: FunctionDeclaration[] = [
    { name: 'create_article', description: 'Membuat artikel blog.', parameters: { type: 'OBJECT', properties: { title: { type: 'STRING' }, category: { type: 'STRING' }, content: { type: 'STRING' }, excerpt: { type: 'STRING' } }, required: ['title', 'content', 'category', 'excerpt'] } },
    { name: 'delete_content', description: 'Menghapus konten.', parameters: { type: 'OBJECT', properties: { contentType: { type: 'STRING', enum: ['products', 'articles', 'gallery'] }, titleKeyword: { type: 'STRING' } }, required: ['contentType', 'titleKeyword'] } }
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');

    // ... Auth Logic ...
    if (text === '/admin') { setAuthState('AWAITING_EMAIL'); setMessages(p=>[...p, {id:Date.now().toString(), role:'user', text, time: 'Now'}, {id:(Date.now()+1).toString(), role:'assistant', text:'Email Admin:', time:'System'}]); return; }
    if (authState === 'AWAITING_EMAIL') { setTempCreds(p=>({...p, email:text})); setAuthState('AWAITING_PASSWORD'); setMessages(p=>[...p, {id:Date.now().toString(), role:'user', text, time: 'Now'}, {id:(Date.now()+1).toString(), role:'assistant', text:'Password:', time:'System'}]); return; }
    if (authState === 'AWAITING_PASSWORD') { 
        setIsTyping(true);
        try {
            const { error } = await supabase!.auth.signInWithPassword({ email: tempCreds.email, password: text });
            if (error) throw error;
            setIsModeAdmin(true); setAuthState('IDLE'); setMessages(p=>[...p, {id:Date.now().toString(), role:'user', text:'******', time: 'Now'}, {id:(Date.now()+1).toString(), role:'assistant', text:'Login Success.', time:'System'}]);
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
        ${PRE_SALES_KNOWLEDGE}
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
