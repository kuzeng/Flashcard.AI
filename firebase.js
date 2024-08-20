// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFMSneMVJiEBeuyf2ZP9aAKqsSGWbVHms",
  authDomain: "flashcardsaas-9c86b.firebaseapp.com",
  projectId: "flashcardsaas-9c86b",
  storageBucket: "flashcardsaas-9c86b.appspot.com",
  messagingSenderId: "251249852985",
  appId: "1:251249852985:web:26ee53d2771f02155843e8",
  measurementId: "G-ZKYENF1MV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};