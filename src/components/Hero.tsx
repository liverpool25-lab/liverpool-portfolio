"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/config/site";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";

// ─── Mobile breakpoint (must match Tailwind "md") ─────────────────────────────
const MOBILE_MQ = "(max-width: 767px)";

export default function Hero() {
  const { t, language } = useLanguage();

  // Typewriter phrases
  const phrases = [
    t("typewriter_1"),
    t("typewriter_2"),
    t("typewriter_3"),
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter logic with refined timing
  useEffect(() => {
    const fullText = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 35 : 75;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < fullText.length) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, phrases]);

  // Reset typewriter when language changes
  useEffect(() => {
    setCurrentText("");
    setIsDeleting(false);
    setCurrentPhraseIndex(0);
  }, [language]);

  // ─── Device / feature detection ───────────────────────────────────────────
  const cardRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rafId = useRef<number | null>(null);

  // Detect touch / mobile / reduced-motion once on client
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const mobileMq = window.matchMedia(MOBILE_MQ);
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    setIsMobile(mobileMq.matches);
    setPrefersReducedMotion(reducedMq.matches);

    const onMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const onReducedChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    if (mobileMq.addEventListener) {
      mobileMq.addEventListener("change", onMobileChange);
      reducedMq.addEventListener("change", onReducedChange);
    } else {
      mobileMq.addListener(onMobileChange as (e: MediaQueryListEvent) => void);
      reducedMq.addListener(onReducedChange as (e: MediaQueryListEvent) => void);
    }

    return () => {
      if (mobileMq.removeEventListener) {
        mobileMq.removeEventListener("change", onMobileChange);
        reducedMq.removeEventListener("change", onReducedChange);
      } else {
        mobileMq.removeListener(onMobileChange as (e: MediaQueryListEvent) => void);
        reducedMq.removeListener(onReducedChange as (e: MediaQueryListEvent) => void);
      }
    };
  }, []);

  // ─── Spider-Man state for mobile glitch cycle ───────────────────────────
  // glitchPhase: "idle" | "glitching" | "spiderman" | "returning"
  const [glitchPhase, setGlitchPhase] = useState<"idle" | "glitching" | "spiderman" | "returning">("idle");
  const glitchTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const glitchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Track whether the manual tap is currently controlling the reveal
  const manualRevealActive = useRef(false);

  const clearGlitchTimers = useCallback(() => {
    glitchTimers.current.forEach(clearTimeout);
    glitchTimers.current = [];
  }, []);

  // One glitch cycle: glitch → spiderman → return → idle
  const runGlitchCycle = useCallback(() => {
    // Don't interrupt a manual reveal
    if (manualRevealActive.current) return;

    clearGlitchTimers();
    setGlitchPhase("glitching");

    const t1 = setTimeout(() => {
      setGlitchPhase("spiderman");

      const t2 = setTimeout(() => {
        setGlitchPhase("returning");

        const t3 = setTimeout(() => {
          setGlitchPhase("idle");
        }, 350);
        glitchTimers.current.push(t3);
      }, 900); // Spider-Man visible for ~900ms
      glitchTimers.current.push(t2);
    }, 350); // Glitch transition ~350ms
    glitchTimers.current.push(t1);
  }, [clearGlitchTimers]);

  // Start/stop the automatic glitch interval on mobile
  useEffect(() => {
    if (glitchIntervalRef.current) {
      clearInterval(glitchIntervalRef.current);
      glitchIntervalRef.current = null;
    }

    if (isMobile && !prefersReducedMotion) {
      // Wait 2 s before first trigger so page settles
      const initialDelay = setTimeout(() => {
        runGlitchCycle();
        glitchIntervalRef.current = setInterval(runGlitchCycle, 4000);
      }, 2000);

      return () => {
        clearTimeout(initialDelay);
        if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);
        clearGlitchTimers();
      };
    }
    return () => { clearGlitchTimers(); };
  }, [isMobile, prefersReducedMotion, runGlitchCycle, clearGlitchTimers]);

  // Pause interval when page is hidden
  useEffect(() => {
    if (!isMobile || prefersReducedMotion) return;
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (glitchIntervalRef.current) {
          clearInterval(glitchIntervalRef.current);
          glitchIntervalRef.current = null;
        }
        clearGlitchTimers();
        setGlitchPhase("idle");
        manualRevealActive.current = false;
      } else {
        if (!glitchIntervalRef.current) {
          glitchIntervalRef.current = setInterval(runGlitchCycle, 4000);
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [isMobile, prefersReducedMotion, runGlitchCycle, clearGlitchTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);
      clearGlitchTimers();
    };
  }, [clearGlitchTimers]);

  // ─── Desktop: Spider-Man Cursor Tracking ─────────────────────────────────
  const updatePointerPosition = useCallback((clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.setProperty("--mouse-x", `${xPct.toFixed(2)}%`);
        cardRef.current.style.setProperty("--mouse-y", `${yPct.toFixed(2)}%`);
        cardRef.current.style.setProperty("--reticle-x", `${x.toFixed(1)}px`);
        cardRef.current.style.setProperty("--reticle-y", `${y.toFixed(1)}px`);
      }
    });
  }, []);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") {
      setIsRevealed(true);
      updatePointerPosition(e.clientX, e.clientY);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") {
      updatePointerPosition(e.clientX, e.clientY);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") {
      setIsRevealed(false);
    }
  };

  // ─── Mobile: Manual tap toggle ────────────────────────────────────────────
  const handleTouchTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTouchDevice) return;

    if (manualRevealActive.current) {
      // Second tap: close manual reveal, resume auto cycle
      manualRevealActive.current = false;
      setIsRevealed(false);
    } else {
      // First tap: interrupt glitch cycle, show Spider-Man via cursor system
      clearGlitchTimers();
      setGlitchPhase("idle");
      manualRevealActive.current = true;
      // Center the reveal on the tap point
      updatePointerPosition(e.clientX, e.clientY);
      setIsRevealed(true);
    }
  };

  const radius = siteConfig.spiderManCalibration.revealRadius;

  // ─── Derived display state ────────────────────────────────────────────────
  // On desktop: use isRevealed driven by pointer events
  // On mobile:  use manualRevealActive (tap) OR glitch phases
  const showSpidermanMask = isMobile
    ? manualRevealActive.current && isRevealed
    : isRevealed;

  // Glitch effect active flag (only mobile)
  const isGlitching = isMobile && (glitchPhase === "glitching" || glitchPhase === "returning");
  const spidermanFullReveal = isMobile && glitchPhase === "spiderman" && !manualRevealActive.current;

  // ─── Framer Motion Variants ───────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.09, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 pt-8 pb-20 md:py-24" id="home">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        {/* ── Left Column: Editorial & Narrative (7 cols) ─────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start space-y-6"
        >
          {/* Status Label */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#161B20] border border-white/10 rounded-full shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9323E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D9323E]" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#D9323E] font-medium">
              {t("hero_status")}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl lg:text-[62px] text-[#F2F4F4] tracking-tight leading-[1.08]"
          >
            <span>{t("hero_title_1")}</span>
            <br className="hidden sm:inline" />
            <span className="text-[#9CA6B2] font-display"> {t("hero_title_amp")} </span>
            <span className="text-[#D9323E] underline decoration-[#D9323E]/30 underline-offset-8">
              {t("hero_title_2")}
            </span>
          </motion.h1>

          {/* Typewriter Line */}
          <motion.div
            variants={itemVariants}
            className="h-7 flex items-center font-mono text-sm sm:text-base text-[#C8F36B]"
          >
            <span className="text-[#9CA6B2] mr-2">&gt;_</span>
            <span>{currentText}</span>
            <span className="inline-block w-2 h-4 bg-[#C8F36B] ml-1 animate-blink" />
          </motion.div>

          {/* Supporting Bio Text */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#9CA6B2] max-w-xl leading-relaxed"
          >
            {t("hero_desc")}
          </motion.p>

          {/* Academic & Geographic marker */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 font-mono text-xs text-[#9CA6B2]/80"
          >
            <MapPin className="w-4 h-4 text-[#72D9BC] shrink-0" />
            <span>{t("hero_location")}</span>
          </motion.div>

          {/* Action CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="#projects"
              className="ios-press group inline-flex items-center gap-2 px-6 py-3.5 bg-[#D9323E] text-white rounded-xl font-display text-[15px] font-bold tracking-wide hover:bg-[#BF2430] hover:shadow-[0_0_24px_rgba(217,50,62,0.4)]"
            >
              <span>{t("hero_cta_projects")}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="#contact"
              className="ios-press inline-flex items-center gap-2 px-6 py-3.5 bg-[#161B20] border border-white/10 text-[#F2F4F4] rounded-xl font-display text-[15px] font-semibold tracking-wide hover:bg-[#1E242B] hover:border-[#D9323E]/40"
            >
              <span>{t("hero_cta_contact")}</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Right Column: Spider-Man Portrait Reveal (5 cols) ──────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col items-center"
        >
          <div
            ref={cardRef}
            onPointerEnter={handlePointerEnter}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onClick={handleTouchTap}
            className={`portrait-card relative w-full max-w-[390px] aspect-[4/5] rounded-2xl border border-white/10 shadow-2xl overflow-hidden group select-none cursor-crosshair${isGlitching ? " portrait-glitch" : ""}`}
            style={
              {
                "--mouse-x": "50%",
                "--mouse-y": "40%",
                "--reticle-x": "195px",
                "--reticle-y": "195px",
                "--mask-radius": `${radius}px`,
              } as React.CSSProperties
            }
          >

            {/* ── Layer A: Backdrop (halftone + accent rings + dark surface) ── */}
            <div className="absolute inset-0 bg-[#08090B]" aria-hidden="true">
              {/* Halftone dot grid */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #2D3540 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full border border-[#D9323E]/20 pointer-events-none" />
              <div className="absolute -top-4 -left-4 w-28 h-28 rounded-full border border-[#D9323E]/10 pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full border border-[#9CA6B2]/10 pointer-events-none" />
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#D9323E]/20 to-[#C8F36B]/15 rounded-2xl blur-lg pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
            </div>

            {/* ── Layer B: Base Portrait with exclusion mask ──────────────── */}
            {/*
             * On DESKTOP: exclusion mask follows cursor (isRevealed from pointer).
             * On MOBILE manual tap: same exclusion mask from tap position.
             * On MOBILE glitch full reveal: portrait fades out (spidermanFullReveal).
             */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none transition-[mask-image,opacity] duration-[240ms] ease-out"
              style={
                showSpidermanMask
                  ? {
                      maskImage: `radial-gradient(circle ${radius}px at var(--mouse-x) var(--mouse-y), transparent 0%, transparent calc(${radius}px - 24px), rgba(0,0,0,0.45) calc(${radius}px - 8px), black ${radius}px)`,
                      WebkitMaskImage: `radial-gradient(circle ${radius}px at var(--mouse-x) var(--mouse-y), transparent 0%, transparent calc(${radius}px - 24px), rgba(0,0,0,0.45) calc(${radius}px - 8px), black ${radius}px)`,
                    }
                  : spidermanFullReveal
                  ? { opacity: 0 }
                  : {}
              }
            >
              <Image
                src="/assets/portrait.png"
                alt="Liverpool authentic developer portrait"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover object-top select-none pointer-events-none"
              />
            </div>

            {/* ── Layer C: Spider-Man PNG — two display modes ───────────────── */}
            {/*
             * Mode 1 (desktop / mobile manual): spotlight mask from cursor position.
             * Mode 2 (mobile glitch cycle): full-card reveal without mask.
             */}
            {spidermanFullReveal ? (
              // Full reveal during glitch auto-cycle
              <div
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                style={{
                  opacity: siteConfig.spiderManCalibration.opacity,
                  transition: "opacity 0.25s ease",
                }}
              >
                <Image
                  src="/assets/spiderman.png"
                  alt="Spider-Man identity spotlight overlay"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-top select-none pointer-events-none"
                />
              </div>
            ) : (
              // Spotlight mask (desktop cursor or mobile tap)
              <div
                className="absolute inset-0 w-full h-full pointer-events-none select-none spiderman-spotlight-mask"
                style={{
                  opacity: showSpidermanMask ? siteConfig.spiderManCalibration.opacity : 0,
                }}
              >
                <Image
                  src="/assets/spiderman.png"
                  alt="Spider-Man identity spotlight overlay"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-top select-none pointer-events-none"
                />
              </div>
            )}

            {/* ── Layer D: Reticle ring (desktop only) ─────────────────────── */}
            {!isMobile && (
              <div
                className={`absolute pointer-events-none rounded-full border border-[#D9323E]/50 shadow-[0_0_24px_rgba(217,50,62,0.3)] transition-opacity duration-200 ${
                  isRevealed ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  width: `${radius * 2}px`,
                  height: `${radius * 2}px`,
                  transform: "translate3d(calc(var(--reticle-x) - 50%), calc(var(--reticle-y) - 50%), 0)",
                  willChange: "transform",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                  <div className="w-full h-px bg-[#D9323E]/40" />
                  <div className="h-full w-px bg-[#D9323E]/40 absolute" />
                </div>
              </div>
            )}

            {/* ── Layer E: UI Badges ───────────────────────────────────────── */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[#D9323E] rounded-full font-mono text-[10px] tracking-widest uppercase pointer-events-none shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9323E] animate-pulse" />
              <span>
                {isTouchDevice
                  ? manualRevealActive.current && isRevealed
                    ? language === "id" ? "KETUK TUTUP" : "TAP TO CLOSE"
                    : language === "id" ? "KETUK SOROT" : "TAP REVEAL"
                  : t("hero_spotlight_hint")}
              </span>
            </div>

            {/* Bottom-left: @clivvr_ identity tag */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/75 backdrop-blur-sm border border-white/10 rounded-full pointer-events-none shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#D9323E] flex-shrink-0" />
              <span className="font-mono text-[11px] text-[#F2F4F4] tracking-wider font-medium">
                @clivvr_
              </span>
            </div>

            {/* Bottom-right: sparkle accent */}
            <div className="absolute bottom-4 right-4 text-[#D9323E]/40 pointer-events-none">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Footnote under portrait */}
          <div className="w-full max-w-[390px] mt-3.5 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 font-mono text-xs text-[#F2F4F4]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D9323E]" />
              <span className="font-medium">{t("hero_portrait_caption")}</span>
              <span className="text-[#9CA6B2] font-normal">/ {t("hero_portrait_role")}</span>
            </div>
            <span className="font-mono text-[11px] text-[#9CA6B2]/70 uppercase">
              {t("hero_portrait_badge")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
