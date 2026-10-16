# Liverpool Developer Portfolio — Production Website

A personal developer portfolio application engineered for **Liverpool**, student at SMAN 1 Pagak and developing technologist focusing on full-stack web applications and cybersecurity.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, and Supabase SSR (Auth & PostgreSQL).

---

## 🌟 Key Features

1. **Editorial & Tactical Aesthetics**:
   - High-contrast visual architecture inspired by Stitch and curated portfolios.
   - Space Grotesk display typography, Inter body prose, and JetBrains Mono technical telemetry.
   - Spider-Man Red accent (`#D9323E`) with bioluminescent Lime (`#C8F36B`) and Mint (`#72D9BC`) indicators.

2. **Welcome Intro Sequence**:
   - First-visit animated entrance: *"Welcome To My Portofolio Website"* followed by *"Liverpool"*.
   - Red accent stroke and curtain reveal exit.
   - Session storage persistence, skip button, and reduced-motion compliance.

3. **Bilingual Translation System (ID / EN)**:
   - Full-site reactive language toggle `[ ID | EN ]`.
   - Comprehensive translation coverage for all headings, project descriptions, gallery captions, guestbook messages, and auth dialogs.
   - Preserves selection in browser `localStorage`.

4. **Spider-Man Spotlight Portrait Reveal**:
   - Authentic photograph (`Foto Utama.png`) with calibrated Spider-Man overlay (`Spiderman.png`).
   - Feathered radial cursor spotlight mask driven by `requestAnimationFrame`.
   - Mobile touch fallback and reduced-motion support.

5. **3D Coverflow Horizontal Gallery**:
   - 15 authentic items across Digital Art, Mountain Expeditions, Personal moments, and Academic competitions.
   - Single horizontal rail with perspective origin.
   - Interactive neighbor tilt where adjacent cards lean toward the active item.
   - Fullscreen Lightbox with quick zoom, keyboard arrow navigation (`←` / `→`), and `Escape` support.

6. **Selected Projects Index**:
   - **Just Farm**: Web game created for Desa Bandungrejo (Prodistik Finalist), live demo link, and detailed specifications modal.
   - **Mobile Legends ID Checker**: Fast web utility (Roadmap preview with lab development snapshot).
   - **Liverpool Developer Portfolio**: The evolving personal architecture with v2 dark edition release details.

7. **Real Supabase Authentication & PostgreSQL Guestbook**:
   - Real Google OAuth sign-in flow and Email/Password sign-up/sign-in.
   - SSR cookie handling via `@supabase/ssr` with `/auth/callback` code exchange route.
   - Password reset flow with `/auth/update-password` page.
   - PostgreSQL storage with Row Level Security (RLS) policies.
   - Public read access for notes, authenticated write access, character counter (500 max), server-side Zod validation, and honeypot anti-spam defense.

8. **Direct Contact & Verified Social Matrix**:
   - Direct email `klivliverpool1@gmail.com` with one-click copy feedback.
   - Verified channels for Instagram (`@clivvr_`), TikTok (`@lipptitikcom`), and YouTube (`@OfficialLivvID`).

---

## 📁 Project Architecture

```
├── public/
│   └── assets/
│       ├── portrait.png            # Authentic personal photo
│       ├── spiderman.png           # Calibrated overlay
│       ├── projects/               # Project screenshots
│       └── gallery/                # 15 authentic gallery items
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── callback/route.ts   # OAuth code exchange handler
│   │   │   └── update-password/    # Password reset page
│   │   ├── api/guestbook/route.ts  # Server actions & guestbook API
│   │   ├── globals.css             # 3D transforms, masks & design tokens
│   │   ├── layout.tsx              # Root layout with fonts & providers
│   │   └── page.tsx                # Main single-page application
│   ├── components/
│   │   ├── WelcomeIntro.tsx        # Welcome opening animation
│   │   ├── Header.tsx              # Sticky header with [ ID | EN ]
│   │   ├── Hero.tsx                # Hero & Spider-Man spotlight
│   │   ├── About.tsx               # Build & Defend pillars
│   │   ├── Projects.tsx            # Selected projects showcase
│   │   ├── ProjectSpecsModal.tsx   # Just Farm specs modal
│   │   ├── Gallery.tsx             # 3D coverflow gallery
│   │   ├── Lightbox.tsx            # Fullscreen lightbox dialog
│   │   ├── Guestbook.tsx           # PostgreSQL notes feed & composer
│   │   ├── AuthModal.tsx           # Google & email authentication modal
│   │   ├── SetupNoticeModal.tsx    # Supabase setup guide dialog
│   │   ├── Contact.tsx             # Direct email & social links
│   │   └── Footer.tsx              # Footer & back-to-top
│   ├── config/
│   │   └── site.ts                 # Centralized configuration & links
│   ├── context/
│   │   ├── AuthContext.tsx         # Supabase Auth state & methods
│   │   └── LanguageContext.tsx     # ID / EN translation state
│   ├── lib/
│   │   ├── supabase/               # Browser & server SSR clients
│   │   ├── translations.ts         # Full bilingual dictionary
│   │   └── utils.ts                # Formatting and utility functions
│   └── types/
│       └── index.ts                # TypeScript interfaces
└── supabase/
    ├── migrations/                 # Versioned SQL migrations
    └── README.md                   # Database setup guide
```

---

## 🚀 Local Development

1. **Clone or open the workspace**:
   ```bash
   cd "Liverpool Portofolio"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials (see setup below):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-anon-key
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run production build**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🗄️ Supabase & Database Setup

1. **Create a project**:
   - Visit [supabase.com](https://supabase.com/) and create a new project.
   - Note down your **Project URL** and **anon public key** from `Project Settings > API`.

2. **Run SQL Migration**:
   - In Supabase Dashboard, open **SQL Editor**.
   - Paste the contents of `supabase/migrations/20261014000000_init_auth_guestbook.sql` and run.
   - This creates `public.profiles` and `public.guestbook` with strict Row Level Security (RLS) policies.

3. **Enable Authentication Providers**:
   - **Google OAuth**:
     1. Open [Google Cloud Console](https://console.cloud.google.com/).
     2. Create an OAuth 2.0 Web Client ID.
     3. Add Authorized redirect URI from Supabase: `https://<your-project-ref>.supabase.co/auth/v1/callback`.
     4. Paste Google Client ID & Secret in Supabase `Authentication > Providers > Google`.
   - **Email / Password**:
     1. Enable Email provider under `Authentication > Providers > Email`.
     2. For production, configure custom SMTP under `Project Settings > Authentication > SMTP Settings`.

4. **Set Redirect URLs**:
   - In Supabase under `Authentication > URL Configuration`:
     - Site URL: `https://your-domain.vercel.app` (or `http://localhost:3000` locally)
     - Redirect URLs: `http://localhost:3000/**`, `https://your-domain.vercel.app/**`

---

## 🌐 Deploy to Vercel

1. Push your repository to **GitHub**.
2. Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your GitHub repository.
4. Add the Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.
6. After deployment completes:
   - Copy your production Vercel URL (e.g., `https://liverpool-portfolio.vercel.app`).
   - Add it to **Google Cloud Console** under Authorized JavaScript origins.
   - Add it to **Supabase** under Site URL and Redirect URLs.

---

## ✏️ How to Customize

- **Add New Projects**: Edit `projectsData` in `src/config/site.ts`.
- **Add Gallery Images**: Add image files to `public/assets/gallery/` and append entries to `galleryItems` in `src/config/site.ts`.
- **Update Social Links or Email**: Modify `siteConfig.socials` or `siteConfig.email` in `src/config/site.ts`.
- **Edit Translations**: Update phrases in `src/lib/translations.ts`.
