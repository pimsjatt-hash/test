// src/utils/emailutils.js
import nodemailer from "nodemailer";

// Use a factory so transporter reads latest process.env values (injected by secrets)
export function transporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  if (!user || !pass) {
    console.warn("mailer: SMTP_USER or SMTP_PASS not configured; mail will fail until secrets are bound.");
    // return a dummy transporter that throws on sendMail, to keep error handling consistent
    return {
      sendMail: async () => {
        throw new Error("SMTP credentials not configured");
      },
    };
  }

   const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: { user, pass },
  });

  return transporter;
}

 
// Helper that uses transporter and returns structured result
export async function sendEmailSafe(mailOptions) {
  const transporter = createTransporter();
  try {
    // optional: await transporter.verify() // can be used but may add latency
    const info = await transporter.sendMail(mailOptions);
    console.log("mailer: email sent, messageId:", info && info.messageId ? info.messageId : "(unknown)");
    return { ok: true, info };
  } catch (err) {
    console.error("mailer: sendMail failed:", err && err.message ? err.message : err);
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
}
