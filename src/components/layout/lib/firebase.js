import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzxQEJcnDmNId7UlqNoBzSr56HHXKGvJ0",
  authDomain: "altonsworld-portfolio.firebaseapp.com",
  projectId: "altonsworld-portfolio",
  storageBucket: "altonsworld-portfolio.firebasestorage.app",
  messagingSenderId: "675045750854",
  appId: "1:675045750854:web:300eed244db12ebbc87247"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);