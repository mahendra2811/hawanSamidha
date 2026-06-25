import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/enquiry-schema";

/**
 * NOTE: Web3Forms' free plan blocks server-side submissions (it only accepts
 * requests from the browser). So the checkout form posts to Web3Forms DIRECTLY
 * (see src/components/cart/EnquiryForm.tsx) and this route is NOT used in that
 * path. It remains as a server-side fallback for Resend (commented out below)
 * or a future Web3Forms Pro plan. With nothing configured it returns a graceful
 * "email-disabled" so the UI points the user to WhatsApp / Call.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  // No server-side email provider wired up (Resend is commented out).
  return NextResponse.json({ ok: false, reason: "email-disabled" });
}

/* ─────────────────────────────────────────────────────────────────────────
   Resend implementation (commented — kept for an easy switch back to SMTP).
   Needs: RESEND_API_KEY + ENQUIRY_TO_EMAIL (+ optional RESEND_FROM with a
   verified domain). Re-add `import { Resend } from "resend";` at the top.

import { Resend } from "resend";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function sendWithResend(d: typeof parsed.data) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ENQUIRY_TO_EMAIL?.trim();
  if (!apiKey || !to) return { ok: false, reason: "email-disabled" } as const;

  const itemsHtml =
    d.items.length > 0
      ? `<ul>${d.items.map((i) => `<li>${escapeHtml(i.name)} — ${escapeHtml(i.tier)} × ${i.qty}</li>`).join("")}</ul>`
      : "<p>(No items attached.)</p>";

  const html = `
    <h2>New wholesale enquiry — Ammedi</h2>
    <p><strong>Name:</strong> ${escapeHtml(d.name)}</p>
    <p><strong>Mobile:</strong> ${escapeHtml(d.mobile)}</p>
    ${d.email ? `<p><strong>Email:</strong> ${escapeHtml(d.email)}</p>` : ""}
    ${d.message ? `<p><strong>Message:</strong> ${escapeHtml(d.message)}</p>` : ""}
    <h3>Cart</h3>
    ${itemsHtml}
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM?.trim() || "Ammedi Enquiry <onboarding@resend.dev>",
    to,
    replyTo: d.email || undefined,
    subject: `Wholesale enquiry from ${d.name} (${d.mobile})`,
    html,
  });
  return error ? ({ ok: false, reason: "send-failed" } as const) : ({ ok: true } as const);
}
───────────────────────────────────────────────────────────────────────── */
