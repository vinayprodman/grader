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
  GoogleAuthProvider,
} from "firebase/auth";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import CompleteProfile from "../components/auth/CompleteProfile";
import { progressService } from "../services/progressService";
import { notify } from "../utils/notifications";

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
const createUserData = (firebaseUser: any, profile: UserProfile): User => {
  return {
    ...firebaseUser,
    profile,
  };
};

const checkProfileCompletion = (user: User | null): boolean => {
  if (!user || !user.profile) return false;
  return !!(
    user.profile.age &&
    user.profile.age > 0 &&
    user.profile.grade &&
    user.profile.grade.trim() !== ""
  );
};

// Helper function to update user in Firestore
const updateUserInFirestore = async (userId: string, profile: UserProfile) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        profile,
        updatedAt: serverTimestamp(),
        // Initialize progress fields
        overallScore: 0,
        averageScore: 0,
        quizCount: 0,
        totalTimeSpent: 0,
        weeklyTimeSpent: {},
        completedQuizzes: {},
        lastActive: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    notify.error("Failed to update user data");
    throw new Error("Failed to update user data");
  }
};

// Helper function to handle Firebase auth errors
const handleAuthError = (error: AuthError): string => {
  switch (error.code) {
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/email-already-in-use":
      return "An account with this email already exists";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters";
    case "auth/invalid-credential":
      return "Invalid credentials. Please check your email and password";
    case "auth/operation-not-allowed":
      return "Operation not allowed. Please contact support";
    case "auth/popup-blocked":
      return "Pop-up was blocked by your browser. Please allow pop-ups for this site";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled. Please try again";
    default:
      return error.message || "An unexpected error occurred";
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const checkUserProfile = async (user: User) => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const basicInfo = {
          name: userData.name || user.displayName || "",
          email: userData.email || user.email || "",
          createdAt: userData.createdAt || new Date().toISOString(),
        };

        if (userData.profile) {
          const updatedUser = { ...user, profile: userData.profile };
          setUser(updatedUser);
          setHasProfile(checkProfileCompletion(updatedUser));
          return true;
        } else {
          const updatedUser = { ...user, profile: basicInfo };
          setUser(updatedUser);
          setHasProfile(false);
          return false;
        }
      }

      const basicInfo = {
        name: user.displayName || "",
        email: user.email || "",
        createdAt: new Date().toISOString(),
      };
      const updatedUser = { ...user, profile: basicInfo };
      setUser(updatedUser);
      setHasProfile(false);
      return false;
    } catch (error) {
      notify.error("Error checking user profile");
      setHasProfile(false);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userWithProfile = firebaseUser as User;
        await checkUserProfile(userWithProfile);
      } else {
        setUser(null);
        setHasProfile(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  // Add global time tracking
  useEffect(() => {
    if (!user?.uid) return;

    // Start session when user logs in
    progressService.startSession(user.uid).catch(console.error);

    // Set up interval to update time spent
    const updateInterval = setInterval(async () => {
      try {
        await progressService.updateTimeSpent(user.uid, 60); // Update every minute
      } catch (error) {
        console.error("Error updating time spent:", error);
      }
    }, 60000);

    // Handle visibility change
    const handleVisibilityChange = async () => {
      try {
        if (document.visibilityState === "hidden") {
          await progressService.endSession(user.uid);
        } else {
          await progressService.startSession(user.uid);
        }
      } catch (error) {
        console.error("Error in visibility change handler:", error);
      }
    };

    // Handle before unload
    const handleBeforeUnload = async () => {
      try {
        await progressService.endSession(user.uid);
      } catch (error) {
        console.error("Error in beforeunload handler:", error);
      }
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function
    return () => {
      clearInterval(updateInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      progressService.endSession(user.uid).catch(console.error);
    };
  }, [user?.uid]);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Check if user document exists in Firestore
      const userRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        // User is authenticated but not registered in app DB
        throw new Error(
          "No account found with this email. Please sign up first."
        );
      }
      const hasProfile = await checkUserProfile(result.user as User);
      if (!hasProfile) {
        notify.info("Please complete your profile");
        navigate("/profile-setup");
      } else {
        notify.success("Successfully logged in");
        navigate("/dashboard");
      }
    } catch (error: any) {
      notify.error(handleAuthError(error));
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
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const profile: UserProfile = {
        name,
        email,
        age,
        grade,
        createdAt: new Date().toISOString(),
      };

      await updateUserInFirestore(res.user.uid, profile);
      const updatedUser = createUserData(res.user, profile);
      setUser(updatedUser);
      setHasProfile(true);
      notify.success("Registration successful");
      navigate("/dashboard");
    } catch (error: any) {
      notify.error(handleAuthError(error));
      throw new Error(handleAuthError(error));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setHasProfile(false);
      notify.success("Successfully logged out");
      navigate("/login");
    } catch (error: any) {
      notify.error(handleAuthError(error));
      throw new Error(handleAuthError(error));
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");

      const result = await signInWithPopup(
        auth,
        provider,
        browserPopupRedirectResolver
      );
      const hasProfile = await checkUserProfile(result.user as User);

      if (!hasProfile) {
        notify.info("Please complete your profile");
        navigate("/profile-setup");
      } else {
        notify.success("Successfully signed in with Google");
        navigate("/dashboard");
      }
    } catch (error: any) {
      notify.error(handleAuthError(error));
      throw new Error(handleAuthError(error));
    }
  };

  const handleProfileSubmit = async (ageStr: string, gradeStr: string) => {
    if (user) {
      try {
        const ageNum = parseInt(ageStr || "0", 10);
        const profile: UserProfile = {
          name: user.displayName || "",
          email: user.email || "",
          age: ageNum,
          grade: gradeStr || "",
          createdAt: new Date().toISOString(),
        };

        await updateUserInFirestore(user.uid, profile);
        const updatedUser = { ...user, profile };
        setUser(updatedUser);
        setHasProfile(true);
        notify.success("Profile updated successfully");
        navigate("/dashboard");
      } catch (error: any) {
        notify.error(error.message || "Failed to update profile");
        throw new Error(error.message || "Failed to update profile");
      }
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    if (!user) {
      notify.error("No authenticated user found");
      throw new Error("No authenticated user");
    }

    try {
      await updateUserInFirestore(user.uid, profile);
      const updatedUser = { ...user, profile };
      setUser(updatedUser);
      setHasProfile(true);
      notify.success("Profile updated successfully");
      navigate("/dashboard");
    } catch (error) {
      notify.error("Failed to update profile");
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
    updateUserProfile,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
