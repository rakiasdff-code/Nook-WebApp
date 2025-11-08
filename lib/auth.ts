"use client";

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendEmailVerification,
  reload
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  subscription: "free" | "premium";
}

/**
 * Sign up a new user with email and password
 * Sends email verification automatically
 * NOTA: El perfil de Firestore se crea DESPUÉS de verificar el email
 */
export async function signUp(email: string, password: string, displayName: string) {
  try {
    console.log("[Auth] Creando usuario en Firebase...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("[Auth] Usuario creado:", user.uid);

    // Update user profile with display name
    console.log("[Auth] Actualizando perfil...");
    await updateProfile(user, { displayName });
    console.log("[Auth] Perfil actualizado");

    // Send email verification (SIN parámetros adicionales)
    console.log("[Auth] Enviando email de verificación...");
    try {
      await sendEmailVerification(user);
      console.log("[Auth] ✅ Email de verificación enviado exitosamente a:", email);
      console.log("[Auth] ℹ️ El usuario debe revisar su bandeja de entrada");
    } catch (emailError: any) {
      console.error("[Auth] ❌ ERROR al enviar email:", emailError);
      console.error("[Auth] Error code:", emailError.code);
      console.error("[Auth] Error message:", emailError.message);
      // Lanzar error para que el usuario sepa que hay un problema
      throw new Error("No se pudo enviar el email de verificación. Código: " + emailError.code);
    }

    // NO crear perfil en Firestore aquí
    // Se creará después de verificar el email
    console.log("[Auth] ⚠️ Perfil de Firestore se creará después de verificar email");

    return user;
  } catch (error: any) {
    console.error("[Auth] Error en signUp:", error);
    console.error("[Auth] Error code:", error.code);
    console.error("[Auth] Error message:", error.message);
    
    // Re-throw the original error to preserve error codes
    throw error;
  }
}

/**
 * Resend email verification
 */
export async function resendVerificationEmail() {
  try {
    if (!auth.currentUser) {
      throw new Error("No hay usuario autenticado");
    }
    
    console.log("[Auth] Reenviando email de verificación a:", auth.currentUser.email);
    await sendEmailVerification(auth.currentUser);
    console.log("[Auth] ✅ Email reenviado exitosamente");
  } catch (error: any) {
    console.error("[Auth] ❌ Error reenviando email:", error);
    console.error("[Auth] Error code:", error.code);
    throw error;
  }
}

/**
 * Check if email is verified (reloads user first)
 */
export async function checkEmailVerified(): Promise<boolean> {
  try {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      return auth.currentUser.emailVerified;
    }
    return false;
  } catch (error: any) {
    console.error("Error checking email verification:", error);
    return false;
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw new Error(error.message || "Failed to sign in");
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw new Error(error.message || "Failed to sign out");
  }
}

/**
 * Create user profile in Firestore (called after email verification)
 */
export async function createUserProfile(user: User): Promise<UserProfile> {
  try {
    console.log("[Auth] Creando perfil en Firestore para:", user.uid);
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      createdAt: new Date(),
      subscription: "free",
    };

    await setDoc(doc(db, "users", user.uid), userProfile);
    console.log("[Auth] ✅ Perfil creado en Firestore");
    
    return userProfile;
  } catch (error: any) {
    console.error("[Auth] ❌ Error creando perfil:", error);
    throw error;
  }
}

/**
 * Get the current user's profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error: any) {
    console.error("Error getting user profile:", error);
    throw new Error(error.message || "Failed to get user profile");
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

