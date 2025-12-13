// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFhx9gQsLjMMTRZrYTSsRVbKhJdhiNd5Q",
  authDomain: "carte-noel-78e65.firebaseapp.com",
  projectId: "carte-noel-78e65",
  storageBucket: "carte-noel-78e65.firebasestorage.app",
  messagingSenderId: "664765046164",
  appId: "1:664765046164:web:cc43ce8241c7e72ae68381",
  measurementId: "G-LWW7SEYBP9"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Export nommé de Firestore
export const db = getFirestore(app);
