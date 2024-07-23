// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "dine-express.firebaseapp.com",
  projectId: "dine-express",
  storageBucket: "dine-express.appspot.com",
  messagingSenderId: "804905349590",
  appId: "1:804905349590:web:e82cb675f8d1d2d1ef7477",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
