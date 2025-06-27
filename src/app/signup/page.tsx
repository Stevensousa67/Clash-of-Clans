import { AuthForm } from "@/components/AuthForm"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-10 mt-35">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AuthForm formType="signup" title="Create an account" subtitle="Signup to get started" submitButtonText="Sign Up" linkText="Already have an account?" linkUrl="/login" />
      </div>
    </div>
  )
}
