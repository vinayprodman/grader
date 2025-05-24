import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAzCeiPaiDSsnggHDHkTnxgFW6wG1gBShU",
  authDomain: "grader-a2085.firebaseapp.com",
  projectId: "grader-a2085",
  storageBucket: "grader-a2085.firebasestorage.app",
  messagingSenderId: "80518260051",
  appId: "1:80518260051:web:272fbdb313d5e1d7e56da6",
  measurementId: "G-6FYXP2WVJX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// User Profile Interface
export interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
  age?: number;
  grade?: string;
}

// Initial User Data Structure
export interface UserData {
  profile: UserProfile;
  updatedAt: Date;
  overallScore: number;
  averageScore: number;
  quizCount: number;
  totalTimeSpent: number;
  weeklyTimeSpent: Record<string, number>;
  completedQuizzes: Record<string, {
    score: number;
    completedAt: string;
  }>;
  lastActive: Date;
}

// Auth Context Configuration
export const AUTH_STORAGE_KEY = 'auth_user';
export const AUTH_PERSISTENCE = 'local'; // or 'session' or 'none' 