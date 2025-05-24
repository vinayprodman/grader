import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { notify } from './utils/notifications';

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
  .catch(() => {
    notify.error("Failed to set authentication persistence. You may need to log in more frequently.");
  });

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Enable Firestore persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      notify.warning('Multiple tabs open, offline data may not be available in all tabs.');
    } else if (err.code === 'unimplemented') {
      notify.warning('Your browser doesn\'t support offline data storage.');
    }
  });

export { auth, googleProvider, db };
