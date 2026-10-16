import { NextResponse } from "next/server";
import { z } from "zod";

// ─── Validation Schema ────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(120, "Name must be under 120 characters."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message must be under 2 000 characters."),
  honeypot: z.string().optional(),
});

// ─── POST /api/contact ────────────────────────────────────────────────────────
export async function POST(request: Request) {
  // 1. Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  // 2. Validate
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.errors[0]?.message ?? "Invalid input.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { name, email, message, honeypot } = result.data;

  // 3. Anti-spam honeypot
  if (honeypot && honeypot.trim() !== "") {
    // Silently discard bot submissions
    return NextResponse.json({ success: true });
  }

  // 4. Check for Resend API key
  const resendApiKey = process.env.RESEND_API_KEY;
  const recipientEmail =
    process.env.CONTACT_EMAIL_TO ?? "klivliverpool1@gmail.com";

  if (!resendApiKey) {
    // Provider not configured — tell the client to use Gmail compose instead
    return NextResponse.json(
      {
        error:
          "Email delivery is not yet configured on this server. " +
          "Please use the Gmail compose button or send directly to " +
          recipientEmail,
        fallback: true,
      },
      { status: 503 }
    );
  }

  // 5. Send via Resend
  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        // Sender must be from a verified Resend domain.
        // Use your verified domain here, e.g. onboarding@resend.dev for testing.
        from: process.env.CONTACT_EMAIL_FROM ?? "Portfolio Contact <onboarding@resend.dev>",
        to: [recipientEmail],
        reply_to: email, // Allows direct reply to the visitor
        subject: `[Portfolio Contact] Message from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0b0d10;color:#f2f4f4;border-radius:12px">
            <h2 style="color:#d9323e;margin-bottom:16px">New Portfolio Contact Message</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:8px 12px;font-weight:bold;color:#9ca6b2;width:100px">Name</td>
                <td style="padding:8px 12px">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;font-weight:bold;color:#9ca6b2">Email</td>
                <td style="padding:8px 12px"><a href="mailto:${escapeHtml(email)}" style="color:#d9323e">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 12px;font-weight:bold;color:#9ca6b2;vertical-align:top">Message</td>
                <td style="padding:8px 12px;white-space:pre-wrap">${escapeHtml(message)}</td>
              </tr>
            </table>
            <p style="margin-top:24px;font-size:12px;color:#5c6470">
              Sent from the Liverpool Portfolio contact form — reply directly to respond to ${escapeHtml(name)}.
            </p>
          </div>
        `,
        text: `New Portfolio Contact\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.json().catch(() => ({}));
      console.error("Resend API error:", errorBody);
      return NextResponse.json(
        {
          error:
            "Failed to send your message. Please try the Gmail compose button or email directly.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form delivery error:", err);
    return NextResponse.json(
      {
        error:
          "An unexpected error occurred. Please use the Gmail compose button or email directly.",
      },
      { status: 500 }
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Escape HTML special characters to prevent XSS in the email template. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
