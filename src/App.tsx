import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Package, 
  RefreshCw,
  Sparkles,
  MessageSquare,
  Camera,
  X,
  Send,
  Zap,
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { NATIONS, GROUPS, Player, USMNT_PLAYERS, BIH_PLAYERS, NATION_BACKGROUNDS, SPECIAL_STICKERS } from './data';
import confetti from 'canvas-confetti';

// --- Types ---
type View = 'album' | 'pack' | 'schedule' | 'info';

interface CollectedSticker {
  name: string;
  shiny: boolean;
  nation: string;
  slot: number;
  image?: string;
  specialId?: string;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

// --- Components ---

const BackgroundSlider: React.FC<{ customSlides?: string[] }> = ({ customSlides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const defaultSlides = [
    'https://raw.githubusercontent.com/skrobotariik/bosnuka/main/background.jpg',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&q=80&w=2000'
  ];

  const slides = customSlides && customSlides.length > 0 ? customSlides : defaultSlides;

  useEffect(() => {
    setCurrentSlide(0);
  }, [customSlides]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden">
      {slides.map((src, idx) => (
        <div
          key={`${src}-${idx}`}
          className={`bg-slide ${idx === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}
      <div className="vignette" />
    </div>
  );
};

const DecorativeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      {/* Trophy */}
      <motion.img 
        src="https://picsum.photos/seed/trophy_gold/400/600"
        className="absolute top-[10%] -left-20 w-64 h-64 object-contain blur-sm"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Ball */}
      <motion.img 
        src="https://picsum.photos/seed/wc_ball/400/600"
        className="absolute bottom-[20%] -right-20 w-48 h-48 object-contain blur-sm"
        animate={{ 
          y: [0, 30, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* City Silhouette / Element */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-neon-cyan/10 to-transparent" />
    </div>
  );
};

const ProfessionalLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 ${className}`}
    >
      <motion.div 
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-gold via-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center font-black text-black shadow-[0_0_20px_rgba(255,207,64,0.4)]"
      >
        B
      </motion.div>
      <div className="font-black text-lg md:text-2xl tracking-tighter uppercase relative group">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gold to-white bg-[length:200%_auto] animate-shimmer">
          Bosnuka
        </span>
        <span className="ml-1 text-gold inline-block motion-safe:animate-pulse">
          26
        </span>
        <motion.div 
          className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300"
        />
      </div>
    </motion.div>
  );
};

const StickerSlot: React.FC<{ 
  id: string; 
  data?: CollectedSticker; 
  index: number;
}> = ({ id, data, index }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, translateY: -5 }}
      className={`sticker-slot ${data ? 'filled' : ''} ${data?.shiny ? 'shiny-card' : ''}`}
    >
      {data ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          {data.image && (
            <img 
              src={data.image} 
              alt={data.name} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="relative z-10 p-2 text-center">
            <span className="text-[8px] uppercase opacity-70 mb-1 block">{data.nation}</span>
            <span className="text-[10px] font-black leading-tight block">{data.name}</span>
          </div>
        </div>
      ) : (
        <span className="opacity-20">{index}</span>
      )}
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [currentGroup, setCurrentGroup] = useState('A');
  const [stadiumBg, setStadiumBg] = useState<string | null>(null);

  const groupBackgrounds = useMemo(() => {
    if (stadiumBg) return [stadiumBg];
    return GROUPS[currentGroup].map(nation => NATION_BACKGROUNDS[nation]).filter(Boolean);
  }, [currentGroup, stadiumBg]);
  const [collected, setCollected] = useState<Record<string, CollectedSticker>>({});
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [packResults, setPackResults] = useState<CollectedSticker[]>([]);
  const [isPackOverlayOpen, setIsPackOverlayOpen] = useState(false);
  
  // AI Features State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Zdravo! Ja sam vaš BOSNUKA asistent. Kako vam mogu pomoći s albumom danas?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const [motivationalSpeech, setMotivationalSpeech] = useState('');
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  
  const [rarityResult, setRarityResult] = useState('');
  const [isScanningRarity, setIsScanningRarity] = useState(false);
  const rarityInputRef = useRef<HTMLInputElement>(null);

  // Initialize Gemini
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' }), []);

  // Total slots: 48 teams * 16 slots = 768
  const TOTAL_SLOTS = NATIONS.length * 16;

  useEffect(() => {
    const saved = localStorage.getItem('b26_kolekcija_premium');
    if (saved) {
      setCollected(JSON.parse(saved));
    }
  }, []);

  const saveCollection = (newCollection: Record<string, CollectedSticker>) => {
    setCollected(newCollection);
    localStorage.setItem('b26_kolekcija_premium', JSON.stringify(newCollection));
  };

  const openPack = async () => {
    if (isOpeningPack) return;
    setIsOpeningPack(true);
    
    const picks: any[] = [];
    const specialPicks: any[] = [];

    for (let i = 0; i < 5; i++) {
      if (Math.random() > 0.85) {
        const special = SPECIAL_STICKERS[Math.floor(Math.random() * SPECIAL_STICKERS.length)];
        specialPicks.push(special);
      } else {
        const nation = NATIONS[Math.floor(Math.random() * NATIONS.length)];
        const slot = Math.floor(Math.random() * 16) + 1;
        picks.push({ nation, slot });
      }
    }

    try {
      let results: CollectedSticker[] = [];

      if (picks.length > 0) {
        const prompt = `Generate a JSON list of ${picks.length} realistic football player names for the 2026 World Cup for these teams: ${JSON.stringify(picks)}. 
        Format: [{"name": "Full Name", "nation": "Nation Name", "slot": number}]. 
        Make sure the names match the nationality of the team.
        For the team "SAD" (USA), use names from this roster if possible: ${JSON.stringify(USMNT_PLAYERS.map(p => p.name))}.
        For the team "BiH" (Bosnia), use names from this roster if possible: ${JSON.stringify(BIH_PLAYERS.map(p => p.name))}.`;

        const response = await ai.getGenerativeModel({ model: "gemini-3-flash-preview" }).generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  nation: { type: Type.STRING },
                  slot: { type: Type.NUMBER }
                },
                required: ["name", "nation", "slot"]
              }
            }
          }
        });

        const players = JSON.parse(response.response.text() || '[]');
        results = players.map((p: any) => ({
          ...p,
          shiny: Math.random() > 0.85,
          image: `https://picsum.photos/seed/${p.name.replace(/\s+/g, '_')}/400/600`
        }));
      }

      specialPicks.forEach(s => {
        results.push({
          name: s.name,
          nation: s.club,
          slot: 0,
          shiny: true,
          image: s.image,
          specialId: s.id
        });
      });

      setPackResults(results);
      setIsPackOverlayOpen(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2ff', '#ffd700', '#ffffff']
      });
    } catch (error) {
      console.error("Error opening pack:", error);
      const fallback = picks.map(p => ({
        name: `Igrač ${p.slot}`,
        nation: p.nation,
        slot: p.slot,
        shiny: Math.random() > 0.9,
        image: `https://picsum.photos/seed/${p.nation}_${p.slot}/400/600`
      }));
      setPackResults(fallback);
      setIsPackOverlayOpen(true);
    } finally {
      setIsOpeningPack(false);
    }
  };

  const savePackToAlbum = () => {
    const newCollection = { ...collected };
    packResults.forEach(p => {
      const sid = p.specialId || `${p.nation}_${p.slot}`;
      newCollection[sid] = p;
    });
    saveCollection(newCollection);
    setIsPackOverlayOpen(false);
  };

  const resetCollection = () => {
    if (window.confirm("Jeste li sigurni da želite obrisati cijeli album?")) {
      saveCollection({});
    }
  };

  // AI Assistant Chat
  const askAI = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Odgovori kao stručnjak za Svjetsko Prvenstvo 2026 i album Bosnuka na bosanskom jeziku. Pitanje: ${userMsg}`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      setChatMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'ai', text: "Žao mi je, došlo je do greške u komunikaciji." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // AI Motivator
  const generateSpeech = async () => {
    if (isGeneratingSpeech) return;
    setIsGeneratingSpeech(true);
    setMotivationalSpeech('Sastavljam govor...');

    try {
      const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = "Write a 2-sentence inspirational locker room speech for a football team going into the World Cup final 2026. In Bosnian language.";
      const result = await model.generateContent(prompt);
      setMotivationalSpeech(result.response.text());
    } catch (error) {
      setMotivationalSpeech("Motivacija trenutno nije dostupna, ali mi vjerujemo u vas!");
    } finally {
      setIsGeneratingSpeech(false);
    }
  };

  // Visual Rarity Scanner
  const scanRarity = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningRarity(true);
    setRarityResult('Analiziram vizuelne podatke...');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });
        
        const result = await model.generateContent([
          { text: "Analyze this image of a football sticker. Estimate the rarity (1-10) and the potential market value in 2026. Be concise and professional in Bosnian." },
          { inlineData: { mimeType: file.type, data: base64Data } }
        ]);
        
        setRarityResult(result.response.text());
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setRarityResult("Skener trenutno nije u funkciji.");
    } finally {
      setIsScanningRarity(false);
    }
  };

  const progressCount = Object.keys(collected).length;
  const progressPercent = (progressCount / TOTAL_SLOTS) * 100;

  return (
    <div className="min-h-screen">
      <BackgroundSlider customSlides={groupBackgrounds} />
      <DecorativeBackground />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-8 py-4 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent backdrop-blur-md border-b border-white/5">
        <ProfessionalLogo />

        <div className="flex gap-4 md:gap-8 items-center">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-mono text-gold leading-none uppercase tracking-widest font-bold">
              Kolekcija: {progressCount}/{TOTAL_SLOTS}
            </p>
            <div className="w-24 md:w-32 h-1 bg-white/10 mt-1 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-gold shadow-[0_0_10px_rgba(255,207,64,0.8)]" 
              />
            </div>
          </div>
          <button 
            onClick={openPack}
            disabled={isOpeningPack}
            className="bg-yellow-500 text-black px-4 md:px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition transform active:scale-95 shadow-lg disabled:opacity-50"
          >
            {isOpeningPack ? 'Generiram...' : 'Otvori Paketić ✨'}
          </button>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition border border-white/10"
          >
            <MessageSquare size={20} className="text-neon-cyan" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-24 md:pt-32 px-4 md:px-6">
        <header className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-[10px] md:text-xs font-bold tracking-[0.5em] text-neon-cyan mb-2 uppercase">Official Digital Album</h2>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-6">
            DIGITALNI <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">ALBUM</span>
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-[0.3em] mb-8">48 Nacija • 768 Sličica • Otvaraj Paketiće</p>
          
          {/* AI Motivator Section */}
          <div className="mt-8 max-w-lg mx-auto bg-neon-cyan/10 border border-neon-cyan/20 p-4 rounded-xl backdrop-blur-md">
             <button 
                onClick={generateSpeech} 
                disabled={isGeneratingSpeech}
                className="text-[10px] font-bold text-neon-cyan hover:text-white mb-2 block w-full uppercase tracking-widest transition"
             >
                {isGeneratingSpeech ? 'Generiram...' : '✨ Generiši motivacioni govor tima'}
             </button>
             {motivationalSpeech && (
               <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="text-xs italic text-gray-300 leading-relaxed"
               >
                 "{motivationalSpeech}"
               </motion.p>
             )}
          </div>

          {/* Group Navigation */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-12">
            {Object.keys(GROUPS).map(group => (
              <button
                key={group}
                onClick={() => {
                  setCurrentGroup(group);
                  setStadiumBg(null);
                }}
                className={`px-4 py-2 rounded-full text-[10px] font-black border transition uppercase tracking-widest ${
                  currentGroup === group 
                  ? 'bg-neon-cyan text-black border-transparent shadow-[0_0_15px_rgba(0,242,255,0.4)]' 
                  : 'border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                Grupa {group}
              </button>
            ))}
          </div>
        </header>

        <main className="max-w-6xl mx-auto pb-24">
          {/* Special Collection Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="text-yellow-500" size={24} />
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Specijalna Kolekcija</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {SPECIAL_STICKERS.map((sticker, idx) => {
                const sid = sticker.id;
                return (
                  <StickerSlot 
                    key={sid} 
                    id={sid} 
                    data={collected[sid]} 
                    index={idx + 1} 
                  />
                );
              })}
            </div>
          </section>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentGroup}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
            >
              {GROUPS[currentGroup].map(team => (
                <motion.div 
                  key={team}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.98 },
                    show: { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: { 
                        type: 'spring', 
                        damping: 20, 
                        stiffness: 100 
                      } 
                    }
                  }}
                  className="glass-card p-6 md:p-8 transform transition hover:scale-[1.01] relative overflow-hidden group"
                >
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-cyan/5 rounded-full blur-3xl group-hover:bg-neon-cyan/10 transition-colors duration-500" />
                  
                  <div className="flex justify-between items-end mb-8 relative z-10">
                  <div>
                    <p className="text-[9px] font-bold text-neon-cyan tracking-widest uppercase mb-1">Reprezentacija</p>
                    <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">{team}</h3>
                  </div>
                  <div className="text-[10px] opacity-40 font-mono text-gold">#BOSNUKA26</div>
                </div>
                
                  <div className="grid grid-cols-4 gap-2 md:gap-4 relative z-10">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const slotIndex = i + 1;
                    const sid = `${team}_${slotIndex}`;
                    return (
                      <StickerSlot 
                        key={sid} 
                        id={sid} 
                        data={collected[sid]} 
                        index={slotIndex} 
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

          {/* AI Rarity Scanner Section */}
          <section className="mt-24 max-w-4xl mx-auto">
            <div className="glass-card p-8 md:p-12 border-yellow-500/20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-30" />
                <h2 className="text-2xl md:text-3xl font-black mb-4 italic uppercase tracking-tighter">✨ AI Skener Rijetkosti</h2>
                <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">Učitajte sliku sličice i Gemini će procijeniti njenu tržišnu vrijednost i rijetkost u realnom vremenu.</p>
                
                <input 
                  type="file" 
                  ref={rarityInputRef}
                  className="hidden" 
                  accept="image/*" 
                  onChange={scanRarity}
                />
                
                <button 
                  onClick={() => rarityInputRef.current?.click()}
                  disabled={isScanningRarity}
                  className="bg-white text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-500 transition transform active:scale-95 shadow-xl disabled:opacity-50"
                >
                  {isScanningRarity ? 'Skeniram...' : 'Skeniraj Sličicu ✨'}
                </button>
                
                {rarityResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10 text-sm text-gray-300 italic leading-relaxed"
                  >
                    {rarityResult}
                  </motion.div>
                )}
            </div>
          </section>

          <div className="mt-24 flex justify-center">
            <button 
              onClick={resetCollection}
              className="flex items-center gap-2 text-[10px] font-bold text-white/20 hover:text-red-500 transition uppercase tracking-widest"
            >
              <RefreshCw size={12} />
              Resetiraj cijeli album
            </button>
          </div>
        </main>
      </div>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setIsChatOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-2xl relative z-10 overflow-hidden bg-[#0d1117] border-white/10 shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center font-black text-black text-xs shadow-[0_0_10px_rgba(255,207,64,0.5)]">AI</div>
                  <span className="font-black italic uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gold">Bosnuka ✨ AI Asistent</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/40 hover:text-white transition">
                  <X size={20} />
                </button>
              </div>

              {/* Background Generator Button */}
              <div className="px-6 py-3 bg-purple-500/10 border-b border-white/5">
                <button 
                  onClick={() => {
                    const stadiumUrl = `https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=2000&sig=${Math.random()}`;
                    setStadiumBg(stadiumUrl);
                    setChatMessages(prev => [...prev, { role: 'ai', text: "✨ Generisao sam novi stadion za tebe! Uživaj u atmosferi." }]);
                  }}
                  className="text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-widest flex items-center gap-2"
                >
                  <Zap size={12} />
                  Generiši unikatnu pozadinu stadiona (Imagen 4.0)
                </button>
              </div>
              
              <div className="h-96 p-6 overflow-y-auto space-y-4 scrollbar-thin">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                      msg.role === 'user' 
                      ? 'bg-neon-cyan text-black font-bold rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-black/40 border-t border-white/5 flex gap-3">
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && askAI()}
                  type="text" 
                  placeholder="Pitajte o timovima, igračima ili historiji..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-cyan transition text-sm"
                />
                <button 
                  onClick={askAI}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="bg-neon-cyan text-black px-6 py-3 font-black rounded-xl uppercase text-xs hover:bg-white transition disabled:opacity-50 shadow-lg"
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pack Overlay */}
      <AnimatePresence>
        {isPackOverlayOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6"
          >
            <div className="max-w-5xl w-full text-center">
              <motion.h3 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-2xl md:text-4xl font-black mb-12 italic text-neon-cyan uppercase tracking-tighter"
              >
                Nove sličice u kolekciji ✨
              </motion.h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
                {packResults.map((p, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.15, type: 'spring' }}
                    className={`glass-card p-4 aspect-[2/3] flex flex-col items-center justify-center text-center relative overflow-hidden ${p.shiny ? 'shiny-card' : ''}`}
                  >
                    {p.image && (
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {p.shiny && <Sparkles className="absolute top-2 right-2 text-yellow-400" size={16} />}
                    <div className="relative z-10">
                      <p className="text-[10px] uppercase mb-2 opacity-70">{p.nation}</p>
                      <p className="font-black text-base md:text-lg leading-tight uppercase">{p.name}</p>
                      <div className="mt-4 w-8 h-8 mx-auto rounded-full border border-white/20 flex items-center justify-center text-[10px] font-mono">
                        {p.slot}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={savePackToAlbum}
                className="bg-neon-cyan text-black px-12 py-4 rounded-full font-black uppercase tracking-widest shadow-[0_0_30px_rgba(0,242,255,0.4)]"
              >
                Spremi u album
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 py-16 border-t border-white/5 bg-black/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold text-neon-cyan uppercase tracking-[0.4em] mb-4">Host Nations 2026</p>
            <div className="flex gap-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition duration-700">
              <img src="https://flagcdn.com/w80/us.png" alt="USA" className="h-8" referrerPolicy="no-referrer" />
              <img src="https://flagcdn.com/w80/ca.png" alt="Canada" className="h-8" referrerPolicy="no-referrer" />
              <img src="https://flagcdn.com/w80/mx.png" alt="Mexico" className="h-8" referrerPolicy="no-referrer" />
            </div>
          </div>
          <div className="text-center md:text-right">
            <ProfessionalLogo className="justify-center md:justify-end mb-4" />
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
              &copy; 2026 BOSNUKA DIGITAL. SVA PRAVA PRIDRŽANA.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
