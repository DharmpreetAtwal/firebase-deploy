import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKBEJU3iypqdlQQ80cPeXIo5oC8oit4Tg",
  authDomain: "fir-prac-79c9a.firebaseapp.com",
  projectId: "fir-prac-79c9a",
  storageBucket: "fir-prac-79c9a.appspot.com",
  messagingSenderId: "459675283732",
  appId: "1:459675283732:web:ccbf468d2342e321749201",
  measurementId: "G-2Y1534S170",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
