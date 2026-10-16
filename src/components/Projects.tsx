"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { projectsData } from "@/config/site";
import ProjectSpecsModal from "./ProjectSpecsModal";
import { ExternalLink, Info, ArrowUpRight, Clock } from "lucide-react";
import { TranslationKey } from "@/lib/translations";

export default function Projects() {
  const { t } = useLanguage();
  const [specsModalOpen, setSpecsModalOpen] = useState(false);

  const justFarm = projectsData.find((p) => p.id === "just-farm")!;
  const mlChecker = projectsData.find((p) => p.id === "ml-checker")!;
  const portfolio = projectsData.find((p) => p.id === "portfolio")!;

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 py-20 scroll-mt-20 overflow-hidden" id="projects">
      <div className="max-w-[1240px] mx-auto space-y-14">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2"
        >
          <div>
            <span className="font-mono text-xs tracking-widest text-[#D9323E] uppercase block mb-2 font-semibold">
              {t("proj_tag")}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F2F4F4]">
              {t("proj_heading")}
            </h2>
          </div>
          <p className="text-base text-[#9CA6B2] max-w-md leading-relaxed">
            {t("proj_sub")}
          </p>
        </motion.div>

        {/* Project 01: Hero Project (Just Farm) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#161B20] rounded-2xl border border-white/[0.08] overflow-hidden grid grid-cols-1 lg:grid-cols-12 group hover:border-[#D9323E]/40 transition-colors duration-300 shadow-xl"
        >
          {/* Visual Presentation */}
          <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[480px] overflow-hidden bg-black">
            <Image
              src={justFarm.image}
              alt="Liverpool presenting Just Farm project during Prodistik examination"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover opacity-90 group-hover:scale-103 group-hover:opacity-100 transition-all duration-500 ease-out"
              style={{ objectPosition: "center 18%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-transparent to-transparent opacity-80 pointer-events-none" />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 bg-[#D9323E] text-white font-mono text-xs font-bold rounded-full uppercase flex items-center gap-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>LIVE DEMO</span>
              </span>
              <span className="px-3 py-1 bg-black/75 text-[#F2F4F4] font-mono text-xs rounded-full backdrop-blur-md border border-white/10">
                {justFarm.badge}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-[#F2F4F4] flex items-center justify-between text-xs font-mono">
              <span className="text-white/80">PRODISTIK KARYA AKHIR EXHIBITION</span>
              <span className="text-[#D9323E] font-semibold">SMAN 1 PAGAK</span>
            </div>
          </div>

          {/* Project Details */}
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#D9323E] tracking-wider uppercase font-bold">
                  NO. 01 · {t(justFarm.categoryKey as TranslationKey)}
                </span>
                <span className="font-mono text-xs text-[#9CA6B2]">
                  {justFarm.timeline}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F2F4F4]">
                {justFarm.title}
              </h3>

              <p className="text-sm sm:text-base text-[#9CA6B2] leading-relaxed">
                {t(justFarm.descriptionKey as TranslationKey)}
              </p>

              <div className="pt-2">
                <span className="font-mono text-xs text-[#9CA6B2]/80 block uppercase mb-2">
                  {t("tech_used")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {justFarm.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-[#1E242B] rounded-lg border border-white/[0.06] font-mono text-xs text-[#F2F4F4]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs with iOS Spring Press */}
            <div className="pt-6 flex items-center gap-4">
              <a
                href={justFarm.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ios-press inline-flex items-center gap-2 px-5 py-3 bg-[#D9323E] text-white font-display text-sm font-bold rounded-xl hover:bg-[#BF2430] transition-colors shadow-sm"
              >
                <span>{t("btn_live_project")}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setSpecsModalOpen(true)}
                className="ios-press inline-flex items-center gap-2 px-4 py-3 bg-[#1E242B] border border-white/10 text-[#F2F4F4] font-display text-sm font-medium rounded-xl hover:border-[#D9323E]/40 transition-colors"
              >
                <span>{t("btn_view_specs")}</span>
                <Info className="w-4 h-4 text-[#9CA6B2]" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Secondary Projects Grid (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project 02: Mobile Legends ID Checker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#161B20] p-8 rounded-2xl border border-white/[0.08] hover:border-[#72D9BC]/40 transition-colors duration-300 flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#72D9BC] font-bold uppercase">
                  NO. 02 · {t(mlChecker.categoryKey as TranslationKey)}
                </span>
                <span className="px-2.5 py-0.5 bg-[#1E242B] font-mono text-xs text-[#9CA6B2] border border-white/[0.06] rounded-full">
                  {mlChecker.badge}
                </span>
              </div>

              {/* Media Snapshot */}
              <div className="w-full h-44 bg-[#0B0D10] rounded-xl overflow-hidden relative">
                <Image
                  src={mlChecker.image}
                  alt="Team development lab session for web utilities"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B20] via-transparent to-transparent pointer-events-none" />
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-[#F2F4F4] mb-2">
                  {mlChecker.title}
                </h3>
                <p className="text-sm text-[#9CA6B2] leading-relaxed">
                  {t(mlChecker.descriptionKey as TranslationKey)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {mlChecker.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 bg-[#1E242B] rounded-lg border border-white/[0.06] font-mono text-xs text-[#F2F4F4]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 flex items-center justify-between border-t border-white/[0.06] text-xs font-mono text-[#9CA6B2]">
              <span>{t(mlChecker.statusKey as TranslationKey)}</span>
              <Clock className="w-4 h-4 text-[#72D9BC]" />
            </div>
          </motion.div>

          {/* Project 03: Liverpool Portfolio Platform */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#161B20] p-8 rounded-2xl border border-white/[0.08] hover:border-[#D9323E]/40 transition-colors duration-300 flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#D9323E] font-bold uppercase">
                  NO. 03 · {t(portfolio.categoryKey as TranslationKey)}
                </span>
                <span className="px-2.5 py-0.5 bg-[#1E242B] font-mono text-xs text-[#D9323E] border border-[#D9323E]/20 font-bold rounded-full">
                  {portfolio.badge}
                </span>
              </div>

              {/* Visual Concept Card */}
              <div className="w-full h-44 bg-[#0B0D10] rounded-xl flex flex-col justify-center items-center p-6 text-center relative overflow-hidden border border-white/[0.06]">
                <div className="font-mono text-xs text-[#D9323E]/80 mb-1">
                  DESIGN TOKEN: EDITORIAL MODERN
                </div>
                <div className="font-display text-2xl font-bold text-[#F2F4F4] tracking-wider">
                  LIVERPOOL.DEV
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-[#D9323E] animate-pulse" />
                  <span className="font-mono text-xs text-[#9CA6B2]">
                    3D Coverflow &amp; Spider-Man Spotlight
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-[#F2F4F4] mb-2">
                  {portfolio.title}
                </h3>
                <p className="text-sm text-[#9CA6B2] leading-relaxed">
                  {t(portfolio.descriptionKey as TranslationKey)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {portfolio.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 bg-[#1E242B] rounded-lg border border-white/[0.06] font-mono text-xs text-[#F2F4F4]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 flex items-center justify-between border-t border-white/[0.06]">
              <Link
                href="#home"
                className="ios-press inline-flex items-center gap-1 font-mono text-xs text-[#D9323E] font-semibold hover:underline"
              >
                <span>{t("btn_current_view")}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <span className="font-mono text-xs text-[#9CA6B2]">
                {portfolio.timeline}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Specs Modal */}
      <ProjectSpecsModal
        isOpen={specsModalOpen}
        onClose={() => setSpecsModalOpen(false)}
      />
    </section>
  );
}
