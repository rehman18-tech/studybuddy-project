import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let app = null;
let auth = null;
let isFirebaseActive = false;

// Only initialize Firebase if apiKey is present and valid
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY") {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    isFirebaseActive = true;
    console.log("🔥 Firebase Auth initialized successfully!");
  } catch (err) {
    console.error("Firebase initialization failed:", err);
  }
}

// Fallback mock interfaces for zero-config run
if (!isFirebaseActive) {
  console.log("⚠️ Firebase credentials missing. Running in local mock auth mode.");
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // Return unauthenticated on startup
      setTimeout(() => callback(null), 100);
      return () => {};
    }
  };
}

export { 
  auth, 
  isFirebaseActive,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut,
  onAuthStateChanged 
};
