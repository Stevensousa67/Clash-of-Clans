import { AuthForm } from "@/components/auth/components/AuthForm"

export default function forgotPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AuthForm formType="forgotPassword" title="Forgot Password" subtitle="Reset your password" submitButtonText="Reset" linkText="Remembered your password?" linkUrl="/login" />
      </div>
    </div>
  )
}