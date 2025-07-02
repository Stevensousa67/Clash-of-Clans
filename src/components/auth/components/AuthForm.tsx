"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { Popup } from "@/components/auth/components/Popup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePasswordValidation } from "@/components/auth/hooks/usePasswordValidation";

const baseUrl = `${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}`;

interface AuthFormProps extends React.ComponentProps<"div"> {
  formType?: "login" | "signup" | "forgotPassword";
  title: string;
  subtitle: string;
  submitButtonText: string;
  linkText: string;
  linkUrl: string;
  showForgotPassword?: boolean;
}

export function AuthForm({ className, formType = "login", title, subtitle, submitButtonText, linkText, linkUrl, showForgotPassword = false, ...props }: AuthFormProps) {
  const wallpaper = `${baseUrl}wallpapers/CoC+Logo.jpeg`;
  const { 
    loginWithEmail, 
    signUpWithEmail, 
    resetPassword, 
    loginWithGoogle,
    isLoading, 
    error,
    clearError
  } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { passwordRequirements, passwordsMatch } = usePasswordValidation(password, confirmPassword);
  
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [showPasswordMatch, setShowPasswordMatch] = useState(false);

  const isSignUp = formType === "signup";
  const isForgotPassword = formType === "forgotPassword";

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-right",
        onDismiss: () => clearError(),
      });
    }
  }, [error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;

    if (isForgotPassword) {
      success = await resetPassword(email);
      if (success) {
        toast.success("A password reset link has been sent to your email.", {
          position: "bottom-right",
        });
      }
      return;
    }

    if (isSignUp) {
        if(password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
      success = await signUpWithEmail(email, password);
    } else {
      success = await loginWithEmail(email, password);
    }

    if (success) {
      router.push("/");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground text-balance">{subtitle}</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="archer@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              {!isForgotPassword && (
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {showForgotPassword && (
                      <Link href="/forgotPassword" className="ml-auto text-sm underline-offset-2 hover:underline">
                        Forgot your password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => isSignUp && setShowPasswordRequirements(true)} onBlur={() => isSignUp && setShowPasswordRequirements(false)} required={!isForgotPassword} />
                    <Popup type="requirements" requirements={passwordRequirements} isOpen={showPasswordRequirements} />
                  </div>
                </div>
              )}
              {isSignUp && (
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onFocus={() => setShowPasswordMatch(true)} onBlur={() => setShowPasswordMatch(false)} required={isSignUp} />
                    <Popup type="match" isMatch={passwordsMatch} isOpen={showPasswordMatch} />
                  </div>
                </div>
              )}
              <Button type="submit" className="w-1/3 mx-auto" disabled={isLoading}>
                {isLoading ? "Loading..." : submitButtonText}
              </Button>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" className="w-full" onClick={() => toast.info("This feature is not implemented yet.")}>
                  <Image src={`${baseUrl}svgs/Apple.svg`} alt="Apple logo" width={24} height={24} className="w-6 h-6 dark:invert" />
                  <span className="sr-only">Login with Apple</span>
                </Button>
                <Button variant="outline" type="button" className="w-full" onClick={loginWithGoogle}>
                  <Image src={`${baseUrl}svgs/Google.svg`} alt="Google logo" width={24} height={24} className="w-6 h-6" />
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button variant="outline" type="button" className="w-full" onClick={() => toast.info("This feature is not implemented yet.")}>
                  <Image src={`${baseUrl}svgs/Microsoft.svg`} alt="Meta logo" width={24} height={24} className="w-6 h-6" />
                  <span className="sr-only">Login with Microsoft</span>
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {linkText}{" "}
                <Link href={linkUrl} className="font-semibold text-primary hover:underline">
                  {formType === "login" ? "Sign up" : "Login"}
                </Link>
              </p>
            </div>
          </form>
          <div className="hidden md:block relative">
            <Image src={wallpaper} alt="Clash of Clans Wallpaper" layout="fill" objectFit="cover" className="absolute inset-0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}