"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ item, onClose, onPrev, onNext }: LightboxProps) {
  const { language, t } = useLanguage();
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }

    if (item) {
      window.addEventListener("keydown", handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [item, onClose, onPrev, onNext]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (diff > 50) {
      onPrev();
    } else if (diff < -50) {
      onNext();
    }
    touchStartX.current = null;
  };

  const title = item ? (language === "id" ? item.titleId : item.titleEn) : "";
  const caption = item ? (language === "id" ? item.captionId : item.captionEn) : "";
  const categoryLabel = item ? (language === "id" ? item.categoryLabelId : item.categoryLabelEn) : "";
  const sub = item ? (language === "id" ? item.subId : item.subEn) : "";

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 md:p-8 select-none"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Prev button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="ios-press absolute left-3 md:left-8 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#161B20]/80 hover:bg-[#D9323E] hover:text-white border border-white/10 text-[#F2F4F4] flex items-center justify-center transition-colors shadow-xl"
            aria-label={t("lightbox_prev")}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="ios-press absolute right-3 md:right-8 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#161B20]/80 hover:bg-[#D9323E] hover:text-white border border-white/10 text-[#F2F4F4] flex items-center justify-center transition-colors shadow-xl"
            aria-label={t("lightbox_next")}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Modal Dialog with iOS Spring Scaling */}
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="relative z-20 max-w-[94vw] max-h-[92vh] flex flex-col bg-[#161B20] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-[#08090B] border-b border-white/[0.08]">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#1E242B] border border-white/10 text-[#D9323E] font-mono text-[10px] rounded uppercase font-bold shrink-0">
                    {categoryLabel}
                  </span>
                  <h3 className="font-display text-sm sm:text-base md:text-lg text-[#F2F4F4] font-bold truncate">
                    {title}
                  </h3>
                </div>
                <p className="font-mono text-xs text-[#9CA6B2] mt-0.5 truncate">{sub}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="ios-press w-9 h-9 rounded-full bg-[#1E242B] hover:bg-[#D9323E] hover:text-white text-[#F2F4F4] border border-white/10 flex items-center justify-center transition-colors shadow-md shrink-0"
                aria-label={t("lightbox_close")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Enlarged Image Container */}
            <div className="relative p-2 sm:p-4 flex items-center justify-center bg-black/60 overflow-hidden min-h-[260px] max-h-[68vh]">
              <img
                src={item.src}
                alt={title}
                className="max-h-[66vh] max-w-[86vw] w-auto h-auto object-contain rounded-lg shadow-2xl select-none"
              />
            </div>

            {/* Footer Caption */}
            <div className="px-5 sm:px-6 py-3 bg-[#08090B] border-t border-white/[0.08] flex items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-[#9CA6B2] leading-relaxed line-clamp-2 sm:line-clamp-none">
                {caption}
              </p>
              <span className="font-mono text-[11px] text-[#9CA6B2]/60 hidden sm:inline shrink-0">
                [ESC] · [← / →]
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
