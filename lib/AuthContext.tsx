"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import { onAuthChange, UserProfile } from "./auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUnsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      
      if (!firebaseUser) {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => authUnsubscribe();
  }, []);

  // Separate effect for real-time profile updates
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data() as UserProfile);
        } else {
          // If profile doesn't exist, create a basic one
          setUserProfile({
            uid: user.uid,
            email: user.email || "",
            displayName: user.email?.split("@")[0] || "Reader",
            subscription: "free",
            createdAt: new Date(),
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error loading user profile:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

