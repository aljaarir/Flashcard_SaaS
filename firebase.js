// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCOJ5mMJKWsiYJcHpJvbAxzNJhY1p-hUQ",
  authDomain: "flashcard-saas-b6c30.firebaseapp.com",
  projectId: "flashcard-saas-b6c30",
  storageBucket: "flashcard-saas-b6c30.appspot.com",
  messagingSenderId: "1001520979270",
  appId: "1:1001520979270:web:df39de11f8855559ccd947"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

