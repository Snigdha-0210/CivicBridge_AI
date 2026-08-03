"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AuthDivider,
  getAuthErrorMessage,
  GoogleSignInButton,
} from "../_components/auth-shared";

export default function LoginPage() {
  const router = useRouter();
  const { user, profile, loading, signInEmail, signInGoogle, firebaseReady } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState<"email" | "google" | null>(null);
  const [awaitingProfile, setAwaitingProfile] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    if (awaitingProfile && !profile) return;

    if (profile && !profile.profileComplete) {
      router.replace("/onboarding");
    } else if (profile) {
      router.replace("/dashboard");
    }
  }, [user, profile, loading, router, awaitingProfile]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setSubmitting("email");
    try {
      await signInEmail(email.trim(), password);
      toast.success("Welcome back!");
      setAwaitingProfile(true);
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setSubmitting(null);
    }
  };

  const handleGoogle = async () => {
    setSubmitting("google");
    try {
      await signInGoogle();
      toast.success("Signed in with Google");
      setAwaitingProfile(true);
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setSubmitting(null);
    }
  };

  if (loading || user) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const busy = submitting !== null;

  return (
    <Card className="border-border/60 shadow-lg shadow-slate-900/5">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-xl font-semibold">Sign in</CardTitle>
        <CardDescription>
          Access your personalized civic opportunity dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              className="h-10"
            />
          </div>
          <Button type="submit" className="h-10 w-full" disabled={busy}>
            {submitting === "email" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <AuthDivider />

        <div className="space-y-3">
          <GoogleSignInButton onClick={handleGoogle} loading={submitting === "google"} />
          {!firebaseReady && (
            <p className="text-center text-xs text-muted-foreground">
              Firebase is not configured. Add keys to `.env.local` to enable live auth.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-center border-t-0 pt-0">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
