// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjGbvEzNA0gp5RhtKzuBNnt0RiOkz9gTk",
  authDomain: "lab-basda.firebaseapp.com",
  databaseURL: "https://lab-basda-default-rtdb.firebaseio.com",
  projectId: "lab-basda",
  storageBucket: "lab-basda.firebasestorage.app",
  messagingSenderId: "328211649729",
  appId: "1:328211649729:web:09fe83196a4e3c82223040",
  measurementId: "G-JTYRH248RK"
};

// Initialize Firebase
export const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);
export const auth: Auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
})();

export const db = getFirestore(app);
export const storage = getStorage(app);
