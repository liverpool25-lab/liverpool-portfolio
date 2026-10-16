import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const createEntrySchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty.")
    .max(500, "Message cannot exceed 500 characters."),
  honeypot: z.string().optional(),
});

// Sample default notes for preview when database is empty
const defaultNotes = [
  {
    id: "sample-1",
    user_id: "sample-user-1",
    author_name: "Rizky Nugraha",
    author_avatar: "",
    message:
      "Keren banget Just Farm nya, pas dipresentasiin di Prodistik kelihatan niat banget eksekusinya. Semangat terus belajarnya di bidang web development sama cyber security!",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "sample-2",
    user_id: "sample-user-2",
    author_name: "Dian F.",
    author_avatar: "",
    message:
      "Love the dark void aesthetic and the Spider-Man spotlight cursor reveal on your hero photo. Super slick! Keep up the cybersecurity CTF drills!",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "sample-3",
    user_id: "sample-user-3",
    author_name: "Arya Pratama",
    author_avatar: "",
    message:
      "Summit Lawu sama Arjuno nya terekam apik bro di galeri 3D. Ditunggu ekspedisi jalur berikutnya sama rilis ML ID checkernya!",
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

export async function GET() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    // Return sample notes with setup advisory flag
    return NextResponse.json({
      entries: defaultNotes,
      configured: false,
    });
  }

  try {
    const { data, error } = await supabase
      .from("guestbook")
      .select("id, user_id, author_name, author_avatar, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.warn("Supabase guestbook select error:", error.message);
      return NextResponse.json({
        entries: defaultNotes,
        configured: true,
        error: error.message,
      });
    }

    // If database is empty, append default friendly notes
    const entries = data && data.length > 0 ? data : defaultNotes;

    return NextResponse.json({
      entries,
      configured: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      entries: defaultNotes,
      configured: true,
      error: message,
    });
  }
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.",
        configured: false,
      },
      { status: 503 }
    );
  }

  // 1. Verify Authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "You must be signed in to post a message." },
      { status: 401 }
    );
  }

  // 2. Parse & Validate Payload
  try {
    const body = await request.json();
    const result = createEntrySchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // Anti-spam honeypot detection
    if (result.data.honeypot && result.data.honeypot.trim() !== "") {
      return NextResponse.json({ error: "Spam detected." }, { status: 400 });
    }

    const cleanMessage = result.data.message;

    // Resolve author metadata
    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.display_name ||
      user.email?.split("@")[0] ||
      "Community Guest";

    const avatarUrl =
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      null;

    // 3. Insert into Supabase
    const { data, error: insertError } = await supabase
      .from("guestbook")
      .insert({
        user_id: user.id,
        author_name: displayName,
        author_email: user.email,
        author_avatar: avatarUrl,
        message: cleanMessage,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Guestbook insert error:", insertError);
      return NextResponse.json(
        { error: insertError.message || "Failed to post message." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      entry: data,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request payload." },
      { status: 400 }
    );
  }
}
