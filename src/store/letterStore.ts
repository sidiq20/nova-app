import { create } from 'zustand';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth, isFirebaseReady } from '../lib/firebase';

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
    if (!isFirebaseReady()) {
      set({
        letters: [],
        isLoading: false,
        error: 'Firebase is not initialized. Some features may be limited.'
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const user = auth?.currentUser;
      if (!user || !db) {
        set({
          letters: [],
          isLoading: false,
          error: user ? 'Database not available' : 'Please sign in to view your letters'
        });
        return;
      }

      try {
        // Try with composite index first
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

        set({ letters, isLoading: false, error: null });
      } catch (indexError: any) {
        // If index error, try without the orderBy
        if (indexError.message && indexError.message.includes('index')) {
          console.warn('Index error, fetching without ordering:', indexError);
          try {
            // Fallback query without ordering
            const fallbackQuery = query(
              collection(db, 'letters'),
              where('userId', '==', user.uid)
            );

            const snapshot = await getDocs(fallbackQuery);
            let letters = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate() || new Date(),
              stickers: doc.data().stickers || []
            })) as Letter[];

            // Sort manually in memory
            letters = letters.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            set({ 
              letters, 
              isLoading: false, 
              error: 'Missing database index. Some features may be limited. Please contact support.'
            });
          } catch (fallbackError) {
            throw fallbackError; // Re-throw to be caught by outer catch
          }
        } else {
          throw indexError; // Re-throw if not an index error
        }
      }
    } catch (error) {
      console.error('Error fetching letters:', error);
      set({
        isLoading: false,
        error: 'Failed to fetch letters. Please try again later.'
      });
    }
  },

  createLetter: async (letter) => {
    if (!isFirebaseReady()) {
      set({ error: 'Firebase is not initialized. Unable to save letter.' });
      return;
    }

    const user = auth?.currentUser;
    if (!user || !db) {
      set({ error: 'Please sign in to save your letter.' });
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
        currentLetter: createdLetter,
        error: null
      }));
    } catch (error) {
      console.error('Error creating letter:', error);
      set({ error: 'Failed to save letter. Please try again.' });
    }
  },

  updateLetter: async (id, updates) => {
    if (!isFirebaseReady()) {
      set({ error: 'Firebase is not initialized. Unable to update letter.' });
      return;
    }

    const user = auth?.currentUser;
    if (!user || !db) {
      set({ error: 'Please sign in to update your letter.' });
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
          : state.currentLetter,
        error: null
      }));
    } catch (error) {
      console.error('Error updating letter:', error);
      set({ error: 'Failed to update letter. Please try again.' });
    }
  }
}));