"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { X, Key, Database, ShieldCheck, Check } from "lucide-react";

export default function SetupNoticeModal() {
  const { setupNoticeOpen, setSetupNoticeOpen } = useAuth();
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSetupNoticeOpen(false);
    }
    if (setupNoticeOpen) {
      window.addEventListener("keydown", handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [setupNoticeOpen, setSetupNoticeOpen]);

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const envSnippet = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`;

  return (
    <AnimatePresence>
      {setupNoticeOpen && (
        <motion.div
          key="setup-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
          onClick={() => setSetupNoticeOpen(false)}
        >
          <motion.div
            key="setup-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="relative z-10 max-w-xl w-full bg-[#161B20] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-[#F2F4F4]">
                    Supabase Credentials Required
                  </h3>
                  <p className="font-mono text-xs text-[#9CA6B2]">
                    Configure real authentication &amp; database
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSetupNoticeOpen(false)}
                className="ios-press w-8 h-8 rounded-full bg-[#1E242B] hover:bg-[#D9323E] hover:text-white text-[#F2F4F4] flex items-center justify-center transition-colors"
                aria-label="Close setup modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#9CA6B2] leading-relaxed">
              <p>
                The portfolio features <strong className="text-[#F2F4F4]">real Supabase Auth</strong> and <strong className="text-[#F2F4F4]">PostgreSQL storage</strong> with Row Level Security. Follow these steps to connect your project:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-[#0B0D10] rounded-xl border border-white/[0.06] space-y-2">
                  <div className="font-mono text-xs text-[#C8F36B] font-bold flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Step 1: Create .env.local
                  </div>
                  <p>Add your project URL and publishable anon key to <code className="text-[#F2F4F4]">.env.local</code>:</p>
                  <div className="relative mt-2">
                    <pre className="p-3 bg-[#161B20] rounded-lg font-mono text-[11px] text-[#F2F4F4] overflow-x-auto">
                      {envSnippet}
                    </pre>
                    <button
                      type="button"
                      onClick={() => handleCopy(envSnippet, "env")}
                      className="ios-press absolute right-2 top-2 px-2 py-1 bg-[#1E242B] hover:bg-[#252C35] rounded font-mono text-[10px] text-[#F2F4F4] flex items-center gap-1 border border-white/10"
                    >
                      {copiedKey === "env" ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                      <span>{copiedKey === "env" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#0B0D10] rounded-xl border border-white/[0.06] space-y-1">
                  <div className="font-mono text-xs text-[#72D9BC] font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Step 2: Apply SQL Migration
                  </div>
                  <p>
                    In your Supabase Dashboard, open <strong>SQL Editor</strong> and run the script located at:
                    <br />
                    <code className="text-[#D9323E]">supabase/migrations/20261014000000_init_auth_guestbook.sql</code>
                  </p>
                </div>

                <div className="p-3 bg-[#0B0D10] rounded-xl border border-white/[0.06] space-y-1">
                  <div className="font-mono text-xs text-[#D9323E] font-bold">
                    Step 3: Enable Google / Email Providers
                  </div>
                  <p>
                    Under <strong>Authentication &gt; Providers</strong>, enable Google OAuth and Email. See <code className="text-[#F2F4F4]">supabase/README.md</code> for exact Google Cloud Client ID &amp; redirect URI configuration.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSetupNoticeOpen(false)}
                className="ios-press px-5 py-2.5 bg-[#D9323E] hover:bg-[#BF2430] text-white font-display text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Understood
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
