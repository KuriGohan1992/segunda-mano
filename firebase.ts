// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhmgZDv8z61BRtoqhVugRRWUSonQ374jI",
  authDomain: "segunda-mano-51708.firebaseapp.com",
  projectId: "segunda-mano-51708",
  storageBucket: "segunda-mano-51708.firebasestorage.app",
  messagingSenderId: "802705068771",
  appId: "1:802705068771:web:5bd7d84c5dafa3c2732bd6",
  measurementId: "G-JF35YC1XNX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  // persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { auth, db };