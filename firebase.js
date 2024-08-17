// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsT_6KSGJ5T8cnD5dMW5r3xavK94SxYFY",
  authDomain: "flashcard-saas-fe61f.firebaseapp.com",
  projectId: "flashcard-saas-fe61f",
  storageBucket: "flashcard-saas-fe61f.appspot.com",
  messagingSenderId: "826676018602",
  appId: "1:826676018602:web:50d53b02bdc768266dffd3",
  measurementId: "G-Y6W63EPL7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };