"use client"

import { GitBranchMinus, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GithubIcon } from "@/components/ui/icons/KinetoIcons"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6">
      
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose your preferred method to continue
          </p>
        </div>

        {/* Glass Card */}
        <div className="rounded-2xl border bg-background/60 backdrop-blur-xl shadow-xl p-6 space-y-4">
          
          {/* Social Buttons */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl"
            >
              <GithubIcon className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 rounded-xl"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35 11.1H12v2.8h5.4c-.23 1.4-1.4 4.1-5.4 4.1-3.25 0-5.9-2.7-5.9-6s2.65-6 5.9-6c1.85 0 3.1.8 3.8 1.5l2.6-2.5C16.85 3.7 14.7 3 12 3 6.95 3 3 7 3 12s3.95 9 9 9c5.2 0 8.65-3.65 8.65-8.8 0-.6-.05-1-.15-1.1Z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            OR
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Magic Link */}
          <form className="space-y-3">
            <Input
              type="email"
              placeholder="you@example.com"
              className="h-11 rounded-xl"
              required
            />

            <Button className="w-full h-11 rounded-xl">
              <Mail className="mr-2 h-4 w-4" />
              Send Magic Link
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}