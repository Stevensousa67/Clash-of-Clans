import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const baseUrl = `${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}`;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="archer@email.com" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              {/* Uncomment and implement the "Sign in with... " feature when project gains userbase to justify the feature. */}

              {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <Image src={`${baseUrl}svgs/Apple.svg`} alt="Apple logo" width={24} height={24} className="w-6 h-6"/>
                  <span className="sr-only">Login with Apple</span>
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <Image src={`${baseUrl}svgs/Google.svg`} alt="Google logo" width={24} height={24} className="w-6 h-6"/>
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <Image src={`${baseUrl}svgs/Microsoft.svg`} alt="Meta logo" width={24} height={24} className="w-6 h-6"/>
                  <span className="sr-only">Login with Microsoft</span>
                </Button>
              </div> */}

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signUp" className="underline underline-offset-4">Sign Up</Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Link href="/">
              <Image src={`${baseUrl}wallpapers/CoC+Logo.jpeg`} alt="Login Image" width={500} height={500} className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
