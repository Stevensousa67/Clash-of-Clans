"use client";
import { useMemo } from "react";

export function usePasswordValidation(password: string, confirmPassword?: string) {
  const passwordRequirements = useMemo(() => {
    return [
      { id: "length", text: "At least 12 characters long", met: password.length >= 12 },
      { id: "uppercase", text: "At least one uppercase letter", met: /[A-Z]/.test(password) },
      { id: "lowercase", text: "At least one lowercase letter", met: /[a-z]/.test(password) },
      { id: "number", text: "At least one number", met: /[0-9]/.test(password) },
      { id: "special", text: "At least one special character", met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const passwordsMatch = useMemo(() => {
    if (confirmPassword === undefined) {
      return null;
    }
    // Only show match status if confirm password has been touched
    if (confirmPassword.length === 0) {
        return null;
    }
    return password === confirmPassword;
  }, [password, confirmPassword]);

  return { passwordRequirements, passwordsMatch };
}
