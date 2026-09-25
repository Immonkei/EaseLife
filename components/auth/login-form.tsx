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
          "Your email address has not been confirmed yet. Please check your inbox for the confirmation link, or disable 'Confirm email' in Supabase Authentication -> Providers -> Email."
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
    <div className="bg-white border border-slate-200/80 rounded-xl p-8 max-w-sm w-full shadow-md space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <EaseLifeLogo size={36} showTagline={true} />
        <h2 className="text-lg font-bold text-slate-900 tracking-tight pt-2">
          Sign In to Your Account
        </h2>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200/80 text-[#EE6352] text-xs rounded-lg flex items-start gap-2 leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[#235789] hover:bg-[#1b456e] text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#235789] font-semibold hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
