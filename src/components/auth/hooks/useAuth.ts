// useAuth.ts
"use client";
import { useState, useMemo } from "react";
import { auth } from "@/app/api/firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export function useAuth(isSignUp: boolean) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "confirm-password" ? "confirmPassword" : id]: value,
    }));
    if (error) setError("");
  };

  const passwordRequirements = useMemo(() => [
    { id: "length", text: "At least 12 characters long", met: formData.password.length >= 12 },
    { id: "uppercase", text: "At least one uppercase letter", met: /[A-Z]/.test(formData.password) },
    { id: "lowercase", text: "At least one lowercase letter", met: /[a-z]/.test(formData.password) },
    { id: "number", text: "At least one number", met: /[0-9]/.test(formData.password) },
    { id: "special", text: "At least one special character", met: /[^A-Za-z0-9]/.test(formData.password) },
  ], [formData.password]);

  const passwordsMatch = useMemo(() => {
    if (!isSignUp || formData.confirmPassword.length === 0) return null;
    return formData.password === formData.confirmPassword;
  }, [formData.password, formData.confirmPassword, isSignUp]);

  const handleAuthAction = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }
      return true;
    } catch (error) {
      setError(error instanceof Error ? mapFirebaseError(error.message) : "An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, handleInputChange, passwordRequirements, passwordsMatch, handleAuthAction, isLoading, error };
}

// Map Firebase errors to user-friendly messages
function mapFirebaseError(message: string): string {
  const errorMap: Record<string, string> = {
    "auth/invalid-email": "Invalid email format",
    "auth/weak-password": "Password is too weak",
    "auth/email-already-in-use": "Email is already registered",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
  };
  return errorMap[message] || "An error occurred. Please try again.";
}