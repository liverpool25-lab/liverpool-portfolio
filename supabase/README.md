# Supabase Database & Authentication Setup Guide

This guide explains how to set up the database schema, Row Level Security (RLS) policies, and Supabase Auth providers for the Liverpool Portfolio.

---

## 1. Apply Database Migration

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project and navigate to the **SQL Editor** tab from the left sidebar.
3. Click **New Query**.
4. Copy the entire contents of `supabase/migrations/20261014000000_init_auth_guestbook.sql` and paste it into the editor.
5. Click **Run** (or `Cmd/Ctrl + Enter`).
6. Verify that the tables `public.profiles` and `public.guestbook` are created with RLS enabled.

---

## 2. Row Level Security (RLS) Verification

You can verify that RLS is active:
- **Public Read**: Anyone (authenticated or anonymous) can read approved guestbook entries.
- **Authenticated Write**: Only users with a valid session can insert entries. The database strictly validates `auth.uid() = user_id`, preventing any spoofing of user IDs.
- **Message Constraints**: Messages are enforced between 1 and 500 characters, trimmed of whitespace.

---

## 3. Google OAuth Setup

1. Open **Google Cloud Console** (`https://console.cloud.google.com/`).
2. Create a new project or select an existing one.
3. Go to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Select Application type: **Web application**.
6. Set **Authorized JavaScript origins**:
   - Local: `http://localhost:3000`
   - Production: `https://your-domain.vercel.app`
7. Set **Authorized redirect URIs**:
   - Copy the Redirect URL from your Supabase Dashboard under **Authentication > Providers > Google**:
   - Format: `https://<your-project-ref>.supabase.co/auth/v1/callback`
8. Copy the generated **Client ID** and **Client Secret**.
9. In Supabase Dashboard: Go to **Authentication > Providers > Google**, toggle **Enable Google provider**, paste the Client ID and Secret, and click **Save**.

---

## 4. Email / Password & Custom SMTP Configuration

1. In Supabase Dashboard: Go to **Authentication > Providers > Email**.
2. Ensure **Enable Email provider** is turned on.
3. **Important Note on SMTP**: Supabase's default email service has a strict rate limit of 3-4 emails per hour for development only. For production deployments, configure a custom SMTP provider (such as Resend, SendGrid, Amazon SES, or Brevo):
   - Navigate to **Project Settings > Authentication > SMTP Settings**.
   - Toggle **Enable Custom SMTP**.
   - Enter your SMTP Host, Port, Username, Password, and Sender Email.
4. Set your **Site URL** and **Redirect URLs**:
   - Go to **Authentication > URL Configuration**.
   - Site URL: `https://your-domain.vercel.app` (or `http://localhost:3000` for local testing)
   - Redirect URLs:
     - `http://localhost:3000/**`
     - `https://your-domain.vercel.app/**`

---

## 5. Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```
