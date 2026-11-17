import nodemailer, { type Transporter } from "nodemailer";
import { site } from "./site";

/* server only. Sends the contact and quote forms to the site email.
   Configure with SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS and MAIL_FROM (see .env). */

export type Enquiry = {
  kind: "quote" | "contact";
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export class MailNotConfigured extends Error {}

const esc = (t: string) => t.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.MAIL_FROM);
}

/* created on first use: the SMTP settings do not change while the server runs, so one transport serves every enquiry */
let transport: Transporter | null = null;

function getTransport(): Transporter {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true", // true for port 465, false for STARTTLS on 587
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transport;
}

export async function sendEnquiry(e: Enquiry): Promise<void> {
  if (!mailConfigured()) throw new MailNotConfigured("Email is not configured yet.");

  const label = e.kind === "quote" ? "Quote request" : "Contact message";
  const rows: [string, string][] = [
    ["Type", label],
    ["Name", e.name],
    ["Email", e.email],
    ["Phone", e.phone || "-"],
    ["Service", e.service || "-"],
  ];
  const text = `${label} from the website\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${e.message}\n`;
  const html = `<h2>${esc(label)} from the website</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`)
    .join("")}</table><p><b>Message</b></p><p style="white-space:pre-wrap">${esc(e.message)}</p>`;

  await getTransport().sendMail({
    from: process.env.MAIL_FROM,
    to: site.email,
    replyTo: `${e.name} <${e.email}>`,
    subject: `${label} from ${e.name} (${site.name})`,
    text,
    html,
  });
}
