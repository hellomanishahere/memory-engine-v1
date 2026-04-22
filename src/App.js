import React, { useState, useEffect } from 'react';
import { Search, Heart, Settings, Trash2, Plus, Moon, Sun, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [query, setQuery] = useState("");
  const [memories, setMemories] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', tags: '' });

  useEffect(() => {
    const saved = localStorage.getItem('memory_v1_data');
    if (saved) {
      setMemories(JSON.parse(saved));
    } else {
      // Default starter data
      const starter = [
        { id: 1, title: "The Beginning", content: "Where our story started. Type 'Boo Boo' or 'Mussoorie' to see more.", tags: ["us", "start"] },
        { id: 2, title: "Mussoorie 2026", content: "Counting down the days until our mountain escape! 🏔️", tags: ["trip", "june", "mussoorie"] }
      ];
      setMemories(starter);
      localStorage.setItem('memory_v1_data', JSON.stringify(starter));
    }
  }, []);

  const saveToStorage = (updated) => {
    setMemories(updated);
    localStorage.setItem('memory_v1_data', JSON.stringify(updated));
  };

  const addMemory = () => {
    if (!newEntry.title || !newEntry.content) return;
    const entry = {
      id: Date.now(),
      title: newEntry.title,
      content: newEntry.content,
      tags: newEntry.tags.split(',').map(t => t.trim().toLowerCase())
    };
    saveToStorage([...memories, entry]);
    setNewEntry({ title: '', content: '', tags: '' });
  };

  const deleteMemory = (id) => saveToStorage(memories.filter(m => m.id !== id));

  const filteredResults = memories.filter(m => 
    m.title.toLowerCase().includes(query.toLowerCase()) || 
    m.tags.some(t => t.includes(query.toLowerCase()))
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white">M</div>
          <span>Memory<span className="text-pink-500">Engine</span></span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-pink-500/10 transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsAdmin(!isAdmin)} className={`p-2 rounded-xl bg-white/5 border border-white/10 transition-colors ${isAdmin ? 'text-pink-500 border-pink-500/50' : ''}`}>
            <Settings size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-20 pb-32">
        {/* Search Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">What are you looking for?</h1>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search a date, a place, or a feeling..."
              className="w-full py-4 pl-12 pr-4 rounded-2xl bg-white/5 border border-slate-800 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all shadow-2xl backdrop-blur-xl"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Admin Form */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-12 p-6 rounded-2xl bg-pink-500/5 border border-pink-500/20 overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-pink-500 font-semibold"><Plus size={18}/> New Index Entry</div>
              <div className="space-y-3">
                <input placeholder="Memory Title" className="w-full p-3 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-pink-500 outline-none" value={newEntry.title} onChange={e => setNewEntry({...newEntry, title: e.target.value})} />
                <input placeholder="Tags (comma separated)" className="w-full p-3 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-pink-500 outline-none" value={newEntry.tags} onChange={e => setNewEntry({...newEntry, tags: e.target.value})} />
                <textarea placeholder="Write the details here..." className="w-full p-3 h-32 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-pink-500 outline-none" value={newEntry.content} onChange={e => setNewEntry({...newEntry, content: e.target.value})} />
                <button onClick={addMemory} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-pink-500/20">Index Memory</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div className="space-y-4">
          {query.length > 0 ? (
            filteredResults.map((m) => (
              <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={m.id} className="p-6 rounded-2xl bg-white/5 border border-slate-800 hover:bg-white/10 transition-all group relative">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-pink-500 flex items-center gap-2">
                    {m.tags.includes('trip') && <MapPin size={18} />}
                    {m.title}
                  </h3>
                  {isAdmin && <Trash2 size={18} className="cursor-pointer text-slate-600 hover:text-red-500 transition-colors" onClick={() => deleteMemory(m.id)} />}
                </div>
                <p className="mt-3 text-slate-400 leading-relaxed">{m.content}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {m.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md bg-slate-800 text-slate-500">#{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 opacity-20">
              <Heart size={48} className="mx-auto mb-4" />
              <p>Type something to search the engine...</p>
            </div>
          )}
          
          {query.length > 0 && filteredResults.length === 0 && (
            <div className="text-center py-10 text-slate-500 italic">
              "No data found for this query. Try searching for 'Boo Boo'?"
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 w-full p-6 text-center text-xs text-slate-600 backdrop-blur-sm">
        Built with ❤️ for Boo • Memory Engine v1.0
      </footer>
    </div>
  );
}
