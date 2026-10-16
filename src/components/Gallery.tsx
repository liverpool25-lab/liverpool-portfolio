"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { galleryItems } from "@/config/site";
import { GalleryCategory } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import Lightbox from "./Lightbox";
import { ChevronLeft, ChevronRight, Touchpad } from "lucide-react";

export default function Gallery() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  // Mouse drag-to-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const categories: { id: GalleryCategory; label: string }[] = [
    { id: "all", label: `${t("gallery_filter_all")} (${galleryItems.length})` },
    { id: "art", label: t("gallery_filter_art") },
    { id: "hiking", label: t("gallery_filter_hiking") },
    { id: "personal", label: t("gallery_filter_personal") },
    { id: "events", label: t("gallery_filter_events") },
  ];

  function scrollRail(direction: "left" | "right") {
    if (!railRef.current) return;
    const scrollAmount = direction === "left" ? -360 : 360;
    railRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!railRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - railRef.current.offsetLeft;
    scrollLeftStart.current = railRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !railRef.current) return;
    const x = e.pageX - railRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.4;
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }
    railRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleCardClick = (idx: number) => {
    if (hasDragged.current) return;
    setLightboxIndex(idx);
  };

  function handleCloseLightbox() {
    setLightboxIndex(null);
  }

  function handlePrevLightbox() {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev! > 0 ? prev! - 1 : filteredItems.length - 1
    );
  }

  function handleNextLightbox() {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev! < filteredItems.length - 1 ? prev! + 1 : 0
    );
  }

  return (
    <section
      className="w-full px-4 sm:px-6 md:px-8 py-20 bg-[#08090B] border-y border-white/[0.06] scroll-mt-20 overflow-hidden"
      id="gallery"
    >
      <div className="max-w-[1340px] mx-auto space-y-8">
        {/* Gallery Header & Navigation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <span className="font-mono text-xs tracking-widest text-[#D9323E] font-semibold uppercase block mb-2">
              {t("gallery_tag")}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F2F4F4]">
              {t("gallery_title")}
            </h2>
            <p className="text-base text-[#9CA6B2] mt-2 max-w-xl leading-relaxed">
              {t("gallery_desc")}
            </p>
          </div>

          {/* Filters & Scroll Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Filter buttons with iOS Spring Pill */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#161B20] border border-white/[0.08] rounded-2xl">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setHoveredCardIndex(null);
                    }}
                    className={`relative px-3 py-1.5 rounded-xl font-mono text-xs transition-colors duration-200 select-none ${
                      isActive ? "text-white font-bold" : "text-[#9CA6B2] hover:text-[#F2F4F4]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-gallery-filter"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        className="absolute inset-0 bg-[#D9323E] rounded-xl shadow-sm -z-10"
                      />
                    )}
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollRail("left")}
                className="ios-press w-10 h-10 rounded-xl bg-[#161B20] border border-white/[0.08] hover:border-[#D9323E]/50 text-[#F2F4F4] hover:text-[#D9323E] flex items-center justify-center transition-all shadow-md group"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                type="button"
                onClick={() => scrollRail("right")}
                className="ios-press w-10 h-10 rounded-xl bg-[#161B20] border border-white/[0.08] hover:border-[#D9323E]/50 text-[#F2F4F4] hover:text-[#D9323E] flex items-center justify-center transition-all shadow-md group"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* 3D Perspective Stage Container */}
        <div className="gallery-viewport-3d w-full overflow-hidden relative">
          {/* Edge vignettes */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#08090B] to-transparent z-20 pointer-events-none hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#08090B] to-transparent z-20 pointer-events-none hidden md:block" />

          {/* Scrollable Track with Drag & Wheel support */}
          <div
            ref={railRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              isDragging.current = false;
              setHoveredCardIndex(null);
            }}
            className="gallery-rail-3d no-scrollbar cursor-grab active:cursor-grabbing select-none"
          >
            {filteredItems.map((item, idx) => {
              const title = language === "id" ? item.titleId : item.titleEn;
              const sub = language === "id" ? item.subId : item.subEn;
              const badge = language === "id" ? item.badgeId : item.badgeEn;

              // Controlled coverflow calculation (Z and Y-rotation, zero vertical displacement)
              let transformStyle = "translateZ(0px) rotateY(0deg) scale(0.96)";
              let zIndex = 10;
              let opacity = 0.9;

              if (hoveredCardIndex !== null) {
                const diff = idx - hoveredCardIndex;
                if (diff === 0) {
                  // Active focused card: subtle scale and elevation
                  transformStyle = "translateZ(40px) rotateY(0deg) scale(1.02)";
                  zIndex = 30;
                  opacity = 1;
                } else if (diff === -1) {
                  // Immediate left neighbor leans toward active card
                  transformStyle = "translateZ(10px) rotateY(12deg) scale(0.95)";
                  zIndex = 20;
                  opacity = 0.88;
                } else if (diff === 1) {
                  // Immediate right neighbor leans toward active card
                  transformStyle = "translateZ(10px) rotateY(-12deg) scale(0.95)";
                  zIndex = 20;
                  opacity = 0.88;
                } else if (diff < -1) {
                  transformStyle = "translateZ(-20px) rotateY(18deg) scale(0.9)";
                  zIndex = 10;
                  opacity = 0.75;
                } else if (diff > 1) {
                  transformStyle = "translateZ(-20px) rotateY(-18deg) scale(0.9)";
                  zIndex = 10;
                  opacity = 0.75;
                }
              }

              return (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(idx)}
                  onMouseEnter={() => setHoveredCardIndex(idx)}
                  style={{
                    transform: transformStyle,
                    zIndex,
                    opacity,
                  }}
                  className="coverflow-card shrink-0 w-[270px] sm:w-[310px] snap-center bg-[#161B20] border border-white/[0.08] hover:border-[#D9323E]/50 rounded-2xl overflow-hidden cursor-pointer select-none shadow-xl group"
                >
                  <div className="w-full aspect-[3/4] overflow-hidden bg-black relative">
                    <Image
                      src={item.src}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 270px, 310px"
                      className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out pointer-events-none"
                    />
                    {badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/80 border border-white/10 text-[#D9323E] font-mono text-[11px] rounded-full uppercase backdrop-blur-sm shadow-md font-bold">
                        {badge}
                      </span>
                    )}
                  </div>

                  <div className="p-4 bg-[#161B20] border-t border-white/[0.06]">
                    <div className="font-display text-base font-bold text-[#F2F4F4] truncate group-hover:text-[#D9323E] transition-colors">
                      {title}
                    </div>
                    <div className="font-mono text-xs text-[#9CA6B2] flex items-center justify-between mt-1">
                      <span className="truncate">{sub}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gallery Meta Index Tracker */}
        <div className="flex items-center justify-between font-mono text-xs text-[#9CA6B2] pt-2 border-t border-white/[0.06]">
          <span className="flex items-center gap-2">
            <Touchpad className="w-4 h-4 text-[#D9323E]" />
            <span>{t("gallery_click_tip")}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#D9323E] font-bold">{galleryItems.length}</span>
            <span>{t("gallery_total_items")}</span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        item={lightboxIndex !== null ? filteredItems[lightboxIndex] : null}
        onClose={handleCloseLightbox}
        onPrev={handlePrevLightbox}
        onNext={handleNextLightbox}
      />
    </section>
  );
}
