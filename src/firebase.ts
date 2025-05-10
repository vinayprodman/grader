import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzCeiPaiDSsnggHDHkTnxgFW6wG1gBShU",
  authDomain: "grader-a2085.firebaseapp.com",
  projectId: "grader-a2085",
  storageBucket: "grader-a2085.firebasestorage.app",
  messagingSenderId: "80518260051",
  appId: "1:80518260051:web:272fbdb313d5e1d7e56da6",
  measurementId: "G-6FYXP2WVJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set auth persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Enable Firestore persistence
enableIndexedDbPersistence(db)
  .then(() => {
    console.log("Firestore persistence enabled");
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });

export { auth, googleProvider, db };
