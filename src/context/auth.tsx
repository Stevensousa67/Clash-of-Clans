"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";

// Helper to map Firebase errors to user-friendly messages
function mapFirebaseError(errorCode: string): string {
    const errorMap: Record<string, string> = {
        "auth/invalid-credential": "Invalid credentials. Please check your email and password.",
        "auth/weak-password": "The password is too weak. It should be at least 6 characters.",
        "auth/email-already-in-use": "This email address is already in use by another account.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/too-many-requests": "Too many failed login attempts. Please try again later.",
        "auth/network-request-failed": "Network error. Please check your internet connection.",
    };
    return errorMap[errorCode] || "An unexpected error occurred. Please try again.";
}

type AuthContextType = {
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<boolean>;
    signUpWithEmail: (email: string, pass: string) => Promise<boolean>;
    resetPassword: (email: string) => Promise<boolean>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user ?? null);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const clearError = () => setError(null);

    const logout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
            toast.success("Successfully logged out!");
        } catch {
            toast.error("Failed to log out. Please try again.");
        }
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        setIsLoading(true);
        try {
            await signInWithPopup(auth, provider);
            router.push("/");
            toast.success("Successfully logged in with Google!");
        } catch {
            toast.error("Failed to login with Google. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthOperation = async (operation: Promise<unknown>): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            await operation;
            return true;
        } catch (err) {
            if (err instanceof FirebaseError) {
                setError(mapFirebaseError(err.code));
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const signUpWithEmail = async (email: string, pass: string) => {
        return handleAuthOperation(createUserWithEmailAndPassword(auth, email, pass));
    };

    const loginWithEmail = async (email: string, pass: string) => {
        return handleAuthOperation(signInWithEmailAndPassword(auth, email, pass));
    };

    const resetPassword = async (email: string) => {
        return handleAuthOperation(sendPasswordResetEmail(auth, email));
    };

    return (
        <AuthContext.Provider value={{ currentUser, isLoading, error, logout, loginWithGoogle, loginWithEmail, signUpWithEmail, resetPassword, clearError }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};