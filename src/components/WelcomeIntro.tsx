"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

// ─── Social platform data ─────────────────────────────────────────────────────
// GitHub and LinkedIn are placeholder-marked in siteConfig (empty string).
// We render them as disabled/coming-soon to preserve honesty.
const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    href: siteConfig.socials.instagram,
    color: "#E1306C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: siteConfig.socials.tiktok,
    color: "#69C9D0",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.02a8.19 8.19 0 004.79 1.54V7.12a4.85 4.85 0 01-1.02-.43z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    href: siteConfig.socials.youtube,
    color: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
        <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.54 3.6 12 3.6 12 3.6s-7.54 0-9.38.48A3.02 3.02 0 00.5 6.19 31.57 31.57 0 000 12a31.57 31.57 0 00.5 5.81 3.02 3.02 0 002.12 2.14C4.46 20.4 12 20.4 12 20.4s7.54 0 9.38-.45a3.02 3.02 0 002.12-2.14A31.57 31.57 0 0024 12a31.57 31.57 0 00-.5-5.81zM9.75 15.52V8.48L15.5 12l-5.75 3.52z" />
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    href: siteConfig.socials.github || null, // placeholder
    color: "#9CA6B2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: siteConfig.socials.linkedin || null, // placeholder
    color: "#0A66C2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

// ─── Minecraft-style block reveal animation ────────────────────────────────────
// We split each CHARACTER of the title into a block that animates in with a
// pixelated scale/opacity reveal, staggered across the text.
// Characters are grouped inside per-word wrappers so that `inline-block` on the
// animated spans never causes a mid-word line break.
const TITLE = "Welcome To My Portofolio";

// Responsive clamp values: min 1.8rem (≈320 px), preferred 6vw, max 4.2rem.
// At 1024 px  → 6vw ≈ 61 px  → clamped to 4.2rem ≈ 67 px  ✓
// At 768  px  → 6vw ≈ 46 px  → unclamped              ✓
// At 390  px  → 6vw ≈ 23 px  → clamped to 1.8rem ≈ 29 px  ✓
// At 320  px  → 6vw ≈ 19 px  → clamped to 1.8rem           ✓
const TITLE_STYLE: React.CSSProperties = {
  fontSize: "clamp(1.8rem, 5.8vw, 4.2rem)",
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
};

function BlockTitle() {
  // Split into words; each word gets a no-break wrapper so inline-block
  // character spans never produce mid-word line breaks.
  const words = TITLE.split(" ");
  let charIndex = 0;

  return (
    <h1
      className="font-display font-bold text-[#F2F4F4] text-center"
      style={TITLE_STYLE}
      aria-label={TITLE}
    >
      {words.map((word, wi) => {
        const wordChars = word.split("");
        const wordStart = charIndex;
        charIndex += word.length + 1; // +1 for the space

        return (
          <React.Fragment key={wi}>
            {/* inline-block wrapper keeps word on one line */}
            <span className="inline-block whitespace-nowrap">
              {wordChars.map((char, ci) => {
                const globalIdx = wordStart + ci;
                return (
                  <motion.span
                    key={ci}
                    initial={{
                      opacity: 0,
                      scaleY: 0,
                      scaleX: 0.6,
                      y: -12,
                      filter: "blur(3px)",
                    }}
                    animate={{
                      opacity: 1,
                      scaleY: 1,
                      scaleX: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    transition={{
                      duration: 0.28,
                      delay: 0.55 + globalIdx * 0.028,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                    style={{ transformOrigin: "top center" }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
            {/* Inter-word space — not animated, always present */}
            {wi < words.length - 1 && <span aria-hidden="true">{"\u00A0"}</span>}
          </React.Fragment>
        );
      })}
    </h1>
  );
}

export default function WelcomeIntro() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPrefersReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }
  }, []);

  // Title finishes at ~0.55 + 24 chars * 0.028 + 0.28 ≈ ~1.5 s
  const iconBaseDelay = 1.55;

  return (
    <section
      id="intro"
      className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#08090B] overflow-hidden"
      aria-label="Welcome introduction"
    >
      {/* ── Background texture ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle, #1E242B 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          opacity: 0.25,
        }}
      />
      {/* Radial ambient center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(217,50,62,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-8 w-full max-w-5xl space-y-10">

        {/* Pre-title tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#161B20] border border-white/10 rounded-full font-mono text-[11px] uppercase tracking-widest text-[#D9323E] shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9323E] animate-pulse" />
          Liverpool · Portfolio 2025
        </motion.div>

        {/* ── Minecraft block-reveal title ─── */}
        {prefersReducedMotion ? (
          <h1
            className="font-display font-bold text-[#F2F4F4] text-center"
            style={TITLE_STYLE}
          >
            {TITLE}
          </h1>
        ) : (
          <BlockTitle />
        )}

        {/* Accent rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-px w-24 bg-gradient-to-r from-transparent via-[#D9323E] to-transparent"
          style={{ transformOrigin: "center" }}
        />

        {/* ── Social icon row ──────────────────────────────────────────── */}
        <div
          className="flex items-center justify-center gap-5 sm:gap-7"
          role="list"
          aria-label="Social media links"
        >
          {SOCIALS.map((social, idx) => {
            const isAvailable = !!social.href;

            if (isAvailable) {
              return (
                <motion.a
                  key={social.id}
                  href={social.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: iconBaseDelay + idx * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ scale: 1.18, y: -3 }}
                  whileTap={{ scale: 0.93 }}
                  className="flex flex-col items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9323E]/60 rounded-2xl p-1"
                  role="listitem"
                  aria-label={social.label}
                >
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-[#161B20] border border-white/[0.08] shadow-lg transition-all duration-200 group-hover:border-white/20 group-hover:shadow-xl"
                    style={{ color: social.color }}
                  >
                    {social.icon}
                  </div>
                  <span className="font-mono text-[10px] text-[#9CA6B2] group-hover:text-[#F2F4F4] transition-colors tracking-wider">
                    {social.label}
                  </span>
                </motion.a>
              );
            }

            // Placeholder / coming-soon
            return (
              <motion.div
                key={social.id}
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 0.45, scale: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: iconBaseDelay + idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col items-center gap-2"
                role="listitem"
                aria-label={`${social.label} — coming soon`}
                title={`${social.label} — coming soon`}
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-[#161B20] border border-white/[0.06] shadow-sm"
                  style={{ color: "#4A535D" }}
                >
                  {social.icon}
                </div>
                <span className="font-mono text-[10px] text-[#4A535D] tracking-wider">
                  {social.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll nudge — appears after icons settle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: iconBaseDelay + 0.6, duration: 0.5 }}
          className="flex flex-col items-center gap-2 pt-4"
          aria-hidden="true"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#9CA6B2]/50">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-5 h-5 flex items-center justify-center"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-[#9CA6B2]/50">
              <path d="M8 3v10M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
