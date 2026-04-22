import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Search, Settings, Trash2, Sparkles, Zap, Lock, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [searchInput, setSearchInput] = useState("");
  const [memories, setMemories] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [coupleID, setCoupleID] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('panel');
    setCoupleID(id);

    if (id) {
      const q = query(collection(db, 'memories'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const globalData = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(m => m.coupleID === id);
        setMemories(globalData);
      });
      return () => unsubscribe();
    }
  }, []);

  const addMemory = async () => {
    if (!newEntry.title || !newEntry.content || !coupleID) return;
    await addDoc(collection(db, 'memories'), {
      ...newEntry,
      coupleID,
      createdAt: serverTimestamp()
    });
    setNewEntry({ title: '', content: '' });
  };

  const deleteMemory = async (id) => {
    await deleteDoc(doc(db, 'memories', id));
  };

  const filteredResults = memories.filter(m => 
    m.title.toLowerCase().includes(searchInput.toLowerCase()) || 
    m.content.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#050208] text-[#ededed] relative overflow-x-hidden flex flex-col items-center">
      
      {/* LIVE MESH BACKDROP */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, -100, 0], y: [0, -50, 100, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-indigo-600/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -100, 100, 0], y: [0, 100, -50, 0], scale: [1, 0.9, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-pink-600/10 blur-[120px] rounded-full" 
        />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <nav className="relative z-50 w-full max-w-6xl p-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-2xl shadow-2xl">
            <Zap size={22} className="text-black" fill="black" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Pulse<span className="text-indigo-500">.</span>node</span>
        </div>
        
        <button onClick={() => setIsAdmin(!isAdmin)} className={`p-3 rounded-2xl border transition-all ${isAdmin ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
          <Settings size={20} />
        </button>
      </nav>

      <main className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center pt-10 pb-32">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-mono uppercase tracking-[0.3em] mb-6">
            {coupleID ? (
              <><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />NODE_ACTIVE // {coupleID.toUpperCase()}</>
            ) : (
              <><Lock size={12} className="text-red-500" />ACCESS_RESTRICTED</>
            )}
          </motion.div>
          <h2 className="text-6xl md:text-7xl font-black tracking-tight leading-[0.9]">Shared <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-500">Universe.</span></h2>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full mb-16 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-600 rounded-[35px] blur opacity-10 group-focus-within:opacity-40 transition duration-500"></div>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={24} />
            <input 
              type="text"
              placeholder="Query keywords..."
              className="w-full py-7 pl-16 pr-8 rounded-[30px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl focus:outline-none focus:border-indigo-500/50 text-xl transition-all placeholder:text-white/10 shadow-2xl"
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence>
          {isAdmin && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full mb-12 p-8 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center gap-2 mb-6 text-indigo-400 font-mono text-xs uppercase tracking-widest"><Plus size={14}/> Push_New_Data</div>
              <div className="space-y-4">
                <input placeholder="Event Title" className="w-full p-4 rounded-2xl bg-black/40 border border-white/5 outline-none focus:border-indigo-500 font-mono text-sm" value={newEntry.title} onChange={e => setNewEntry({...newEntry, title: e.target.value})} />
                <textarea placeholder="Logs / Context / Keywords" className="w-full p-4 h-32 rounded-2xl bg-black/40 border border-white/5 outline-none focus:border-indigo-500 font-mono text-sm" value={newEntry.content} onChange={e => setNewEntry({...newEntry, content: e.target.value})} />
                <button onClick={addMemory} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Commit Node</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full space-y-6">
          {searchInput.length > 0 ? (
            filteredResults.map((m) => (
              <motion.div layout key={m.id} className="w-full p-10 rounded-[45px] bg-white/[0.03] border border-white/5 backdrop-blur-2xl hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-3xl font-bold text-white tracking-tight">{m.title}</h4>
                  {isAdmin && (
                    <button onClick={() => deleteMemory(m.id)} className="p-2.5 bg-red-500/10 rounded-full text-red-500/40 hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <p className="text-xl text-white/50 leading-relaxed font-medium">{m.content}</p>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center py-20 opacity-10">
              <div className="w-16 h-16 border border-dashed border-white rounded-full flex items-center justify-center animate-[spin_15s_linear_infinite]">
                <Sparkles size={24} />
              </div>
              <p className="mt-6 font-mono text-[10px] tracking-[0.5em] uppercase text-center leading-loose">Standby Mode<br/>Neural Link Encrypted</p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-10 flex flex-col items-center gap-3">
        <div className="h-1 w-1 bg-indigo-500 rounded-full animate-ping" />
        <p className="text-white/10 text-[10px] font-black tracking-[1em] uppercase">Phase_2.4 // Global Node</p>
      </footer>
    </div>
  );
}
