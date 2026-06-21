import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

let app: any, auth: any, db: any, storage: any;

try {
  // Check if all required environment variables are present
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('🔥 Firebase Warning: Missing environment variables:', missingVars);
    console.warn('📋 Please set up your .env.local file with Firebase credentials if you wish to use Firebase');
    console.warn('📖 See FIREBASE_SETUP.md for instructions');
    // We do not throw an error here to prevent the Next.js dev server from showing an error overlay.
    // The app will continue using localDatabase.ts
  } else {

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  console.log('🔥 Initializing Firebase with project:', firebaseConfig.projectId);

  // Initialize Firebase only if it hasn't been initialized already to prevent multiple instances
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  console.log('✅ Firebase initialized successfully');
  }
} catch (error) {
  console.error('🔥 Firebase initialization failed:', error);
  // Don't set app, auth, db, storage to undefined - leave them as is
}

export { app, auth, db, storage };
