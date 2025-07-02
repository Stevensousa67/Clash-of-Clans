"use client"
import * as React from "react"
import Link from "next/link"
import { auth } from "@/app/api/firebase/config"
import { UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/components/auth/hooks/useCurrentUser"

export function ProfileToggle() {
  const { user, loading } = useCurrentUser()

  if (loading) {
    return (
      <Button variant="outline" size="icon" disabled>
        <UserRound className="h-[1.2rem] w-[1.2rem] animate-pulse" />
        <span className="sr-only">Loading User Profile</span>
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <UserRound className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">User Profile</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {user ? (
            <>
                <DropdownMenuItem asChild>
                    <Link href="/account">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => auth.signOut()}>Sign Out</DropdownMenuItem>
            </>
        ) : (
            <>
                <DropdownMenuItem asChild>
                    <Link href="/login">Log In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/signup">Sign Up</Link>
                </DropdownMenuItem>
            </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}