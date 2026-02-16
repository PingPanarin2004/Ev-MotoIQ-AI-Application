// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDayv7OqTv-rZmM4-6Jn_u0nCg8qXbZGs4",
  authDomain: "evmotor-74f8f.firebaseapp.com",
  projectId: "evmotor-74f8f",
  storageBucket: "evmotor-74f8f.firebasestorage.app",
  messagingSenderId: "723475775704",
  appId: "1:723475775704:web:f111a4daf490a8ee0317ad",
  measurementId: "G-70GJLFFBE5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
