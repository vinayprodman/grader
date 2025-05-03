import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

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
  register: (email: string, password: string, name: string, age: number, grade: string) => Promise<void>;
  logout: () => void;
  googleSignIn: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore user from localStorage on load
  useEffect(() => {
    const storedUser = localStorage.getItem('graderUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    }
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // If user is logged in via Firebase, update user info
        const userInfo: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          age: 0,
          grade: ''
        };
        setUser(userInfo);
        localStorage.setItem('graderUser', JSON.stringify(userInfo));
      } else {
        setUser(null);
        localStorage.removeItem('graderUser');
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      // Try to get extra info from localStorage if available
      const stored = localStorage.getItem('graderUser');
      let extra: Partial<User> = {};
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.id === res.user.uid) {
            extra = { name: parsed.name, age: parsed.age, grade: parsed.grade };
          }
        } catch {}
      }
      const userInfo: User = {
        id: res.user.uid,
        email: res.user.email || '',
        name: extra.name || res.user.displayName || '',
        age: typeof extra.age === 'number' ? extra.age : 0,
        grade: extra.grade || ''
      };
      setUser(userInfo);
      localStorage.setItem('graderUser', JSON.stringify(userInfo));
      navigate('/');
    } catch (err: any) {
      alert(err.message);
      navigate('/login');
    }
  };

  const register = async (email: string, password: string, name: string, age: number, grade: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const userInfo: User = {
        id: res.user.uid,
        email: res.user.email || '',
        name: name,
        age: typeof age === 'number' ? age : 0,
        grade: grade
      };
      setUser(userInfo);
      localStorage.setItem('graderUser', JSON.stringify(userInfo));
      alert('Registration Successful');
      navigate('/');
    } catch (err: any) {
      alert(err.message);
      navigate('/signup');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('graderUser');
      navigate('/login');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const googleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const userInfo: User = {
        id: res.user.uid,
        email: res.user.email || '',
        name: res.user.displayName || '',
        age: 0,
        grade: ''
      };
      setUser(userInfo);
      localStorage.setItem('graderUser', JSON.stringify(userInfo));
      navigate('/');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleSignIn }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);