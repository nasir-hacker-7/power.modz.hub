
// Import Firebase Functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// My Firebase Config (DO NOT CHANGE)
const firebaseConfig = {
  apiKey: "AIzaSyDaI-weMRdRPbAkl7YhdZNCyjzvz6oeBkA",
  authDomain: "power-modz-hub.firebaseapp.com",
  projectId: "power-modz-hub",
  storageBucket: "power-modz-hub.firebasestorage.app",
  messagingSenderId: "101185416384",
  appId: "1:101185416384:web:09217baa61e1d3d0579125",
  measurementId: "G-4KCL9QVLVB"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
