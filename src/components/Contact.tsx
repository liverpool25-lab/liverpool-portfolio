"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/config/site";
import {
  Mail,
  Copy,
  Check,
  Send,
  ArrowUpRight,
  Lock,
  Hourglass,
  Instagram,
  Youtube,
} from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  function handleCopyEmail() {
    navigator.clipboard
      .writeText(siteConfig.email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      })
      .catch((err) => {
        console.error("Copy failed:", err);
      });
  }

  return (
    <section
      className="w-full px-4 sm:px-6 md:px-8 py-20 bg-[#08090B] border-t border-white/[0.06] scroll-mt-20 overflow-hidden"
      id="contact"
    >
      <div className="max-w-[1240px] mx-auto space-y-16">
        {/* Headline & Pitch */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl space-y-4"
        >
          <span className="font-mono text-xs tracking-widest text-[#D9323E] uppercase block font-semibold">
            {t("contact_tag")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F2F4F4] tracking-tight leading-[1.1]">
            {t("contact_heading")}
          </h2>
          <p className="text-base sm:text-lg text-[#9CA6B2] leading-relaxed">
            {t("contact_sub")}
          </p>
        </motion.div>

        {/* Action Card: Direct Email Display & Mailto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#161B20] p-8 sm:p-10 rounded-2xl border border-white/[0.08] grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-lg"
        >
          {/* Left: Email address & copy button */}
          <div className="md:col-span-8 space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[#9CA6B2]">
              {t("contact_direct_label")}
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[#D9323E] tracking-tight">
                {siteConfig.email}
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="ios-press inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E242B] hover:bg-[#252C35] border border-white/10 text-[#F2F4F4] rounded-xl font-mono text-xs transition-colors shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t("btn_copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#9CA6B2]" />
                    <span>{t("btn_copy")}</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-xs text-[#9CA6B2]/80 pt-1">
              {t("contact_response_time")}
            </p>
          </div>

          {/* Right: Compose Email buttons */}
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteConfig.email)}&su=Hello%20Liverpool%20%E2%80%94%20Project%20Inquiry`}
              target="_blank"
              rel="noopener noreferrer"
              className="ios-press inline-flex items-center gap-2 px-7 py-4 bg-[#D9323E] text-white rounded-xl font-display text-base font-bold hover:bg-[#BF2430] hover:shadow-[0_0_24px_rgba(217,50,62,0.4)] transition-all duration-200"
            >
              <span>{t("contact_send_email_btn")}</span>
              <Send className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${siteConfig.email}?subject=Hello%20Liverpool%20-%20Project%20Inquiry`}
              className="ios-press inline-flex items-center gap-2 px-5 py-3 bg-[#1E242B] border border-white/10 text-[#9CA6B2] hover:text-[#F2F4F4] rounded-xl font-mono text-xs transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Open Mail App</span>
            </a>
          </div>
        </motion.div>

        {/* Verified Social Matrix */}
        <div className="space-y-6 pt-2">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            className="flex items-center justify-between border-b border-white/[0.06] pb-3"
          >
            <span className="font-mono text-xs tracking-widest text-[#D9323E] font-semibold uppercase">
              {t("socials_title")}
            </span>
            <span className="font-mono text-[11px] text-[#9CA6B2]/70">
              {t("socials_metrics")}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Instagram */}
            <motion.a
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.05 }}
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="ios-press bg-[#161B20] p-5 rounded-2xl border border-white/[0.08] hover:border-[#D9323E]/50 transition-colors flex flex-col justify-between group shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#D9323E] font-semibold">
                  @clivvr_
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#9CA6B2] group-hover:text-[#D9323E] transition-colors" />
              </div>
              <div>
                <div className="font-display text-base font-bold text-[#F2F4F4] flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#D9323E]" />
                  Instagram
                </div>
                <div className="font-mono text-xs text-[#9CA6B2] mt-0.5">
                  Personal &amp; Creative
                </div>
              </div>
            </motion.a>

            {/* TikTok */}
            <motion.a
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.1 }}
              href={siteConfig.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="ios-press bg-[#161B20] p-5 rounded-2xl border border-white/[0.08] hover:border-[#D9323E]/50 transition-colors flex flex-col justify-between group shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#D9323E] font-semibold">
                  @lipptitikcom
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#9CA6B2] group-hover:text-[#D9323E] transition-colors" />
              </div>
              <div>
                <div className="font-display text-base font-bold text-[#F2F4F4]">
                  TikTok
                </div>
                <div className="font-mono text-xs text-[#9CA6B2] mt-0.5">
                  Clips &amp; Experiments
                </div>
              </div>
            </motion.a>

            {/* YouTube */}
            <motion.a
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.15 }}
              href={siteConfig.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="ios-press bg-[#161B20] p-5 rounded-2xl border border-white/[0.08] hover:border-[#D9323E]/50 transition-colors flex flex-col justify-between group shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#D9323E] font-semibold">
                  @OfficialLivvID
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#9CA6B2] group-hover:text-[#D9323E] transition-colors" />
              </div>
              <div>
                <div className="font-display text-base font-bold text-[#F2F4F4] flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-[#D9323E]" />
                  YouTube
                </div>
                <div className="font-mono text-xs text-[#9CA6B2] mt-0.5">
                  Video Archives
                </div>
              </div>
            </motion.a>

            {/* GitHub */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-[#161B20] p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between opacity-80"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 bg-[#1E242B] font-mono text-[10px] text-[#9CA6B2] rounded-full">
                  {t("social_coming_soon")}
                </span>
                <Lock className="w-4 h-4 text-[#9CA6B2]/50" />
              </div>
              <div>
                <div className="font-display text-base font-semibold text-[#F2F4F4]">
                  GitHub
                </div>
                <div className="font-mono text-xs text-[#9CA6B2] mt-0.5">
                  Profile Launching Soon
                </div>
              </div>
            </motion.div>

            {/* LinkedIn */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="bg-[#161B20] p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between opacity-80"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 bg-[#1E242B] font-mono text-[10px] text-[#9CA6B2] rounded-full">
                  {t("social_roadmap")}
                </span>
                <Hourglass className="w-4 h-4 text-[#9CA6B2]/50" />
              </div>
              <div>
                <div className="font-display text-base font-semibold text-[#F2F4F4]">
                  LinkedIn
                </div>
                <div className="font-mono text-xs text-[#9CA6B2] mt-0.5">
                  Professional Profile
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
