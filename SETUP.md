# Backend Configuration & Setup Guide

This document explains how to configure the external services used by the portfolio.

---

## 1. Supabase — Guestbook Authentication & Database

The Guestbook uses **Supabase** for authentication (Google OAuth) and PostgreSQL for message storage.

### Step-by-step setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com).

2. **Enable Google as an OAuth provider:**
   - In the Supabase dashboard go to **Authentication → Providers → Google**.
   - Toggle it **on**.
   - You need a Google OAuth Client ID and Secret. To create them:
     1. Go to [console.cloud.google.com](https://console.cloud.google.com).
     2. Create or select a project.
     3. Navigate to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**.
     4. Set application type to **Web application**.
     5. Add your domain to **Authorized JavaScript origins**, e.g. `https://yoursite.com` and `http://localhost:3000`.
     6. Add the Supabase callback URL to **Authorized redirect URIs**:
        `https://your-project-id.supabase.co/auth/v1/callback`
     7. Copy the Client ID and Client Secret back into the Supabase dashboard.

3. **Run the database migration** (`supabase/migrations/20261014000000_init_auth_guestbook.sql`):
   - From Supabase dashboard: **SQL Editor → New Query** → paste the migration file content → Run.
   - Or using Supabase CLI: `supabase db push`

4. **Copy API credentials:**
   - Go to **Project Settings → API** in Supabase.
   - Copy the **Project URL** and **anon/public** key.

5. **Set environment variables** (locally in `.env.local`, in production in your hosting provider):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_SITE_URL=https://yoursite.com
   ```

6. **Register authorized domains** in Supabase:
   - Go to **Authentication → URL Configuration**.
   - Add your production domain to **Site URL** and **Redirect URLs**.
   - Add `http://localhost:3000/auth/callback` for local development.

---

## 2. Contact Form — Email Delivery via Resend

The contact form API (`/api/contact`) delivers messages to `klivliverpool1@gmail.com` using **Resend**.

### Step-by-step setup

1. **Create a Resend account** at [resend.com](https://resend.com).

2. **Add and verify your sender domain:**
   - Go to **Domains → Add Domain** and follow the DNS record instructions.
   - Until your domain is verified, you can use `onboarding@resend.dev` for testing (emails only go to your Resend account email).

3. **Create an API key:**
   - Go to **API Keys → Create API Key**.
   - Give it at minimum `Sending access`.

4. **Set environment variables:**
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   CONTACT_EMAIL_TO=klivliverpool1@gmail.com
   CONTACT_EMAIL_FROM=Portfolio Contact <you@yourverifieddomain.com>
   ```

5. **Test locally:**
   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","message":"Hello from curl"}'
   ```
   A successful response returns `{ "success": true }`.

> **Note:** Without `RESEND_API_KEY` set, the endpoint returns a `503` and instructs the visitor to use the Gmail compose button. The site remains fully usable.

---

## 3. Gmail Compose (No Setup Required)

The Contact section includes a **"Send Email" button** that opens Gmail compose pre-filled with `klivliverpool1@gmail.com`. This requires **no server configuration** and works for any visitor with Gmail.

---

## 4. Quick-start Checklist

| Task | Required Env Variable(s) | Dashboard Action |
|------|--------------------------|------------------|
| Google OAuth login | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Enable Google provider in Supabase |
| Guestbook database | Same as above | Run SQL migration in Supabase |
| Contact form delivery | `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM` | Verify sender domain in Resend |
| Gmail compose button | *(none)* | *(none — works immediately)* |

---

## 5. Security Notes

- **Never** commit `.env.local` to Git. It is already in `.gitignore`.
- The Supabase anon key is public by design but database access is gated by **Row Level Security (RLS)** rules defined in the migration.
- The `RESEND_API_KEY` is server-only and never sent to the browser.
- All contact form submissions are validated server-side via Zod before delivery.
- Guestbook submissions require a valid Supabase session; the server verifies the authenticated user identity from the session cookie, not from client-supplied data.
