"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/app/api/firebase/config"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const baseUrl = `${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}`;

interface AuthFormProps extends React.ComponentProps<"div"> {
  formType?: "login" | "signup";
  title: string;
  subtitle: string;
  submitButtonText: string;
  linkText: string;
  linkUrl: string;
  showForgotPassword?: boolean;
}

export function AuthForm({ className, formType, title, subtitle, submitButtonText, linkText, linkUrl, showForgotPassword = false, ...props }: AuthFormProps) {
  const wallpaper = `${baseUrl}wallpapers/CoC+Logo.jpeg`;
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [showPasswordMatch, setShowPasswordMatch] = useState(false);

  // Password validation functions
  const validatePassword = (password: string) => {
    return {
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      hasMinLength: password.length >= 12
    };
  };

  const passwordRequirements = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  // Password match validation
  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordMatchStatus = formData.confirmPassword.length > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === "confirm-password" ? "confirmPassword" : id]: value
    }));

    // Show password requirements when user focuses on password field during signup
    if (id === "password" && formType === "signup") {
      setShowPasswordRequirements(value.length > 0);
    }

    // Show password match indicator when user types in confirm password field
    if (id === "confirm-password" && formType === "signup") {
      setShowPasswordMatch(value.length > 0);
    }

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validation
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all required fields");
      }

      if (formType === "signup") {
        if (!formData.confirmPassword) {
          throw new Error("Please confirm your password");
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (!isPasswordValid) {
          throw new Error("Password does not meet all requirements");
        }
      }

      // Firebase authentication
      if (formType === "signup") {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }

      // Redirect to home page on success
      router.push("/");
    } catch (error: unknown) {
      console.error("Authentication error:", error);

      // Handle Firebase-specific error messages
      let errorMessage = "An error occurred. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;

        // Handle Firebase-specific error codes
        if ('code' in error) {
          const firebaseError = error as { code: string };
          switch (firebaseError.code) {
            case "auth/email-already-in-use":
              errorMessage = "An account with this email already exists";
              break;
            case "auth/weak-password":
              errorMessage = "Password is too weak";
              break;
            case "auth/invalid-email":
              errorMessage = "Invalid email address";
              break;
            case "auth/user-not-found":
              errorMessage = "No account found with this email";
              break;
            case "auth/wrong-password":
              errorMessage = "Incorrect password";
              break;
            case "auth/invalid-credential":
              errorMessage = "Invalid email or password";
              break;
            default:
              errorMessage = "An error occurred. Please try again.";
          }
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground text-balance">{subtitle}</p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="archer@email.com" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="ml-auto text-sm underline-offset-2 hover:underline">
                    {showForgotPassword ? "Forgot your password?" : ""}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => formType === "signup" && setShowPasswordRequirements(true)}
                    onBlur={() => formType === "signup" && setShowPasswordRequirements(false)}
                    required
                  />

                  {/* Password Requirements Popup - Positioned to the side */}
                  {formType === "signup" && showPasswordRequirements && (
                    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-80 p-4 bg-card border border-border rounded-md shadow-lg z-10 text-sm lg:block hidden">
                      <p className="font-medium mb-3 text-foreground">Password Requirements:</p>
                      <div className="space-y-2">
                        <div className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${passwordRequirements.hasMinLength ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                            {passwordRequirements.hasMinLength ? '✓' : ''}
                          </div>
                          At least 12 characters long
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${passwordRequirements.hasUppercase ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                            {passwordRequirements.hasUppercase ? '✓' : ''}
                          </div>
                          At least one uppercase letter (A-Z)
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${passwordRequirements.hasLowercase ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                            {passwordRequirements.hasLowercase ? '✓' : ''}
                          </div>
                          At least one lowercase letter (a-z)
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${passwordRequirements.hasNumber ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                            {passwordRequirements.hasNumber ? '✓' : ''}
                          </div>
                          At least one number (0-9)
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${passwordRequirements.hasSpecialChar ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                            {passwordRequirements.hasSpecialChar ? '✓' : ''}
                          </div>
                          At least one special character (!@#$%^&*...)
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-border">
                        <div className={`text-xs font-medium ${isPasswordValid ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          Password Strength: {isPasswordValid ? 'Strong ✓' : 'Weak'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Password Requirements - Below input on small screens */}
                  {formType === "signup" && showPasswordRequirements && (
                    <div className="mt-2 p-4 bg-card border border-border rounded-md text-sm lg:hidden">
                      <p className="font-medium mb-3 text-foreground">Password Requirements:</p>
                      <div className="space-y-2">
                        <div className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${passwordRequirements.hasMinLength ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                            {passwordRequirements.hasMinLength ? '✓' : ''}
                          </div>
                          At least 12 characters long
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${passwordRequirements.hasUppercase ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                            {passwordRequirements.hasUppercase ? '✓' : ''}
                          </div>
                          At least one uppercase letter (A-Z)
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${passwordRequirements.hasLowercase ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                            {passwordRequirements.hasLowercase ? '✓' : ''}
                          </div>
                          At least one lowercase letter (a-z)
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${passwordRequirements.hasNumber ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                            {passwordRequirements.hasNumber ? '✓' : ''}
                          </div>
                          At least one number (0-9)
                        </div>
                        <div className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${passwordRequirements.hasSpecialChar ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                            {passwordRequirements.hasSpecialChar ? '✓' : ''}
                          </div>
                          At least one special character (!@#$%^&*...)
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-border">
                        <div className={`text-xs font-medium ${isPasswordValid ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          Password Strength: {isPasswordValid ? 'Strong ✓' : 'Weak'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {formType === "signup" && (
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onFocus={() => setShowPasswordMatch(true)}
                      onBlur={() => setShowPasswordMatch(false)}
                      required
                    />

                    {/* Password Match Indicator */}
                    {showPasswordMatch && showPasswordMatchStatus && (
                      <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-64 p-3 bg-card border border-border rounded-md shadow-lg z-10 text-sm lg:block hidden">
                        <div className={`flex items-center gap-2 transition-colors ${passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${passwordsMatch ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'}`}>
                            {passwordsMatch ? '✓' : '✗'}
                          </div>
                          {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                        </div>
                      </div>
                    )}

                    {/* Mobile Password Match Indicator */}
                    {showPasswordMatch && showPasswordMatchStatus && (
                      <div className="mt-2 p-3 bg-card border border-border rounded-md text-sm lg:hidden">
                        <div className={`flex items-center gap-2 transition-colors ${passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${passwordsMatch ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'}`}>
                            {passwordsMatch ? '✓' : '✗'}
                          </div>
                          {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <Button type="submit" className="w-1/3 mx-auto" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Loading..." : submitButtonText}
              </Button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Uncomment and implement the "Sign in with... " feature when project gains userbase to justify the feature. */}

              {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <Image src={`${baseUrl}svgs/Apple.svg`} alt="Apple logo" width={24} height={24} className="w-6 h-6" />
                  <span className="sr-only">Login with Apple</span>
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <Image src={`${baseUrl}svgs/Google.svg`} alt="Google logo" width={24} height={24} className="w-6 h-6" />
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <Image src={`${baseUrl}svgs/Microsoft.svg`} alt="Meta logo" width={24} height={24} className="w-6 h-6" />
                  <span className="sr-only">Login with Microsoft</span>
                </Button>
              </div> */}

              <div className="text-center text-sm">
                {linkText}{" "}
                <Link href={linkUrl} className="underline underline-offset-4">
                  {formType === "login" ? "Sign Up" : "Login"}
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Link href="/">
              <Image src={wallpaper} alt="Wallpaper Image" width={500} height={500} className="absolute inset-0 h-full w-full object-cover" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
