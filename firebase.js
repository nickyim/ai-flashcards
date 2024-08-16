// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAO-qwlIU6_bTauZCuLgIUBPG1SwXrsqH0",
  authDomain: "flashcard-saas-23556.firebaseapp.com",
  projectId: "flashcard-saas-23556",
  storageBucket: "flashcard-saas-23556.appspot.com",
  messagingSenderId: "801482584227",
  appId: "1:801482584227:web:b58983c2ba5dea4dbb4f16",
  measurementId: "G-L2FH83BJBD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}