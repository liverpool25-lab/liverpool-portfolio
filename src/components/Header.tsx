"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/config/site";
import { Mail, Menu, X } from "lucide-react";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);

      // Detect active section — include "intro" for the welcome section
      const sections = ["intro", "home", "about", "projects", "gallery", "guestbook", "contact"];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", label: t("nav_home"), href: "#home" },
    { id: "about", label: t("nav_about"), href: "#about" },
    { id: "projects", label: t("nav_projects"), href: "#projects" },
    { id: "gallery", label: t("nav_gallery"), href: "#gallery" },
    { id: "contact", label: t("nav_contact"), href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0B0D10]/88 backdrop-blur-xl border-b border-white/[0.08] shadow-lg"
          : "bg-[#0B0D10]/60 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-[1240px] mx-auto h-20 px-4 sm:px-6 md:px-8 flex items-center justify-between">

        {/* ── Wordmark ─────────────────────────────────────────────────── */}
        <Link href="#intro" className="flex items-center gap-2 group ios-press">
          <span className="font-display text-[22px] font-bold tracking-tight text-[#F2F4F4]">
            LIVERPOOL
          </span>
          <span className="h-2 w-2 rounded-full bg-[#D9323E] transition-transform duration-300 group-hover:scale-125 shadow-[0_0_8px_rgba(217,50,62,0.6)]" />
        </Link>

        {/* ── Desktop Navigation — Liquid Glass Pill ───────────────────── */}
        <nav
          className="hidden md:flex items-center gap-0.5 p-1 glass-nav rounded-full"
          aria-label="Main navigation"
        >
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9323E]/50 ${
                  isActive
                    ? "text-[#F2F4F4] font-semibold"
                    : "text-[#9CA6B2] hover:text-[#F2F4F4] hover:tracking-[0.08em]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    className="absolute inset-0 bg-white/[0.09] border border-white/[0.13] rounded-full -z-10 shadow-sm"
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right Controls ───────────────────────────────────────────── */}
        <div className="flex items-center gap-3">

          {/* iOS Segmented Language Switcher */}
          <div
            className="relative flex items-center p-1 rounded-full bg-[#161B20] border border-white/[0.08] text-xs font-mono select-none"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLanguage("id")}
              aria-pressed={language === "id"}
              className={`relative z-10 px-3 py-1 rounded-full text-xs font-mono transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9323E]/50 ${
                language === "id" ? "text-white font-bold" : "text-[#9CA6B2] hover:text-[#F2F4F4]"
              }`}
            >
              {language === "id" && (
                <motion.div
                  layoutId="active-lang-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  className="absolute inset-0 bg-[#D9323E] rounded-full shadow-sm -z-10"
                />
              )}
              ID
            </button>

            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`relative z-10 px-3 py-1 rounded-full text-xs font-mono transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9323E]/50 ${
                language === "en" ? "text-white font-bold" : "text-[#9CA6B2] hover:text-[#F2F4F4]"
              }`}
            >
              {language === "en" && (
                <motion.div
                  layoutId="active-lang-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  className="absolute inset-0 bg-[#D9323E] rounded-full shadow-sm -z-10"
                />
              )}
              EN
            </button>
          </div>

          {/* Quick Mail Button */}
          <Link
            href={`mailto:${siteConfig.email}?subject=Project%20Inquiry%20-%20Liverpool%20Portfolio`}
            className="ios-press w-9 h-9 rounded-full bg-[#161B20] border border-white/[0.08] flex items-center justify-center text-[#9CA6B2] hover:text-[#D9323E] hover:border-[#D9323E]/50 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9323E]/50"
            title="Send Email"
            aria-label="Send Email"
          >
            <Mail className="w-4 h-4" />
          </Link>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="ios-press md:hidden w-9 h-9 rounded-xl bg-[#161B20] border border-white/[0.08] flex items-center justify-center text-[#F2F4F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9323E]/50"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-[#0B0D10]/95 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-5 space-y-4 shadow-2xl"
          >
            <nav className="flex flex-col space-y-2" aria-label="Mobile navigation">
              {navLinks.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-sm font-mono uppercase tracking-wider rounded-lg transition-colors ${
                      activeSection === item.id
                        ? "text-[#D9323E] font-bold"
                        : "text-[#9CA6B2] hover:text-[#F2F4F4]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
