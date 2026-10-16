"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, CheckCircle2, Lock, Shield } from "lucide-react";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError("Authentication service is not configured.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2500);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F2F4F4] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#161B20] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#9CA6B2] hover:text-[#C8F36B] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO PORTFOLIO
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#1E242B] border border-white/10 flex items-center justify-center text-[#D9323E]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display">Update Password</h1>
            <p className="text-xs text-[#9CA6B2]">Set a new password for your account</p>
          </div>
        </div>

        {success ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Password updated successfully!</p>
              <p className="text-xs text-emerald-400/80 mt-1">Redirecting you to the portfolio...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-[#9CA6B2] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#0B0D10] border border-white/10 rounded-lg text-sm text-[#F2F4F4] placeholder-[#5C6470] focus:outline-none focus:border-[#C8F36B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9CA6B2] mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#0B0D10] border border-white/10 rounded-lg text-sm text-[#F2F4F4] placeholder-[#5C6470] focus:outline-none focus:border-[#C8F36B] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#D9323E] hover:bg-[#BF2430] text-white font-bold rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(217,50,62,0.3)] disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save New Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
