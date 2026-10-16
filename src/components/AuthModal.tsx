"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { X, Lock, Mail, User as UserIcon, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
  } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "reset">(authModalTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Sync tab if modal opens with a specific default tab
  useEffect(() => {
    setActiveTab(authModalTab);
    setError(null);
    setSuccessNotice(null);
  }, [authModalTab, isAuthModalOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAuthModal();
    }
    if (isAuthModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAuthModalOpen, closeAuthModal]);

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);
    const { error: googleError } = await signInWithGoogle();
    setLoading(false);
    if (googleError) {
      setError(googleError.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setLoading(true);

    if (activeTab === "signin") {
      const { error: signinError } = await signInWithEmail(email, password);
      setLoading(false);
      if (signinError) {
        setError(signinError.message);
      }
    } else if (activeTab === "signup") {
      if (!displayName.trim()) {
        setError("Please enter your display name.");
        setLoading(false);
        return;
      }
      const { error: signupError } = await signUpWithEmail(email, password, displayName);
      setLoading(false);
      if (signupError) {
        setError(signupError.message);
      } else {
        setSuccessNotice(t("auth_email_verification_notice"));
      }
    } else if (activeTab === "reset") {
      const { error: resetError } = await sendPasswordReset(email);
      setLoading(false);
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccessNotice(t("auth_reset_sent_notice"));
      }
    }
  }

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          key="auth-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
          onClick={closeAuthModal}
        >
          <motion.div
            key="auth-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="relative z-10 max-w-md w-full bg-[#161B20] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E242B] border border-white/10 flex items-center justify-center text-[#D9323E]">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-[#F2F4F4]">
                    {activeTab === "signin"
                      ? t("auth_title_signin")
                      : activeTab === "signup"
                      ? t("auth_title_signup")
                      : t("auth_title_reset")}
                  </h3>
                  <p className="font-mono text-xs text-[#9CA6B2]">
                    Supabase Auth Protocol
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeAuthModal}
                className="ios-press w-8 h-8 rounded-full bg-[#1E242B] hover:bg-[#D9323E] hover:text-white text-[#F2F4F4] flex items-center justify-center transition-colors"
                aria-label={t("auth_close")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab switchers: Sign In vs Sign Up */}
            {activeTab !== "reset" && (
              <div className="flex p-1 bg-[#0B0D10] rounded-xl border border-white/[0.08] relative">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setError(null);
                    setSuccessNotice(null);
                  }}
                  className={`flex-1 py-2 rounded-lg font-mono text-xs transition-colors duration-200 relative select-none ${
                    activeTab === "signin"
                      ? "text-white font-bold"
                      : "text-[#9CA6B2] hover:text-[#F2F4F4]"
                  }`}
                >
                  {activeTab === "signin" && (
                    <motion.div
                      layoutId="active-auth-tab-pill"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      className="absolute inset-0 bg-[#D9323E] rounded-lg shadow-sm -z-10"
                    />
                  )}
                  {t("auth_tab_signin")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signup");
                    setError(null);
                    setSuccessNotice(null);
                  }}
                  className={`flex-1 py-2 rounded-lg font-mono text-xs transition-colors duration-200 relative select-none ${
                    activeTab === "signup"
                      ? "text-white font-bold"
                      : "text-[#9CA6B2] hover:text-[#F2F4F4]"
                  }`}
                >
                  {activeTab === "signup" && (
                    <motion.div
                      layoutId="active-auth-tab-pill"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      className="absolute inset-0 bg-[#D9323E] rounded-lg shadow-sm -z-10"
                    />
                  )}
                  {t("auth_tab_signup")}
                </button>
              </div>
            )}

            {/* Notices */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {successNotice && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successNotice}</span>
              </motion.div>
            )}

            {/* Google OAuth Button */}
            {activeTab !== "reset" && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="ios-press w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-[#1E242B] hover:bg-[#252C35] border border-white/10 text-[#F2F4F4] transition-all rounded-xl font-display text-sm font-semibold group shadow-sm disabled:opacity-50"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.1-6.67-4.94H1.28v3.15C3.25 21.3 7.31 24 12 24z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.33 14.26c-.24-.72-.38-1.49-.38-2.26s.14-1.54.38-2.26V6.59H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.41l4.05-3.15z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.59l4.05 3.15c.94-2.84 3.57-4.99 6.67-4.99z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>{t("guest_google_btn")}</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="font-mono text-[11px] text-[#9CA6B2]">
                    {t("auth_or_divider")}
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "signup" && (
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9CA6B2] mb-1.5">
                    {t("auth_display_name_label")}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#9CA6B2] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Clave Liverpool"
                      className="w-full pl-10 pr-4 py-3 bg-[#0B0D10] border border-white/10 rounded-xl text-sm text-[#F2F4F4] placeholder-[#5C6470] focus:outline-none focus:border-[#D9323E] transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase text-[#9CA6B2] mb-1.5">
                  {t("auth_email_label")}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA6B2] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#0B0D10] border border-white/10 rounded-xl text-sm text-[#F2F4F4] placeholder-[#5C6470] focus:outline-none focus:border-[#D9323E] transition-colors"
                  />
                </div>
              </div>

              {activeTab !== "reset" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase text-[#9CA6B2]">
                      {t("auth_password_label")}
                    </label>
                    {activeTab === "signin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("reset");
                          setError(null);
                          setSuccessNotice(null);
                        }}
                        className="text-xs font-mono text-[#D9323E] hover:underline"
                      >
                        {t("auth_forgot_password")}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9CA6B2] absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-[#0B0D10] border border-white/10 rounded-xl text-sm text-[#F2F4F4] placeholder-[#5C6470] focus:outline-none focus:border-[#D9323E] transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="ios-press w-full py-3.5 bg-[#D9323E] hover:bg-[#BF2430] text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(217,50,62,0.3)] disabled:opacity-50"
              >
                {loading
                  ? t("auth_loading")
                  : activeTab === "signin"
                  ? t("auth_signin_btn")
                  : activeTab === "signup"
                  ? t("auth_signup_btn")
                  : t("auth_reset_btn")}
              </button>
            </form>

            {/* Footer info */}
            {activeTab === "reset" && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setError(null);
                    setSuccessNotice(null);
                  }}
                  className="text-xs font-mono text-[#D9323E] hover:underline"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
