# Implementation Plan — Liverpool Portfolio Full-Stack Application

This plan outlines the architecture, technology stack, features, and step-by-step roadmap for building the production-ready Liverpool personal developer portfolio based on the Google Stitch project (`7830909398334811182`), screen `2d2d7268e0ac4fa980e444fb0f1e18c4`, and the detailed implementation brief.

---

## 1. Architecture & Technology Stack

- **Framework**: Next.js 15+ (App Router) with React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design tokens matching Stitch & Editorial aesthetics:
  - Base warm ivory (#F6F4EF) / Obsidian dark (#0B0D10)
  - Spider-Man Red (#D9323E) accent
  - Acid Lime (#C8F36B) / Soft Mint (#72D9BC) tech accents
  - Space Grotesk (display/headlines), Inter / Manrope (body prose), JetBrains Mono (tech telemetry/labels)
- **Animation & Motion**: Motion (`framer-motion`) for:
  - Welcome Intro sequence (text reveal, red accent line, curtain exit)
  - Typewriter effect for supporting headline lines
  - Hero Spider-Man interactive spotlight reveal with radial feathering
  - 3D Coverflow Horizontal Gallery with interactive tilt and neighbor lean
  - Smooth Lightbox shared-layout transition
- **Authentication**: Supabase Auth (SSR via `@supabase/ssr` with Next.js cookie handling):
  - Google OAuth sign-in flow
  - Email/password sign-up and sign-in with email confirmation awareness
  - Password reset and update flows
  - Graceful developer guidance dialog when keys are not yet configured in `.env.local`
- **Database**: Supabase PostgreSQL:
  - `profiles` table synced with `auth.users`
  - `guestbook` table with strict Row Level Security (RLS) policies
  - Server actions with Zod validation, HTML sanitization, and honeypot spam defense
- **Icons**: Lucide React + Material Symbols where exact match is required
- **Images**: `next/image` referencing local assets copied to `public/assets/`

---

## 2. Asset Mapping (`ASSET_MAP.md`)

- **Hero Portrait**: `public/assets/portrait.png` (from `assets/Foto Utama.png`)
- **Spider-Man Overlay**: `public/assets/spiderman.png` (from `assets/Spiderman.png`)
- **Projects**:
  - Just Farm: `public/assets/projects/just-farm.jpg` (from `assets/Prodistik/Presentasi Karya Akhir Prodistik.jpg`)
  - ML ID Checker: `public/assets/projects/ml-checker.jpg` (from `assets/Personal/2035518.jpg`)
  - Personal Portfolio: Interactive visual card & mock interface
- **Gallery (15 authentic items)**:
  - Digital Art: `assets/Gallery Art/Art 1.png` - `Art 6.png`
  - Hiking & Nature: `Mt. Arjuno`, `Mt. Kawi`, `Mt. Kelud`, `Mt. Lawu`
  - Personal & Moments: `assets/Personal/2035518.jpg`, `2035586.jpg`, `560935.jpg`, `582566.jpg`
  - Tech & Academic: `Brawijaya Student Competition.jpg`, `2598199.jpg` (Cyber Security), `Presentasi Karya Akhir Prodistik.jpg`

---

## 3. Implementation Steps

1. **Phase 1: Project Initialization & Dependency Setup**
   - Initialize Next.js App Router project in the root workspace
   - Install required dependencies: `motion`, `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `lucide-react`, `clsx`, `tailwind-merge`
   - Configure Tailwind, fonts (`Space Grotesk`, `Inter`, `JetBrains Mono`), and metadata

2. **Phase 2: Assets Integration & Copying**
   - Copy assets from `assets/` into `public/assets/` structured subfolders with URL-safe filenames

3. **Phase 3: Design Tokens & System Styles**
   - Setup `globals.css` with custom utility classes for the 3D coverflow, spotlight mask, and color tokens

4. **Phase 4: Welcome Intro Animation**
   - Component `WelcomeIntro.tsx`
   - Exact text: "Welcome To My Portofolio Website" and "Liverpool"
   - Session storage persistence, skip button, reduced motion support

5. **Phase 5: Navigation & Language Switcher**
   - Navigation items: Home, About, Projects, Gallery, Contact
   - Wordmark: "LIVERPOOL."
   - Indonesian / English translation dictionary (`src/lib/translations.ts`)
   - Reactive language state with localStorage persistence

6. **Phase 6: Asymmetric Hero & Typewriter Effect**
   - Accurate titles and descriptions in EN & ID
   - Interactive CTAs, status badges, and academic location tags
   - Controlled typewriter phrases with zero layout shift

7. **Phase 7: Spider-Man Portrait Reveal with Radial Mask**
   - Smooth mouse tracking via `requestAnimationFrame`
   - Calibrated scale, offset, and 0.65 opacity overlay
   - Feathered radial gradient mask and cursor reticle
   - Mobile touch fallback

8. **Phase 8: About & Technology Repertoire**
   - Dual pillars: "Build" (Full-Stack) & "Defend" (Cybersecurity / OWASP)
   - SMAN 1 Pagak student profile
   - Categorized skills: Frontend, Frameworks, Backend, Database, Version Control, Design

9. **Phase 9: Selected Projects (Editorial Showcase)**
   - 01 Just Farm (Web game live link, specs modal)
   - 02 ML ID Checker (Web utility, roadmap badge)
   - 03 Liverpool Portfolio (Personal architecture, v2 details)

10. **Phase 10: 3D Horizontal Gallery with Magnetic Tilt & Lightbox**
    - Single horizontal scroll track with category filtering
    - Perspective tilt where focused card stands out and neighbor cards lean toward it
    - Smooth lightbox dialog with full-screen zoom, keyboard arrows, and Escape support

11. **Phase 11 & 12: Supabase Auth & Guestbook with PostgreSQL**
    - Supabase client and server helpers with cookie SSR
    - Google OAuth sign-in, Email/password sign-up/sign-in, Forgot password modal
    - Guestbook with real database query, authenticated posting, character counter, optimistic updates, and Zod validation
    - Versioned SQL migrations (`supabase/migrations/20261014000000_init_auth_guestbook.sql`) with RLS policies

12. **Phase 13 & 14: Contact, Social Matrix & Micro-Interactions**
    - Direct email `klivliverpool1@gmail.com` with one-click copy feedback
    - Instagram, TikTok, YouTube links, and GitHub/LinkedIn status
    - Magnetic button subtle pull, scroll-to-top button

13. **Phase 15 - 19: Testing, Optimization, Browser Inspection & Documentation**
    - TypeScript compilation, ESLint validation, Next.js production build
    - Browser subagent visual inspection on desktop and mobile viewports
    - Comprehensive `README.md` with Supabase, Google Cloud, and Vercel deployment guides
