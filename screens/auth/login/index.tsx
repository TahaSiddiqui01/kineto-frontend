"use client"

import { Mail, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GithubIcon, GoogleIcon } from "@/components/ui/icons/KinetoIcons"
import { useAuth } from "@/hooks/use-auth"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { createMagicLink, googleAuth, githubAuth } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  function onSubmit(data: LoginFormValues) {
    createMagicLink.mutate({
      email: data.email,
      url: `${window.location.origin}/api/v1/auth/callback/success`,
    })
  }

  const oauthPending = googleAuth.isPending || githubAuth.isPending

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
              disabled={oauthPending}
              onClick={() => githubAuth.mutate()}
            >
              {githubAuth.isPending
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <GithubIcon className="mr-2 h-4 w-4" />}
              Continue with GitHub
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 rounded-xl"
              disabled={oauthPending}
              onClick={() => googleAuth.mutate()}
            >
              {googleAuth.isPending
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <GoogleIcon />}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-11 rounded-xl"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive px-1">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl"
              disabled={createMagicLink.isPending}
            >
              {createMagicLink.isPending
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <Mail className="mr-2 h-4 w-4" />}
              {createMagicLink.isPending ? "Sending…" : "Send Magic Link"}
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
