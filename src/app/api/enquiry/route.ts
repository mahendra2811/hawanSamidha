import { NextResponse } from "next/server";
import { Resend } from "resend";
import { enquirySchema } from "@/lib/enquiry-schema";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ENQUIRY_TO_EMAIL?.trim();

  // Graceful: email not configured -> tell the client to use WhatsApp / Call.
  if (!apiKey || !to) {
    return NextResponse.json({ ok: false, reason: "email-disabled" });
  }

  const d = parsed.data;
  const itemsHtml =
    d.items.length > 0
      ? `<ul>${d.items
          .map((i) => `<li>${escapeHtml(i.name)} — ${escapeHtml(i.tier)} × ${i.qty}</li>`)
          .join("")}</ul>`
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

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM?.trim() || "Ammedi Enquiry <onboarding@resend.dev>",
      to,
      replyTo: d.email || undefined,
      subject: `Wholesale enquiry from ${d.name} (${d.mobile})`,
      html,
    });
    if (error) {
      return NextResponse.json({ ok: false, reason: "send-failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, reason: "send-failed" }, { status: 502 });
  }
}
