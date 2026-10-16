"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Terminal, Shield, CheckCircle2, Cpu } from "lucide-react";

export default function About() {
  const { t } = useLanguage();

  const techStack = [
    {
      category: t("cat_front"),
      color: "#D9323E",
      skills: ["HTML5", "CSS3", "JavaScript (ES6+)", "Tailwind CSS"],
    },
    {
      category: t("cat_frameworks"),
      color: "#C8F36B",
      skills: ["React", "Laravel", "Next.js"],
    },
    {
      category: t("cat_back"),
      color: "#72D9BC",
      skills: ["PHP", "Python", "MySQL", "REST APIs"],
    },
    {
      category: t("cat_tools"),
      color: "#D9323E",
      skills: ["Git", "GitHub", "Vercel", "Figma", "Canva", "CapCut"],
    },
  ];

  return (
    <section
      className="w-full px-4 sm:px-6 md:px-8 py-20 bg-[#08090B] border-y border-white/[0.06] scroll-mt-20 overflow-hidden"
      id="about"
    >
      <div className="max-w-[1240px] mx-auto space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2"
        >
          <div className="max-w-2xl">
            <div className="font-mono text-xs tracking-widest text-[#D9323E] uppercase mb-2.5 font-semibold">
              {t("about_tag")}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#F2F4F4] leading-tight font-bold">
              {t("about_heading")}
            </h2>
          </div>
          <p className="text-base text-[#9CA6B2] max-w-md leading-relaxed">
            {t("about_sub")}
          </p>
        </motion.div>

        {/* Dual Core Pillars: Build & Defend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 01: BUILD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#161B20] p-8 sm:p-10 rounded-2xl border border-white/[0.08] hover:border-[#D9323E]/40 transition-colors duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-xs px-3 py-1 bg-[#1E242B] rounded-lg text-[#D9323E] uppercase font-bold tracking-wider">
                  01 / CAPABILITY
                </span>
                <Terminal className="w-7 h-7 text-[#D9323E] group-hover:scale-110 transition-transform duration-200" />
              </div>

              <h3 className="font-display text-2xl text-[#F2F4F4] tracking-tight mb-3 font-bold">
                {t("pillar_build_title")}
              </h3>

              <p className="text-sm sm:text-base text-[#9CA6B2] leading-relaxed mb-8">
                {t("pillar_build_desc")}
              </p>
            </div>

            <div className="space-y-3 pt-5 border-t border-white/[0.06]">
              <div className="flex items-center gap-2.5 font-mono text-xs text-[#F2F4F4]">
                <CheckCircle2 className="w-4 h-4 text-[#D9323E] shrink-0" />
                <span>{t("pillar_build_item1")}</span>
              </div>
              <div className="flex items-center gap-2.5 font-mono text-xs text-[#F2F4F4]">
                <CheckCircle2 className="w-4 h-4 text-[#D9323E] shrink-0" />
                <span>{t("pillar_build_item2")}</span>
              </div>
              <div className="flex items-center gap-2.5 font-mono text-xs text-[#F2F4F4]">
                <CheckCircle2 className="w-4 h-4 text-[#D9323E] shrink-0" />
                <span>{t("pillar_build_item3")}</span>
              </div>
            </div>
          </motion.div>

          {/* Pillar 02: DEFEND */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#161B20] p-8 sm:p-10 rounded-2xl border border-white/[0.08] hover:border-[#72D9BC]/40 transition-colors duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-xs px-3 py-1 bg-[#1E242B] rounded-lg text-[#72D9BC] uppercase font-bold tracking-wider">
                  02 / RESILIENCE
                </span>
                <Shield className="w-7 h-7 text-[#72D9BC] group-hover:scale-110 transition-transform duration-200" />
              </div>

              <h3 className="font-display text-2xl text-[#F2F4F4] tracking-tight mb-3 font-bold">
                {t("pillar_defend_title")}
              </h3>

              <p className="text-sm sm:text-base text-[#9CA6B2] leading-relaxed mb-8">
                {t("pillar_defend_desc")}
              </p>
            </div>

            <div className="space-y-3 pt-5 border-t border-white/[0.06]">
              <div className="flex items-center gap-2.5 font-mono text-xs text-[#F2F4F4]">
                <CheckCircle2 className="w-4 h-4 text-[#72D9BC] shrink-0" />
                <span>{t("pillar_defend_item1")}</span>
              </div>
              <div className="flex items-center gap-2.5 font-mono text-xs text-[#F2F4F4]">
                <CheckCircle2 className="w-4 h-4 text-[#72D9BC] shrink-0" />
                <span>{t("pillar_defend_item2")}</span>
              </div>
              <div className="flex items-center gap-2.5 font-mono text-xs text-[#F2F4F4]">
                <CheckCircle2 className="w-4 h-4 text-[#72D9BC] shrink-0" />
                <span>{t("pillar_defend_item3")}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categorized Technical Repertoire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#161B20] p-8 sm:p-10 rounded-2xl border border-white/[0.08] space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <span className="font-mono text-xs tracking-widest text-[#D9323E] font-semibold uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              {t("tech_title")}
            </span>
            <span className="font-mono text-[11px] text-[#9CA6B2]/70">
              {t("tech_verified")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {techStack.map((group, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="font-display text-sm font-semibold text-[#F2F4F4] flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <span>{group.category}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="ios-press px-2.5 py-1 bg-[#1E242B] rounded-lg border border-white/[0.06] font-mono text-xs text-[#F2F4F4] hover:border-white/20 transition-colors select-none"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
