import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

interface Profile {
  name: string;
  email: string;
  age?: number;
  grade?: number;
  createdAt: string;
}

interface UserData {
  profile: Profile;
  preferences?: {
    theme?: string;
    notifications?: boolean;
  };
  quizCount: number;
  overallScore: number;
  averageScore: number;
  completedQuizzes: { [quizId: string]: { score: number; completedAt: string } };
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, initialProfile: Partial<Profile>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  profile: Profile | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const profile = userData?.profile || null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            // Create initial user data if it doesn't exist
            const initialData: UserData = {
              profile: {
                name: user.displayName || '',
                email: user.email || '',
                createdAt: new Date().toISOString()
              },
              quizCount: 0,
              overallScore: 0,
              averageScore: 0,
              completedQuizzes: {}
            };
            await setDoc(doc(db, 'users', user.uid), initialData);
            setUserData(initialData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, initialProfile: Partial<Profile>) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const userData: UserData = {
        profile: {
          name: initialProfile.name || '',
          email: email,
          createdAt: new Date().toISOString(),
          ...initialProfile
        },
        quizCount: 0,
        overallScore: 0,
        averageScore: 0,
        completedQuizzes: {}
      };
      await setDoc(doc(db, 'users', user.uid), userData);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create initial user data for Google sign-in
        const userData: UserData = {
          profile: {
            name: user.displayName || '',
            email: user.email || '',
            createdAt: new Date().toISOString()
          },
          quizCount: 0,
          overallScore: 0,
          averageScore: 0,
          completedQuizzes: {}
        };
        await setDoc(doc(db, 'users', user.uid), userData);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, data, { merge: true });
      setUserData(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Update user data error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserData(null);
  };

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateUserData,
    profile: userData?.profile || null,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
