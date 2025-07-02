"use client"
import * as React from "react"
import Link from "next/link"
import { UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth"

export function ProfileToggle() {
  const { currentUser, isLoading, logout } = useAuth()

  if (isLoading) {
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
        {currentUser ? (
            <>
                <DropdownMenuItem asChild>
                    <Link href="/account">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
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