"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { GuestbookEntry } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  MessageSquare,
  Send,
  Lock,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Settings,
  Sparkles,
} from "lucide-react";

export default function Guestbook() {
  const { user, openAuthModal, signOut, isConfigured, setSetupNoticeOpen } = useAuth();
  const { t, language } = useLanguage();

  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch entries
  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch("/api/guestbook");
        const data = await res.json();
        if (data.entries) {
          setEntries(data.entries);
        }
      } catch (err) {
        console.error("Failed to load guestbook entries:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatusMessage(null);

    if (!user) {
      openAuthModal("signin");
      return;
    }

    if (!message.trim()) {
      setStatusMessage({ type: "error", text: t("guest_error_empty") });
      return;
    }

    if (message.length > 500) {
      setStatusMessage({ type: "error", text: t("guest_error_too_long") });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, honeypot }),
      });

      const result = await res.json();

      if (!res.ok) {
        setStatusMessage({
          type: "error",
          text: result.error || t("guest_error_generic"),
        });
      } else {
        setMessage("");
        setStatusMessage({ type: "success", text: t("guest_success") });
        if (result.entry) {
          setEntries((prev) => [result.entry, ...prev]);
        }
      }
    } catch {
      setStatusMessage({ type: "error", text: t("guest_error_generic") });
    } finally {
      setSubmitting(false);
    }
  }

  const charCount = message.length;
  const charsRemaining = 500 - charCount;

  // Resolve user display name
  const userDisplayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Explorer";

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 py-20 scroll-mt-20 overflow-hidden" id="guestbook">
      <div className="max-w-[1240px] mx-auto space-y-14">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2"
        >
          <div>
            <span className="font-mono text-xs tracking-widest text-[#D9323E] uppercase block mb-2 font-semibold">
              {t("guestbook_tag")}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F2F4F4]">
              {t("guestbook_title")}
            </h2>
          </div>
          <p className="text-base text-[#9CA6B2] max-w-md leading-relaxed">
            {t("guestbook_sub")}
          </p>
        </motion.div>

        {/* Setup Notice Banner if Supabase is unconfigured */}
        {!isConfigured && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-5 bg-[#161B20] border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#F2F4F4]">
                  Supabase Backend Configuration
                </h4>
                <p className="text-xs text-[#9CA6B2] mt-0.5 leading-relaxed">
                  {t("guest_setup_notice")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSetupNoticeOpen(true)}
              className="ios-press px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-mono text-xs transition-colors shrink-0"
            >
              {t("guest_setup_btn")}
            </button>
          </motion.div>
        )}

        {/* Guestbook Grid: Form & Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Note Composer (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-[#161B20] p-6 sm:p-8 rounded-2xl border border-white/[0.08] flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#F2F4F4] font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#D9323E]" />
                  {t("guest_mode")}
                </span>
                {user && (
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="ios-press flex items-center gap-1.5 text-xs font-mono text-[#9CA6B2] hover:text-[#D9323E] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t("guest_sign_out")}</span>
                  </button>
                )}
              </div>

              {/* Logged Out View */}
              {!user ? (
                <div className="space-y-5 py-2">
                  <div className="w-12 h-12 rounded-full bg-[#1E242B] border border-white/10 flex items-center justify-center text-[#D9323E]">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-[#F2F4F4]">
                      {t("guest_auth_heading")}
                    </h4>
                    <p className="text-xs text-[#9CA6B2] mt-1 leading-relaxed">
                      {t("guest_auth_desc")}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => openAuthModal("signin")}
                      className="ios-press w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-[#1E242B] hover:bg-[#252C35] border border-white/10 text-[#F2F4F4] transition-all rounded-xl font-display text-sm font-semibold group shadow-sm"
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

                    <button
                      type="button"
                      onClick={() => openAuthModal("signin")}
                      className="ios-press w-full py-3 bg-transparent hover:bg-[#1E242B] border border-white/10 text-[#9CA6B2] hover:text-[#F2F4F4] transition-all rounded-xl font-display text-xs font-semibold"
                    >
                      {t("guest_email_btn")}
                    </button>
                  </div>

                  <div className="font-mono text-[11px] text-[#9CA6B2]/70 flex items-center gap-1.5 pt-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9323E]" />
                    <span>{t("guest_privacy_note")}</span>
                  </div>
                </div>
              ) : (
                /* Signed In View: Interactive Composer */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Author identifier banner */}
                  <div className="flex items-center gap-3 p-3 bg-[#0B0D10] rounded-xl border border-white/[0.06]">
                    <div className="w-10 h-10 rounded-full bg-[#D9323E] text-white flex items-center justify-center font-display text-sm font-bold shadow-md">
                      {userDisplayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="font-display text-sm font-semibold text-[#F2F4F4] truncate">
                        {userDisplayName}
                      </div>
                      <div className="font-mono text-xs text-[#9CA6B2] truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Honeypot field (hidden from real users) */}
                  <input
                    type="text"
                    name="website_url"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="opacity-0 absolute -z-10 w-0 h-0 pointer-events-none"
                  />

                  {/* Status alert */}
                  {statusMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                        statusMessage.type === "success"
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                          : "bg-red-500/10 border border-red-500/30 text-red-400"
                      }`}
                    >
                      {statusMessage.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      )}
                      <span>{statusMessage.text}</span>
                    </motion.div>
                  )}

                  {/* Message textarea */}
                  <div>
                    <label
                      htmlFor="guest-message-input"
                      className="block font-mono text-xs uppercase text-[#9CA6B2] mb-1.5"
                    >
                      {t("guest_input_label")}
                    </label>
                    <textarea
                      id="guest-message-input"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("guest_placeholder")}
                      maxLength={500}
                      className="w-full p-3.5 bg-[#0B0D10] text-[#F2F4F4] text-sm rounded-xl border border-white/10 resize-none focus:outline-none focus:border-[#D9323E] transition-colors leading-relaxed placeholder-[#5C6470]"
                    />
                  </div>

                  {/* Character Counter & Submit Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`font-mono text-xs transition-colors duration-200 ${
                        charsRemaining < 50 ? "text-amber-400 font-bold" : "text-[#9CA6B2]"
                      }`}
                    >
                      {charsRemaining} {t("guest_char_limit")}
                    </span>

                    <button
                      type="submit"
                      disabled={submitting || !message.trim()}
                      className="ios-press inline-flex items-center gap-2 px-5 py-2.5 bg-[#D9323E] hover:bg-[#BF2430] text-white rounded-xl font-display text-xs font-bold transition-all shadow-[0_0_15px_rgba(217,50,62,0.3)] disabled:opacity-50"
                    >
                      <span>
                        {submitting ? t("guest_posting_btn") : t("guest_post_btn")}
                      </span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="pt-6 font-mono text-[11px] text-[#9CA6B2]/70 border-t border-white/[0.06] mt-6">
              <span>Powered by Supabase PostgreSQL Architecture</span>
            </div>
          </motion.div>

          {/* Right Column: Community Notes Feed (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {loading ? (
              <div className="py-12 text-center font-mono text-xs text-[#9CA6B2]">
                Loading messages...
              </div>
            ) : entries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#161B20] p-8 rounded-2xl border border-white/[0.08] text-center space-y-2"
              >
                <p className="text-sm text-[#9CA6B2]">{t("guest_empty")}</p>
              </motion.div>
            ) : (
              entries.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
                  className="bg-[#161B20] p-6 rounded-2xl border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1E242B] border border-white/10 flex items-center justify-center font-display text-xs font-bold text-[#D9323E]">
                        {entry.author_name ? entry.author_name.charAt(0).toUpperCase() : "G"}
                      </div>
                      <div>
                        <div className="font-display text-sm font-semibold text-[#F2F4F4]">
                          {entry.author_name}
                        </div>
                        <div className="font-mono text-[11px] text-[#9CA6B2]">
                          Verified Community Member
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-[#9CA6B2]">
                      {formatDate(entry.created_at, language)}
                    </span>
                  </div>

                  <p className="text-sm text-[#9CA6B2] leading-relaxed break-words">
                    “{entry.message}”
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
