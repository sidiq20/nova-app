import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if we have all required config
const hasRequiredConfig = Object.values(firebaseConfig).every(value =>
  value &&
  value !== 'undefined' &&
  !value.includes('your-') &&
  value.length > 0
);

if (hasRequiredConfig) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // Initialize auth persistence
    auth.setPersistence('browserLocal');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn('Firebase configuration is incomplete. Some features may not work.');
}

// Export initialized instances or undefined
export { app, db, auth };

// Helper function to check if Firebase is ready
export const isFirebaseReady = () => {
  return Boolean(app && db && auth);
};