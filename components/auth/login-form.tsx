"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

export function LoginForm() {
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email:    String(fd.get("email")),
        password: String(fd.get("password")),
      });
      if (signInError) { setError(signInError.message); return; }
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Branding */}
      <div className="mb-7 text-center">
        <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-lg bg-[hsl(var(--primary))]">
          <ChefHat className="size-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">Spice Table</h1>
        <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">Sign in to your account</p>
      </div>

      {/* Form card */}
      <div className="rounded-lg border border-[hsl(var(--border))] bg-white p-6 shadow-sm">
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <label htmlFor="login-email" className="text-xs font-semibold text-[hsl(var(--foreground))]">
              Email address
            </label>
            <Input id="login-email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="login-password" className="text-xs font-semibold text-[hsl(var(--foreground))]">
              Password
            </label>
            <Input id="login-password" name="password" type="password" placeholder="••••••••" required />
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
            Sign In
          </Button>
        </form>
      </div>

      <p className="mt-4 text-center text-xs text-[hsl(var(--muted-foreground))]">
        Contact your administrator to get an account.
      </p>
    </div>
  );
}
