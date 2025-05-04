/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
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
  createdAt: Date;
  lastLogin: Date;
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
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Helper function to create user data
const createUserData = (firebaseUser: FirebaseUser, additionalData: Partial<User> = {}): User => {
  const now = new Date();
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: firebaseUser.displayName || additionalData.name || "",
    age: additionalData.age || 0,
    grade: additionalData.grade || "",
    createdAt: additionalData.createdAt || now,
    lastLogin: now,
  };
};

// Helper function to update user in Firestore
const updateUserInFirestore = async (userId: string, userData: Partial<User>) => {
  await setDoc(doc(db, "users", userId), userData, { merge: true });
};

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore user from Firestore on load
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userInfo = createUserData(firebaseUser, userData);
            setUser(userInfo);
          } else {
            const userInfo = createUserData(firebaseUser);
            await updateUserInFirestore(firebaseUser.uid, userInfo);
            setUser(userInfo);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          setUser(createUserData(firebaseUser));
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
      const userRef = doc(db, "users", res.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userInfo = createUserData(res.user, userData);
        await updateUserInFirestore(res.user.uid, { lastLogin: new Date() });
        setUser(userInfo);
        navigate("/dashboard");
      } else {
        navigate("/complete-profile");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to log in");
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    age: number,
    grade: string
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const userInfo = createUserData(res.user, { name, age, grade });
      
      await updateUserInFirestore(res.user.uid, userInfo);
      setUser(userInfo);
      navigate("/dashboard");
    } catch (error: any) {
      throw new Error(error.message || "Failed to create account");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error: any) {
      throw new Error(error.message || "Failed to log out");
    }
  };

  const googleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const userInfo = createUserData(res.user);
      
      // Check if user exists in Firestore
      const userRef = doc(db, "users", res.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        setUser(userInfo);
        setModalOpen(true);
      } else {
        const userData = userDoc.data();
        const updatedUser = createUserData(res.user, userData);
        await updateUserInFirestore(res.user.uid, { lastLogin: new Date() });
        setUser(updatedUser);
        navigate("/dashboard");
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in with Google");
    }
  };

  const handleProfileSubmit = async (age: string, grade: string) => {
    if (user) {
      try {
        const updatedUser = {
          ...user,
          age: parseInt(age || "0", 10),
          grade: grade || "",
        };

        await updateUserInFirestore(user.id, {
          age: updatedUser.age,
          grade: updatedUser.grade,
        });

        setUser(updatedUser);
        setModalOpen(false);
        navigate("/dashboard");
      } catch (error: any) {
        throw new Error(error.message || "Failed to update profile");
      }
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
