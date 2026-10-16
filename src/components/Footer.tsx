"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[#050608] border-t border-white/[0.06] mt-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & School */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
          <span className="font-display text-base font-bold text-[#F2F4F4]">
            LIVERPOOL <span className="text-[#D9323E]">·</span> SMAN 1 Pagak
          </span>
          <span className="font-mono text-xs text-[#9CA6B2]">
            © {new Date().getFullYear()} {t("footer_rights")} · Personal Edition
          </span>
        </div>

        {/* Links & Back to top */}
        <div className="flex items-center gap-6">
          <Link
            href="#projects"
            className="ios-press font-mono text-xs text-[#9CA6B2] hover:text-[#D9323E] transition-colors"
          >
            {t("nav_projects")}
          </Link>
          <Link
            href="#gallery"
            className="ios-press font-mono text-xs text-[#9CA6B2] hover:text-[#D9323E] transition-colors"
          >
            {t("nav_gallery")}
          </Link>
          <Link
            href="#contact"
            className="ios-press font-mono text-xs text-[#9CA6B2] hover:text-[#D9323E] transition-colors"
          >
            {t("nav_contact")}
          </Link>

          <Link
            href="#home"
            className="ios-press flex items-center gap-1 font-mono text-xs text-[#D9323E] hover:underline transition-all"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{t("footer_back_to_top")}</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
