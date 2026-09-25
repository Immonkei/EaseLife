"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Loader2 } from "lucide-react";
import { EaseLifeLogo } from "@/components/brand/logo";

export function LoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      if (signInError.message.toLowerCase().includes("email not confirmed")) {
        setError(
          "Your email address has not been confirmed yet. Please check your email inbox for the confirmation link, or disable 'Confirm email' in your Supabase Dashboard under Authentication -> Providers -> Email."
        );
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-8 max-w-md w-full shadow-sm space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <EaseLifeLogo size={44} showTagline={true} />
        <h2 className="text-xl font-bold text-[#235789] tracking-tight pt-2">
          Sign In to Your Account
        </h2>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-[var(--danger)] text-xs rounded-xl flex items-start gap-2.5 leading-relaxed font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[var(--primary)] text-white font-semibold text-sm rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="text-center text-xs text-[var(--foreground-muted)]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[var(--primary)] font-semibold hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
