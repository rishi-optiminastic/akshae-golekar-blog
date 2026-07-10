// Vercel serverless function: receives the About-page contact form (submitted
// via fetch) and emails the submission over SMTP. Responds with JSON.
//
// Required env vars on Vercel:
//   SMTP_HOST            e.g. smtp.gmail.com
//   SMTP_PORT            e.g. 587 (STARTTLS) or 465 (SSL)
//   SMTP_USER            SMTP username
//   SMTP_PASS            SMTP password / app password
// Optional env vars:
//   SMTP_SECURE          "true" to use SSL (set this when SMTP_PORT=465)
//   CONTACT_TO           recipient (default: akshae@optiminastic.com)
//   CONTACT_FROM         From address (default: SMTP_USER)

import nodemailer from "nodemailer";

const DEFAULT_TO = "akshae@optiminastic.com";
const MAX_FIELD_LENGTH = 5000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\d][\d\s()-]{6,}$/;

// Best-effort idempotency: remembers keys seen by THIS warm instance so retries
// of the same submission don't send a second email. Not durable across cold
// starts or multiple instances - see the note in the README for the caveat.
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;
const seenKeys = new Map(); // key -> { status: "pending" | "done", expires: number }

function pruneExpiredKeys(now) {
  for (const [key, entry] of seenKeys) {
    if (entry.expires <= now) seenKeys.delete(key);
  }
}

// Vercel usually populates req.body, but fall back to reading the raw stream
// so the function is robust regardless of how the body is delivered.
async function readFields(req) {
  if (req.body && typeof req.body === "object") return req.body;

  let raw = req.body;
  if (typeof raw !== "string") {
    raw = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => resolve(data));
      req.on("error", reject);
    });
  }

  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(raw || "{}");
    } catch {
      return {};
    }
  }
  return Object.fromEntries(new URLSearchParams(raw));
}

function clean(value) {
  return String(value ?? "").trim().slice(0, MAX_FIELD_LENGTH);
}

function sendJson(res, status, payload) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    sendJson(res, 405, { ok: false, error: "Method Not Allowed" });
    return;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error("Contact form: SMTP env vars are not set.");
    sendJson(res, 500, { ok: false, error: "The contact form is not configured yet." });
    return;
  }

  const fields = await readFields(req);
  const name = clean(fields.name);
  const phone = clean(fields.phone);
  const email = clean(fields.email);
  const message = clean(fields.message);
  const honeypot = clean(fields._gotcha); // spam bots fill hidden fields

  // Silently accept bots so they get no signal, but never send the email.
  if (honeypot) {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (name.length < 2 || !EMAIL_PATTERN.test(email) || !PHONE_PATTERN.test(phone) || message.length < 10) {
    sendJson(res, 400, { ok: false, error: "Please fill in all fields with valid details." });
    return;
  }

  // Idempotency: drop duplicate submissions that carry a key we've already seen.
  const now = Date.now();
  const idempotencyKey = clean(req.headers["idempotency-key"]);
  if (idempotencyKey) {
    pruneExpiredKeys(now);
    if (seenKeys.has(idempotencyKey)) {
      sendJson(res, 200, { ok: true, duplicate: true });
      return;
    }
    // Reserve the key immediately so concurrent duplicates are rejected too.
    seenKeys.set(idempotencyKey, { status: "pending", expires: now + IDEMPOTENCY_TTL_MS });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const to = process.env.CONTACT_TO || DEFAULT_TO;
  const from = process.env.CONTACT_FROM || SMTP_USER;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: [
        `Name:  ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n"),
    });
  } catch (err) {
    // Release the key so the visitor can retry the same submission.
    if (idempotencyKey) seenKeys.delete(idempotencyKey);
    console.error("Contact form send failed:", err.message);
    sendJson(res, 502, { ok: false, error: "Sorry, the message could not be sent. Please try again later." });
    return;
  }

  // Mark the submission as completed so retries are treated as duplicates.
  if (idempotencyKey) {
    seenKeys.set(idempotencyKey, { status: "done", expires: Date.now() + IDEMPOTENCY_TTL_MS });
  }

  sendJson(res, 200, { ok: true });
}
