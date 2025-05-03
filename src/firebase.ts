import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJ7AOVybp8PH2BP3vXQf_hCtbQEFKxE-A",
  authDomain: "durable-stack-405413.firebaseapp.com",
  projectId: "durable-stack-405413",
  storageBucket: "durable-stack-405413.appspot.com",
  messagingSenderId: "159091541367",
  appId: "1:159091541367:web:a3e324d4be352f66474d72",
  measurementId: "G-VGLH2KL4HN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider }; 