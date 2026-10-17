[35mREADME.md[m[36m:[m[32m44[m[36m:[m   - SSR cookie handling via `@supabase/ssr` with `/[1;31mauth/callback[m` code exchange route.
[35mREADME.md[m[36m:[m[32m124[m[36m:[m   [1;31mNEXT_PUBLIC_SUPABASE[m_URL=https://your-project.supabase.co
[35mREADME.md[m[36m:[m[32m125[m[36m:[m   [1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY=your-publishable-anon-key
[35mREADME.md[m[36m:[m[32m176[m[36m:[m   - `[1;31mNEXT_PUBLIC_SUPABASE[m_URL`
[35mREADME.md[m[36m:[m[32m177[m[36m:[m   - `[1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY`
[35mSETUP.md[m[36m:[m[32m38[m[36m:[m   [1;31mNEXT_PUBLIC_SUPABASE[m_URL=https://your-project-id.supabase.co
[35mSETUP.md[m[36m:[m[32m39[m[36m:[m   [1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY=your-anon-key-here
[35mSETUP.md[m[36m:[m[32m46[m[36m:[m   - Add `http://localhost:3000/[1;31mauth/callback[m` for local development.
[35mSETUP.md[m[36m:[m[32m50[m[36m:[m## 2. Contact Form — Email Delivery via [1;31mResend[m
[35mSETUP.md[m[36m:[m[32m52[m[36m:[mThe contact form API (`/[1;31mapi/contact[m`) delivers messages to `klivliverpool1@gmail.com` using **[1;31mResend[m**.
[35mSETUP.md[m[36m:[m[32m56[m[36m:[m1. **Create a [1;31mResend[m account** at [[1;31mresend[m.com](https://[1;31mresend[m.com).
[35mSETUP.md[m[36m:[m[32m60[m[36m:[m   - Until your domain is verified, you can use `onboarding@[1;31mresend[m.dev` for testing (emails only go to your [1;31mResend[m account email).
[35mSETUP.md[m[36m:[m[32m68[m[36m:[m   [1;31mRESEND[m_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
[35mSETUP.md[m[36m:[m[32m75[m[36m:[m   curl -X POST http://localhost:3000/[1;31mapi/contact[m \
[35mSETUP.md[m[36m:[m[32m81[m[36m:[m> **Note:** Without `[1;31mRESEND[m_API_KEY` set, the endpoint returns a `503` and instructs the visitor to use the Gmail compose button. The site remains fully usable.
[35mSETUP.md[m[36m:[m[32m95[m[36m:[m| Google OAuth login | `[1;31mNEXT_PUBLIC_SUPABASE[m_URL`, `[1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY` | Enable Google provider in Supabase |
[35mSETUP.md[m[36m:[m[32m97[m[36m:[m| Contact form delivery | `[1;31mRESEND[m_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM` | Verify sender domain in [1;31mResend[m |
[35mSETUP.md[m[36m:[m[32m106[m[36m:[m- The `[1;31mRESEND[m_API_KEY` is server-only and never sent to the browser.
[35msrc/app/api/contact/route.ts[m[36m:[m[32m24[m[36m:[m// ─── POST /[1;31mapi/contact[m ────────────────────────────────────────────────────────
[35msrc/app/api/contact/route.ts[m[36m:[m[32m52[m[36m:[m  // 4. Check for [1;31mResend[m API key
[35msrc/app/api/contact/route.ts[m[36m:[m[32m53[m[36m:[m  const [1;31mresend[mApiKey = process.env.[1;31mRESEND[m_API_KEY;
[35msrc/app/api/contact/route.ts[m[36m:[m[32m57[m[36m:[m  if (![1;31mresend[mApiKey) {
[35msrc/app/api/contact/route.ts[m[36m:[m[32m71[m[36m:[m  // 5. Send via [1;31mResend[m
[35msrc/app/api/contact/route.ts[m[36m:[m[32m73[m[36m:[m    const [1;31mresend[mResponse = await fetch("https://api.[1;31mresend[m.com/emails", {
[35msrc/app/api/contact/route.ts[m[36m:[m[32m77[m[36m:[m        Authorization: `Bearer ${[1;31mresend[mApiKey}`,
[35msrc/app/api/contact/route.ts[m[36m:[m[32m80[m[36m:[m        // Sender must be from a verified [1;31mResend[m domain.
[35msrc/app/api/contact/route.ts[m[36m:[m[32m81[m[36m:[m        // Use your verified domain here, e.g. onboarding@[1;31mresend[m.dev for testing.
[35msrc/app/api/contact/route.ts[m[36m:[m[32m82[m[36m:[m        from: process.env.CONTACT_EMAIL_FROM ?? "Portfolio Contact <onboarding@[1;31mresend[m.dev>",
[35msrc/app/api/contact/route.ts[m[36m:[m[32m112[m[36m:[m    if (![1;31mresend[mResponse.ok) {
[35msrc/app/api/contact/route.ts[m[36m:[m[32m113[m[36m:[m      const errorBody = await [1;31mresend[mResponse.json().catch(() => ({}));
[35msrc/app/api/contact/route.ts[m[36m:[m[32m114[m[36m:[m      console.error("[1;31mResend[m API error:", errorBody);
[35msrc/app/api/guestbook/route.ts[m[36m:[m[32m96[m[36m:[m          "Supabase credentials not configured. Please set [1;31mNEXT_PUBLIC_SUPABASE[m_URL and [1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY in your environment.",
[35msrc/app/auth/callback/route.ts[m[36m:[m[32m12[m[36m:[m    const supabaseUrl = process.env.[1;31mNEXT_PUBLIC_SUPABASE[m_URL;
[35msrc/app/auth/callback/route.ts[m[36m:[m[32m13[m[36m:[m    const supabaseAnonKey = process.env.[1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY;
[35msrc/components/SetupNoticeModal.tsx[m[36m:[m[32m33[m[36m:[m  const envSnippet = `[1;31mNEXT_PUBLIC_SUPABASE[m_URL=https://your-project.supabase.co
[35msrc/components/SetupNoticeModal.tsx[m[36m:[m[32m34[m[36m:[m[1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY=your-anon-key-here`;
[35msrc/context/AuthContext.tsx[m[36m:[m[32m90[m[36m:[m    const { error } = await supabase.auth.[1;31msignInWithOAuth[m({
[35msrc/context/AuthContext.tsx[m[36m:[m[32m93[m[36m:[m        [1;31mredirectTo[m: `${origin}/[1;31mauth/callback[m`,
[35msrc/context/AuthContext.tsx[m[36m:[m[32m136[m[36m:[m        email[1;31mRedirectTo[m: `${origin}/[1;31mauth/callback[m`,
[35msrc/context/AuthContext.tsx[m[36m:[m[32m162[m[36m:[m      [1;31mredirectTo[m: `${origin}/auth/update-password`,
[35msrc/lib/supabase/client.ts[m[36m:[m[32m4[m[36m:[m  const supabaseUrl = process.env.[1;31mNEXT_PUBLIC_SUPABASE[m_URL;
[35msrc/lib/supabase/client.ts[m[36m:[m[32m5[m[36m:[m  const supabaseAnonKey = process.env.[1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY;
[35msrc/lib/supabase/client.ts[m[36m:[m[32m16[m[36m:[m    process.env.[1;31mNEXT_PUBLIC_SUPABASE[m_URL && process.env.[1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY
[35msrc/lib/supabase/server.ts[m[36m:[m[32m6[m[36m:[m  const supabaseUrl = process.env.[1;31mNEXT_PUBLIC_SUPABASE[m_URL;
[35msrc/lib/supabase/server.ts[m[36m:[m[32m7[m[36m:[m  const supabaseAnonKey = process.env.[1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY;
[35msrc/lib/translations.ts[m[36m:[m[32m119[m[36m:[m    guest_setup_notice: "[1;31mSupabase connection not configured[m yet. Set up [1;31mNEXT_PUBLIC_SUPABASE[m_URL and [1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY to enable live authentication and database persistence.",
[35msrc/lib/translations.ts[m[36m:[m[32m292[m[36m:[m    guest_setup_notice: "Koneksi Supabase belum terkonfigurasi. Tambahkan [1;31mNEXT_PUBLIC_SUPABASE[m_URL dan [1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY di lingkungan proyek untuk mengaktifkan autentikasi dan basis data nyata.",
[35msupabase/README.md[m[36m:[m[32m49[m[36m:[m3. **Important Note on SMTP**: Supabase's default email service has a strict rate limit of 3-4 emails per hour for development only. For production deployments, configure a custom SMTP provider (such as [1;31mResend[m, SendGrid, Amazon SES, or Brevo):
[35msupabase/README.md[m[36m:[m[32m67[m[36m:[m[1;31mNEXT_PUBLIC_SUPABASE[m_URL=https://your-project.supabase.co
[35msupabase/README.md[m[36m:[m[32m68[m[36m:[m[1;31mNEXT_PUBLIC_SUPABASE[m_ANON_KEY=eyJhbGciOi...
