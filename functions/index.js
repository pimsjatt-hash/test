// index.js (ESM) — patch to bind secrets and keep existing functionality
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config(); // local dev only
}

import * as admin from "firebase-admin";
import { initializeApp as initApp, getApps } from "firebase-admin/app";
import * as functions from "firebase-functions";

// ---- NEW: import defineSecret (for functions params secret binding) ----
import { defineSecret } from "firebase-functions/params";

// defineSecret creates a reference you can bind to the runtime
// (these names must match the secret names in Secret Manager)
const SMTP_HOST = defineSecret("SMTP_HOST");
const SMTP_PORT = defineSecret("SMTP_PORT");
const SMTP_USER = defineSecret("SMTP_USER");
const SMTP_PASS = defineSecret("SMTP_PASS");
const SUPPORT_EMAIL = defineSecret("SUPPORT_EMAIL");
// you can add others likewise: MONGO_URI, JWT_SECRET, etc., if you prefer binding here

// initialize firebase-admin app once (safe for hot reloads / emulators)
if (!getApps().length) {
  initApp();
}

// helper to read config from functions.config() first, then process.env
export function getConfig() {
  const cfg = {};
  try {
    const fnCfg = functions.config() || {};
    cfg.mongodbUri = (fnCfg.mongodb && fnCfg.mongodb.uri) || process.env.MONGO_URI || null;
    cfg.razorpayKeyId = (fnCfg.razorpay && fnCfg.razorpay.id) || process.env.RAZORPAY_KEY_ID || null;
    cfg.razorpayKeySecret = (fnCfg.razorpay && fnCfg.razorpay.secret) || process.env.RAZORPAY_KEY_SECRET || null;
    cfg.smtpUser = (fnCfg.smtp && fnCfg.smtp.user) || process.env.SMTP_USER || null;
    cfg.smtpPass = (fnCfg.smtp && fnCfg.smtp.pass) || process.env.SMTP_PASS || null;
    cfg.jwtSecret = (fnCfg.jwt && fnCfg.jwt.secret) || process.env.JWT_SECRET || null;
  } catch (e) {
    cfg.mongodbUri = process.env.MONGO_URI || null;
    cfg.razorpayKeyId = process.env.RAZORPAY_KEY_ID || null;
    cfg.razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || null;
    cfg.smtpUser = process.env.SMTP_USER || null;
    cfg.smtpPass = process.env.SMTP_PASS || null;
    cfg.jwtSecret = process.env.JWT_SECRET || null;
  }
  return cfg;
}

// A lightweight health endpoint that reports missing config keys (does NOT reveal secrets)
export const health = functions.https.onRequest((req, res) => {
  const cfg = getConfig();
  const missing = [];
  if (!cfg.mongodbUri) missing.push("mongodbUri");
  if (!cfg.jwtSecret) missing.push("jwtSecret");
  res.json({ ok: true, missing });
});

/*
  IMPORTANT:
  - To have process.env.SMTP_HOST / SMTP_USER etc available in runtime you must bind the secrets
    when exporting your function that uses email (for Functions v2-style exports).
  - Below is an example for a "api" function exported via `onRequest` (v2 style). Adjust to your actual export.
*/

// Example: if you export your main app as a single function named "api", bind secrets like this:
// (If you already export `api` somewhere, replace that export with the below pattern.)

import express from "express";
const app = express();
// ... your app setup, routers, middleware etc

// Example export using functions.https.onRequest (v1) DOES NOT accept `secrets` param.
// For secret binding you should use the v2 helpers (onRequest from firebase-functions/v2) OR use the
// `defineSecret` + functions.runWith for v1 (below shows v2 style). If you are using v1, see notes.

// -------- v2 onRequest example (recommended for secret bindings) --------
import { onRequest } from "firebase-functions/v2/https";

export const api = onRequest(
  { secrets: [SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SUPPORT_EMAIL] },
  app
);

// ---------------- If you must keep using v1 onRequest ----------------
// You can still access process.env if you set env vars via Secret Manager and used `firebase functions:secrets:set`
// and then redeploy; however the recommended approach for easy binding is the v2 style above.
