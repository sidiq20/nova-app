import { create } from 'zustand';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface Letter {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  paperStyle: string;
  fontFamily: string;
  favorite?: boolean;
  stickers: Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    rotation: number;
    size: number;
  }>;
}

interface LetterStore {
  letters: Letter[];
  currentLetter: Letter | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  fetchLetters: () => Promise<void>;
  createLetter: (letter: Omit<Letter, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLetter: (id: string, updates: Partial<Letter>) => Promise<void>;
  setCurrentLetter: (letter: Letter | null) => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export const useLetterStore = create<LetterStore>((set, get) => ({
  letters: [],
  currentLetter: null,
  searchQuery: '',
  isLoading: false,
  error: null,

  setCurrentLetter: (letter) => set({ currentLetter: letter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearError: () => set({ error: null }),

  fetchLetters: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = auth?.currentUser;
      if (!user) {
        set({ letters: [], isLoading: false });
        return;
      }

      if (!db) {
        throw new Error('Firestore is not initialized');
      }

      const q = query(
        collection(db, 'letters'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const letters = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        stickers: doc.data().stickers || []
      })) as Letter[];

      set({ letters, isLoading: false });
    } catch (error) {
      console.error('Error fetching letters:', error);
      set({ 
        letters: [], 
        isLoading: false,
        error: 'Failed to fetch letters. Please try again later.'
      });
    }
  },

  createLetter: async (letter) => {
    const user = auth?.currentUser;
    if (!user) {
      set({ error: 'Please sign in to create a letter.' });
      return;
    }

    if (!db) {
      set({ error: 'Database is not initialized' });
      return;
    }

    try {
      set({ error: null });
      const now = new Date();
      const newLetter = {
        ...letter,
        userId: user.uid,
        createdAt: now,
        updatedAt: now,
        stickers: letter.stickers || []
      };

      const docRef = await addDoc(collection(db, 'letters'), newLetter);
      const createdLetter = {
        id: docRef.id,
        ...newLetter
      } as Letter;
      
      set(state => ({
        letters: [createdLetter, ...state.letters],
        currentLetter: createdLetter
      }));
    } catch (error) {
      console.error('Error creating letter:', error);
      set({ error: 'Failed to create letter. Please try again.' });
    }
  },

  updateLetter: async (id, updates) => {
    const user = auth?.currentUser;
    if (!user) {
      set({ error: 'Please sign in to update the letter.' });
      return;
    }

    if (!db) {
      set({ error: 'Database is not initialized' });
      return;
    }

    try {
      set({ error: null });
      const letterRef = doc(db, 'letters', id);
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(letterRef, updateData);
      
      set(state => ({
        letters: state.letters.map(letter =>
          letter.id === id
            ? { ...letter, ...updateData }
            : letter
        ),
        currentLetter: state.currentLetter?.id === id
          ? { ...state.currentLetter, ...updateData }
          : state.currentLetter
      }));
    } catch (error) {
      console.error('Error updating letter:', error);
      set({ error: 'Failed to update letter. Please try again.' });
    }
  }
}));