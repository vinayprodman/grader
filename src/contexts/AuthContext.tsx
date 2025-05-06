/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError,
  browserPopupRedirectResolver,
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import CompleteProfile from "../components/auth/CompleteProfile";

// Types
interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
  age?: number;
  grade?: string;
}

interface User extends FirebaseUser {
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasProfile: boolean;
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
  updateUserProfile: (profile: UserProfile) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create user data
const createUserData = (firebaseUser: FirebaseUser, profile: UserProfile): User => {
  console.log('Creating user data:', { uid: firebaseUser.uid, profile });
  return {
    ...firebaseUser,
    profile
  };
};

// Helper to check if core profile fields are present
const checkHasProfile = (user: User | null): boolean => {
  console.log('Checking profile status:', { 
    hasUser: !!user, 
    hasProfile: !!user?.profile,
    profileData: user?.profile 
  });
  
  if (!user || !user.profile) return false;
  const hasRequiredFields = !!(user.profile.age && user.profile.age > 0 && user.profile.grade && user.profile.grade.trim() !== "");
  console.log('Profile check result:', { hasRequiredFields });
  return hasRequiredFields;
};

// Helper function to update user in Firestore
const updateUserInFirestore = async (userId: string, profile: UserProfile) => {
  console.log('Updating user in Firestore:', { userId, profile });
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      profile,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log('Successfully updated user in Firestore');
  } catch (error) {
    console.error("Error updating user in Firestore:", error);
    throw new Error("Failed to update user data");
  }
};

// Helper function to handle Firebase auth errors
const handleAuthError = (error: AuthError): string => {
  console.error("Auth error:", { code: error.code, message: error.message });
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'Email is already in use';
    case 'auth/weak-password':
      return 'Password is too weak';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing the sign-in';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by the browser';
    case 'auth/cancelled-popup-request':
      return 'Multiple popup requests were made';
    case 'auth/network-request-failed':
      return 'Network error occurred. Please check your connection';
    default:
      return error.message || 'An error occurred during authentication';
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const checkUserProfile = async (user: User) => {
    console.log('Checking user profile:', { uid: user.uid });
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      console.log('Firestore user document:', { exists: userDoc.exists(), data: userDoc.data() });
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Check if user has basic info (name, email) even without full profile
        const basicInfo = {
          name: userData.name || user.displayName || '',
          email: userData.email || user.email || '',
          createdAt: userData.createdAt || new Date().toISOString()
        };
        
        if (userData.profile) {
          console.log('Found complete user profile:', userData.profile);
          const updatedUser = { ...user, profile: userData.profile };
          setUser(updatedUser);
          setHasProfile(true);
          return true;
        } else {
          // Set basic user info even without full profile
          console.log('Setting basic user info:', basicInfo);
          const updatedUser = { ...user, profile: basicInfo };
          setUser(updatedUser);
          setHasProfile(false);
          return false;
        }
      }
      console.log('No user document found, creating basic info');
      const basicInfo = {
        name: user.displayName || '',
        email: user.email || '',
        createdAt: new Date().toISOString()
      };
      const updatedUser = { ...user, profile: basicInfo };
      setUser(updatedUser);
      setHasProfile(false);
      return false;
    } catch (error) {
      console.error('Error checking user profile:', error);
      setHasProfile(false);
      return false;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', { 
        hasUser: !!firebaseUser, 
        uid: firebaseUser?.uid 
      });
      
      if (firebaseUser) {
        const userWithProfile = firebaseUser as User;
        await checkUserProfile(userWithProfile);
      } else {
        console.log('No user found, resetting state');
        setUser(null);
        setHasProfile(false);
      }
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, [auth]);

  const login = async (email: string, password: string) => {
    console.log('Attempting login:', { email });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', { uid: result.user.uid });
      const hasProfile = await checkUserProfile(result.user as User);
      console.log('Profile check after login:', { hasProfile });
      
      if (!hasProfile) {
        console.log('Redirecting to profile setup');
        window.location.href = '/profile-setup';
      } else {
        console.log('Redirecting to dashboard');
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(handleAuthError(error));
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    age: number,
    grade: string
  ) => {
    console.log('Attempting registration:', { email, name });
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registration successful:', { uid: res.user.uid });
      
      const profile: UserProfile = {
        name,
        age,
        grade,
        createdAt: new Date().toISOString()
      };
      await updateUserInFirestore(res.user.uid, profile);
      const updatedUser = createUserData(res.user, profile);
      setUser(updatedUser);
      setHasProfile(true);
      console.log('Redirecting to dashboard after registration');
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(handleAuthError(error));
    }
  };

  const logout = async () => {
    console.log('Attempting logout');
    try {
      await signOut(auth);
      console.log('Logout successful');
      setUser(null);
      setHasProfile(false);
      window.location.href = "/login";
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(handleAuthError(error));
    }
  };

  const googleSignIn = async () => {
    console.log('Attempting Google sign-in');
    try {
      const provider = new GoogleAuthProvider();
      console.log('Created Google provider');
      
      // Add scopes for Google sign-in
      provider.addScope('profile');
      provider.addScope('email');
      
      console.log('Initiating sign-in popup');
      const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      console.log('Google sign-in successful:', { 
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      });

      // Check if user document exists
      const userRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.log('Creating new user document');
        // Create initial user document
        await setDoc(userRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } else {
        console.log('Updating last login for existing user');
        // Update last login
        await setDoc(userRef, {
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
      
      const hasProfile = await checkUserProfile(result.user as User);
      console.log('Profile check after Google sign-in:', { hasProfile });
      
      if (!hasProfile) {
        console.log('Redirecting to profile setup after Google sign-in');
        window.location.href = '/profile-setup';
      } else {
        console.log('Redirecting to dashboard after Google sign-in');
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked by your browser. Please allow pop-ups for this site.');
      } else {
        throw new Error(handleAuthError(error));
      }
    }
  };

  const handleProfileSubmit = async (ageStr: string, gradeStr: string) => {
    if (user) {
      try {
        const ageNum = parseInt(ageStr || "0", 10);
        const profile: UserProfile = {
          name: user.displayName || '',
          email: user.email || '',
          age: ageNum,
          grade: gradeStr || "",
          createdAt: new Date().toISOString()
        };

        await updateUserInFirestore(user.uid, profile);
        const updatedUser = { ...user, profile };
        setUser(updatedUser);
        setHasProfile(true);
        window.location.href = "/dashboard";
      } catch (error: any) {
        throw new Error(error.message || "Failed to update profile");
      }
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    console.log('Attempting to update user profile:', { profile });
    if (!user) {
      console.error('No authenticated user found');
      throw new Error('No authenticated user');
    }

    try {
      await updateUserInFirestore(user.uid, profile);
      const updatedUser = { ...user, profile };
      setUser(updatedUser);
      setHasProfile(true);
      console.log('Profile updated successfully, redirecting to dashboard');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    hasProfile,
    login,
    register,
    logout,
    googleSignIn,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      <CompleteProfile
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleProfileSubmit}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
