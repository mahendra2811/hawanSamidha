import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/enquiry-schema";

// Resend is left available for later but is no longer used — see the commented
// implementation at the bottom of this file. We use Web3Forms now: no domain
// verification, just one access key (https://web3forms.com → create access key).

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();

  // Graceful: not configured -> client falls back to WhatsApp / Call.
  if (!accessKey) {
    return NextResponse.json({ ok: false, reason: "email-disabled" });
  }

  const d = parsed.data;

  const itemsText =
    d.items.length > 0
      ? d.items.map((i) => `• ${i.name} — ${i.tier} × ${i.qty}`).join("\n")
      : "(No items attached.)";

  // Readable summary + structured fields (Web3Forms renders both in the email).
  const summary = [
    "New wholesale enquiry — Ammedi",
    "",
    `Name:   ${d.name}`,
    `Mobile: ${d.mobile}`,
    d.email ? `Email:  ${d.email}` : null,
    d.message ? `Message: ${d.message}` : null,
    "",
    "Cart:",
    itemsText,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const payload: Record<string, unknown> = {
    access_key: accessKey,
    subject: `Wholesale enquiry — ${d.name} (${d.mobile})`,
    from_name: "Ammedi Website",
    // Structured fields:
    name: d.name,
    mobile: d.mobile,
    customer_email: d.email || "—",
    note: d.message || "—",
    cart: itemsText,
    // Full readable summary as the email body:
    message: summary,
    // Reply straight to the buyer when they gave an email:
    ...(d.email ? { replyto: d.email } : {}),
    // Honeypot (must stay empty for genuine submissions):
    botcheck: "",
  };

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({ success: false }))) as { success?: boolean };
    if (!res.ok || !data.success) {
      return NextResponse.json({ ok: false, reason: "send-failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, provider: "web3forms" });
  } catch {
    return NextResponse.json({ ok: false, reason: "send-failed" }, { status: 502 });
  }
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
