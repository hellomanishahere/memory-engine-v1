import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

useEffect(() => {
  if (coupleID) {
    const q = query(collection(db, "memories"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const globalData = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(m => m.coupleID === coupleID); // Only show YOUR couple's data
      setMemories(globalData);
    });
    return () => unsubscribe();
  }
}, [coupleID]);

const addMemory = async () => {
  if (!newEntry.title || !newEntry.content) return;
  await addDoc(collection(db, "memories"), {
    title: newEntry.title,
    content: newEntry.content,
    coupleID: coupleID, // Tags it to your private panel
    createdAt: new Date()
  });
  setNewEntry({ title: '', content: '' });
};
