// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhzRKkvbMOyzxr_84xZgAdVNKnQQ3HAvU",
  authDomain: "flashcardsaas-2f9f1.firebaseapp.com",
  projectId: "flashcardsaas-2f9f1",
  storageBucket: "flashcardsaas-2f9f1.appspot.com",
  messagingSenderId: "732912770640",
  appId: "1:732912770640:web:910b8d931b6ce4fa0e7b55",
  measurementId: "G-5X1YWSFZGM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
