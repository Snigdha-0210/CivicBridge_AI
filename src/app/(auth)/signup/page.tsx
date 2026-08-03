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

export default function SignupPage() {
  const router = useRouter();
  const { user, loading, signUpEmail, signInGoogle, firebaseReady } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState<"email" | "google" | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/onboarding");
    }
  }, [user, loading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSubmitting("email");
    try {
      await signUpEmail(name.trim(), email.trim(), password);
      toast.success("Account created! Complete your profile to get started.");
      router.push("/onboarding");
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
      router.push("/onboarding");
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
        <CardTitle className="text-xl font-semibold">Create account</CardTitle>
        <CardDescription>
          Join CivicBridge to discover opportunities matched to you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Aarav Sharma"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={busy}
              className="h-10"
            />
          </div>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={busy}
              className="h-10"
            />
          </div>
          <Button type="submit" className="h-10 w-full" disabled={busy}>
            {submitting === "email" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create account"
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
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
