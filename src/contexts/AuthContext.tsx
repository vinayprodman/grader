/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider, db } from "../firebase"; // Assuming db is your Firestore instance
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions
import CompleteProfile from "../components/auth/CompleteProfile";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  grade: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    age: number,
    grade: string
  ) => Promise<void>;
  logout: () => void;
  googleSignIn: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore user from Firestore on load
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check Firestore for existing user data
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userInfo: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: userData.name || "",
            age: userData.age || 0,
            grade: userData.grade || "",
          };
          setUser(userInfo);
        } else {
          // If no user data, initialize empty data
          const userInfo: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || "",
            age: 0,
            grade: "",
          };
          setUser(userInfo);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      // Check Firestore for additional user info
      const userRef = doc(db, "users", res.user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userInfo: User = {
          id: res.user.uid,
          email: res.user.email || "",
          name: userData.name || "",
          age: userData.age || 0,
          grade: userData.grade || "",
        };
        setUser(userInfo);
        navigate("/");
      } else {
        // If no additional user info exists, navigate to profile completion
        navigate("/complete-profile");
      }
    } catch (err: any) {
      alert(err.message);
      navigate("/login");
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    age: number,
    grade: string
  ): Promise<any> => { // Now it returns a value instead of void
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
  
  
      // Save user info to Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        name,
        age,
        grade,
      });
  
      alert("Registration Successful");
      navigate("/");
  
      return res; // Return user credential object
    } catch (err: any) {
      alert(err.message);
      navigate("/signup");
      return null; // Return null or handle the error appropriately
    }
  };
  

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const googleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const userInfo: User = {
        id: res.user.uid,
        email: res.user.email || "",
        name: res.user.displayName || "",
        age: 0, // Default value, will be updated from modal
        grade: "", // Default value, will be updated from modal
      };

      setUser(userInfo);
      setModalOpen(true); // Open modal for age and grade
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleProfileSubmit = async (age: string, grade: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        age: parseInt(age || "0", 10),
        grade: grade || "",
      };

      // Update user info in Firestore
      await setDoc(doc(db, "users", user.id), {
        age: updatedUser.age,
        grade: updatedUser.grade,
      });

      setUser(updatedUser);
      setModalOpen(false); // Close the modal after submitting
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, googleSignIn }}
    >
      {!loading && children}

      {/* CompleteProfile Modal */}
      <CompleteProfile
        open={modalOpen}
        onClose={() => setModalOpen(false)} // Close modal on click
        onSubmit={handleProfileSubmit}
      />
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
