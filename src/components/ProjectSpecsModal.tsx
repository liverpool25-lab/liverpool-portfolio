"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { X, ExternalLink, Award, Globe, Code2, School } from "lucide-react";

interface ProjectSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectSpecsModal({ isOpen, onClose }: ProjectSpecsModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="specs-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
          onClick={onClose}
        >
          <motion.div
            key="specs-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="relative z-10 max-w-xl w-full bg-[#161B20] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-xs text-[#D9323E] uppercase font-bold tracking-wider">
                  {t("modal_specs_title")}
                </span>
                <h3 className="font-display text-2xl font-bold text-[#F2F4F4]">
                  Just Farm (Desa Bandungrejo)
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="ios-press w-9 h-9 rounded-full bg-[#1E242B] hover:bg-[#D9323E] hover:text-white text-[#F2F4F4] flex items-center justify-center transition-colors border border-white/10 shrink-0"
                aria-label={t("modal_specs_close")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 text-sm text-[#9CA6B2] leading-relaxed">
              <p>
                <strong className="text-[#F2F4F4]">{t("modal_spec_overview")}: </strong>
                Developed for the final Prodistik exhibition (Karya Akhir Prodistik), this simulation allows users to learn the crop rotation cycles of Desa Bandungrejo through high-performance HTML5 Canvas rendering.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#0B0D10] rounded-xl border border-white/[0.06] font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-[#9CA6B2] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#D9323E]" />
                    {t("modal_spec_deployment")}
                  </span>
                  <span className="text-[#F2F4F4] font-bold block truncate">
                    just-farm.netlify.app
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[#9CA6B2] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#C8F36B]" />
                    {t("modal_spec_grade")}
                  </span>
                  <span className="text-[#C8F36B] font-bold block">
                    {t("modal_spec_grade_value")}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[#9CA6B2] flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-[#72D9BC]" />
                    {t("modal_spec_engine")}
                  </span>
                  <span className="text-[#F2F4F4] font-bold block">
                    HTML5 Canvas / Vanilla JS
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[#9CA6B2] flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-[#D9323E]" />
                    {t("modal_spec_institution")}
                  </span>
                  <span className="text-[#F2F4F4] font-bold block">
                    SMAN 1 Pagak
                  </span>
                </div>
              </div>

              <p className="font-mono text-xs text-[#9CA6B2]/70 pt-1">
                {t("modal_spec_notice")}
              </p>
            </div>

            {/* Footer CTAs */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="ios-press px-4 py-2.5 bg-[#1E242B] border border-white/10 text-[#F2F4F4] font-display text-sm rounded-xl hover:bg-[#252C35] transition-colors"
              >
                {t("modal_specs_close")}
              </button>
              <a
                href="https://just-farm.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="ios-press inline-flex items-center gap-2 px-5 py-2.5 bg-[#D9323E] text-white font-display text-sm font-bold rounded-xl hover:bg-[#BF2430] transition-colors shadow-sm"
              >
                <span>{t("modal_specs_launch")}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
