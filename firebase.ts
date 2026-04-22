// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

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
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

const usersRef = collection(db, "users");
const roomRef = collection(db, "rooms");
const functions = getFunctions(app, "us-central1");

export { auth, db, usersRef, roomRef, functions };