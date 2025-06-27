import { AuthForm } from "@/components/AuthForm"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-10 mt-45">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AuthForm formType="login" title="Welcome back!" subtitle="Login to your account" submitButtonText="Login" linkText="Don't have an account?" linkUrl="/signup" showForgotPassword={true} />
      </div>
    </div>
  )
}
