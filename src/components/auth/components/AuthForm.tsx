"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/hooks/useAuth";
import { Popup } from "@/components/auth/components/Popup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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

export function AuthForm({ className, formType = "login", title, subtitle, submitButtonText, linkText, linkUrl, showForgotPassword = false, ...props }: AuthFormProps) {
  const wallpaper = `${baseUrl}wallpapers/CoC+Logo.jpeg`;
  const router = useRouter();
  const { formData, handleInputChange, passwordRequirements, passwordsMatch, handleAuthAction, isLoading, error } = useAuth(formType === "signup");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [showPasswordMatch, setShowPasswordMatch] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleAuthAction();
    if (success) router.push("/");
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
                <Input id="email" type="email" placeholder="archer@email.com" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {showForgotPassword && (
                    <Link href="/forgot-password" className="ml-auto text-sm underline-offset-2 hover:underline">
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Input id="password" type="password" value={formData.password} onChange={handleInputChange} onFocus={() => formType === "signup" && setShowPasswordRequirements(true)} onBlur={() => formType === "signup" && setShowPasswordRequirements(false)} required />
                  <Popup type="requirements" requirements={passwordRequirements} isOpen={showPasswordRequirements} />
                </div>
              </div>
              {formType === "signup" && (
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input id="confirm-password" type="password" value={formData.confirmPassword} onChange={handleInputChange} onFocus={() => setShowPasswordMatch(true)} onBlur={() => setShowPasswordMatch(false)} required />
                    <Popup type="match" isMatch={passwordsMatch} isOpen={showPasswordMatch} />
                  </div>
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : submitButtonText}
              </Button>
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