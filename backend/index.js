// index.js (ESM) - Firebase Functions v2 entry with Secret Manager bindings
import dotenv from "dotenv";
// Load .env for local development only
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import * as admin from "firebase-admin";
import { initializeApp as initApp, getApps } from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions";

// initialize firebase-admin app once (safe for hot reloads / emulators)
if (!getApps().length) initApp();

// ----------------- Define secrets (names must match Secret Manager) -----------------
const MONGO_URI_SECRET = defineSecret("MONGO_URI");
const JWT_SECRET_SECRET = defineSecret("JWT_SECRET");

// SMTP secrets (added)
const SMTP_HOST_SECRET = defineSecret("SMTP_HOST");
const SMTP_PORT_SECRET = defineSecret("SMTP_PORT");
const SMTP_USER_SECRET = defineSecret("SMTP_USER");
const SMTP_PASS_SECRET = defineSecret("SMTP_PASS");
const SUPPORT_EMAIL_SECRET = defineSecret("SUPPORT_EMAIL");

// other secrets
const RAZORPAY_KEY_ID_SECRET = defineSecret("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineSecret("RAZORPAY_KEY_SECRET");
const ADMIN_SECRET = defineSecret("ADMIN_SECRET");

// ----------------- Global function options -----------------
setGlobalOptions({
  maxInstances: 10,
  timeoutSeconds: 120,
  memory: "512MiB",
});

// ----------------- Helper: load secrets into process.env -----------------
async function ensureSecrets() {
  async function tryLoad(envName, secretDef) {
    if (process.env[envName]) {
      console.log(`ensureSecrets: ${envName} already present (from .env or env)`);
      return;
    }
    try {
      // secretDef.value() reads the secret value from Secret Manager at runtime
      const v = await secretDef.value();
      if (v) {
        // Do not log the value. Only confirm presence.
        process.env[envName] = v;
        console.log(`ensureSecrets: loaded secret for ${envName}`);
      } else {
        console.warn(`ensureSecrets: secret ${envName} returned empty value`);
      }
    } catch (e) {
      // Helpful diagnostic without revealing secret content
      console.error(
        `ensureSecrets: failed to load secret for ${envName}:`,
        e && e.message ? e.message : e
      );
    }
  }

  // load essential secrets (order doesn't strictly matter)
  await tryLoad("MONGO_URI", MONGO_URI_SECRET);
  await tryLoad("JWT_SECRET", JWT_SECRET_SECRET);

  // SMTP / support
  await tryLoad("SMTP_HOST", SMTP_HOST_SECRET);
  await tryLoad("SMTP_PORT", SMTP_PORT_SECRET);
  await tryLoad("SMTP_USER", SMTP_USER_SECRET);
  await tryLoad("SMTP_PASS", SMTP_PASS_SECRET);
  await tryLoad("SUPPORT_EMAIL", SUPPORT_EMAIL_SECRET);

  // other service secrets
  await tryLoad("RAZORPAY_KEY_ID", RAZORPAY_KEY_ID_SECRET);
  await tryLoad("RAZORPAY_KEY_SECRET", RAZORPAY_KEY_SECRET);
  await tryLoad("ADMIN_SECRET", ADMIN_SECRET);

  // final diagnostic (do not print secret values)
  console.log("ensureSecrets: final presence - MONGO_URI:", !!process.env.MONGO_URI);
  console.log("ensureSecrets: final presence - SMTP_HOST:", !!process.env.SMTP_HOST);
}

// ----------------- Optional health endpoint (returns missing config keys) -----------------
export const health = onRequest(async (req, res) => {
  const missing = [];
  if (!process.env.MONGO_URI) missing.push("MONGO_URI");
  if (!process.env.JWT_SECRET) missing.push("JWT_SECRET");
  // do not list SMTP password/user as missing publicly; this is for simple debugging
  res.json({ ok: true, missing });
});

// ----------------- Main exported API function (bind secrets here) -----------------
export const api = onRequest(
  {
    // Bind the secrets so Secret Manager will inject them into process.env for this function
    secrets: [
      MONGO_URI_SECRET,
      JWT_SECRET_SECRET,
      SMTP_HOST_SECRET,
      SMTP_PORT_SECRET,
      SMTP_USER_SECRET,
      SMTP_PASS_SECRET,
      SUPPORT_EMAIL_SECRET,
      RAZORPAY_KEY_ID_SECRET,
      RAZORPAY_KEY_SECRET,
      ADMIN_SECRET,
    ],
  },
  async (req, res) => {
    // Ensure runtime secrets are loaded into process.env before app initialization
    await ensureSecrets();

    // Diagnostics (masked/presence only)
    console.log("index: MONGO_URI available in process.env?", !!process.env.MONGO_URI);
    console.log("index: SMTP_HOST available in process.env?", !!process.env.SMTP_HOST);

    try {
      // Dynamic import so app.js runs after env vars are set.
      const mod = await import("./app.js");

      // prefer ensureDbConnected, then connectDB
      const ensureDbConnected = mod.ensureDbConnected || mod.connectDB || null;

      if (typeof ensureDbConnected === "function") {
        try {
          await ensureDbConnected();
          console.log(
            "index: DB connection established (ensureDbConnected succeeded)."
          );
        } catch (dbErr) {
          console.error(
            "index: DB connection failed:",
            dbErr && dbErr.message ? dbErr.message : dbErr
          );
          // return a helpful 500 so caller sees failure and logs contain stacktrace
          res.status(500).json({ message: "Internal Server Error (DB connection failed)" });
          return;
        }
      } else {
        console.warn(
          "index: no ensureDbConnected/connectDB exported by app.js — ensure app connects to DB after secrets are available."
        );
      }

      // Expect default export to be an Express app handler
      const { default: app } = mod;

      // Delegate to Express app
      return app(req, res);
    } catch (err) {
      console.error(
        "index: Failed to initialize/boot app:",
        err && err.stack ? err.stack : err
      );
      res.status(500).json({ message: "Internal Server Error (initialization failure)" });
    }
  }
);
