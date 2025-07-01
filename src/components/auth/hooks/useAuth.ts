"use client";
import { useState, useMemo } from "react";
import { auth } from "@/app/api/firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export function useAuth(isSignUp: boolean) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleForgotPassword = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!formData.email) {
        setError("Please enter your email");
        return false;
      }
      await sendPasswordResetEmail(auth, formData.email);
      setSuccess("A password reset link has been sent to your email.");
      return true;
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(mapFirebaseError(err.code));
      } else {
        setError("An unexpected error occurred during password reset. Please try again.");
      }
      setSuccess("");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, handleInputChange, passwordRequirements, passwordsMatch, handleAuthAction, handleForgotPassword, isLoading, error, success };
}

// Map Firebase errors to user-friendly messages
function mapFirebaseError(errorCode: string): string {
  const errorMap: Record<string, string> = {
    "auth/invalid-credential": "Invalid credentials. Please check your email and password.",
    "auth/weak-password": "The password is too weak. It should be at least 6 characters.",
    "auth/email-already-in-use": "This email address is already in use by another account.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/too-many-requests": "Too many failed login attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Please check your internet connection.",
  };
  // Default message if the error code is not in the map
  return errorMap[errorCode] || "An unexpected error occurred. Please try again.";
}