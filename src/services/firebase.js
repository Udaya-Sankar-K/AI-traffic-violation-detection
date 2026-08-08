// Firebase stub — app uses local mock authentication (no Firebase credentials required)
// To enable real Firebase, add VITE_FIREBASE_* variables to .env.local

const FIREBASE_CONFIGURED =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY';

let auth = null;
let db = null;
let storage = null;

if (FIREBASE_CONFIGURED) {
  try {
    const { initializeApp } = await import('firebase/app');
    const { getAuth }       = await import('firebase/auth');
    const { getFirestore }  = await import('firebase/firestore');
    const { getStorage }    = await import('firebase/storage');

    const firebaseConfig = {
      apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    auth    = getAuth(app);
    db      = getFirestore(app);
    storage = getStorage(app);
  } catch (e) {
    console.warn('[TVDS] Firebase init failed — running in demo mode:', e.message);
  }
} else {
  console.info('[TVDS] Firebase not configured — running in demo/mock mode. Login with any Police ID (3+ chars) and password (6+ chars).');
}

export { auth, db, storage };
export default null;
