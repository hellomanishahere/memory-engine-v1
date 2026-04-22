import React, { useState, useEffect } from 'react';
import { Search, Command, Settings, Trash2, Plus, Zap, Activity, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [query, setQuery] = useState("");
  const [memories, setMemories] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });

  const filteredResults = memories.filter(m => 
    m.title.toLowerCase().includes(query.toLowerCase()) || 
    m.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-[#ededed] selection:bg-indigo-500/30 flex flex-col items-center">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <nav className="w-full max-w-6xl p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl shadow-2xl">
            <Activity size={22} className="text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight uppercase">Index<span className="text-indigo-500">.v1</span></span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/40">
            <Globe size={12} /> STABLE_CONNECTION
          </div>
          <button 
            onClick={() => setIsAdmin(!isAdmin)} 
            className={`p-2.5 rounded-xl border transition-all ${isAdmin ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center pt-20 pb-32">
        
        <div className="w-full mb-12">
          <h2 className="text-4xl font-medium tracking-tight text-white mb-2">Neural Search.</h2>
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Accessing shared_memories // Manisha & Ahhryan</p>
        </div>

        <div className="relative w-full mb-20 group">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center">
            <Search className="absolute left-5 text-white/20" size={20} />
            <input 
              type="text"
              placeholder="Search data points..."
              className="w-full py-4 pl-14 pr-6 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-indigo-500/50 outline-none text-lg transition-all placeholder:text-white/10"
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute right-4 flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/40 font-mono">
              <Command size={10} /> K
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isAdmin && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              className="w-full mb-12 p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 mb-6 text-indigo-400 font-mono text-xs uppercase tracking-tighter">
                <Plus size={14}/> Push_New_Data
              </div>
              <div className="space-y-4">
                <input 
                  placeholder="Event_Title" 
                  className="w-full p-3 rounded-xl bg-black border border-white/5 focus:border-indigo-500 outline-none font-mono text-sm" 
                  onChange={e => setNewEntry({...newEntry, title: e.target.value})} 
                />
                <textarea 
                  placeholder="Logs / Context / Details" 
                  className="w-full p-3 h-32 rounded-xl bg-black border border-white/5 focus:border-indigo-500 outline-none font-mono text-sm" 
                  onChange={e => setNewEntry({...newEntry, content: e.target.value})} 
                />
                <button className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-indigo-500 hover:text-white transition-all text-sm uppercase">Commit to Node</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full space-y-4">
          {query.length > 0 ? (
            filteredResults.map((m) => (
              <motion.div 
                layout 
                key={m.id} 
                className="w-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">{m.title}</h4>
                  {isAdmin && <Trash2 size={16} className="text-white/10 hover:text-red-500 cursor-pointer transition-colors" />}
                </div>
                <p className="text-white/50 leading-relaxed text-sm">{m.content}</p>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center py-24 opacity-10">
              <Zap size={40} className="mb-4" />
              <p className="text-xs font-mono uppercase tracking-[0.4em]">Engine_Standby</p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-8 w-full border-t border-white/5 flex flex-col items-center gap-2">
        <p className="text-[10px] font-mono text-white/20 tracking-[0.5em] uppercase">Private Encryption Active</p>
        <div className="h-1 w-1 bg-indigo-500 rounded-full animate-ping" />
      </footer>
    </div>
  );
}
