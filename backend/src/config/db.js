// src/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { access } from "fs";

/**
 * Helper to attempt loading .env for local development only.
 * We do NOT load .env automatically in production (secrets from Secret Manager should be used).
 */
function loadDotenvIfNeeded() {
  if (process.env.NODE_ENV === "production") return;
  if (process.env.MONGO_URI) return; // already present

  try {
    // Try project root first (where you run node)
    const envPath = path.resolve(process.cwd(), ".env");
    dotenv.config({ path: envPath });
    if (process.env.MONGO_URI) {
      console.log("db: loaded MONGO_URI from .env in project root");
      return;
    }
    // fallback: try relative to this file (rare)
    const altPath = path.resolve(path.dirname(fileURLOrFallback()), "../.env");
    dotenv.config({ path: altPath });
    if (process.env.MONGO_URI) {
      console.log("db: loaded MONGO_URI from fallback .env");
    }
  } catch (e) {
    // non-fatal — we'll handle missing URI later
    console.debug("db: dotenv load attempt failed or not present");
  }
}

/**
 * fileURL fallback for ESM (used only to construct alternate .env path)
 */
function fileURLOrFallback() {
  try {
    // this will throw in some contexts if not available, so guard it
    // eslint-disable-next-line no-undef
    return import.meta.url;
  } catch {
    return __filename || process.cwd();
  }
}

/**
 * Try to extract a raw Mongo URI from several common accidental formats:
 * - trim whitespace, remove BOM
 * - strip surrounding single/double quotes
 * - if value looks like JSON object with a uri/key, parse and extract
 * - fallback: attempt to find first substring that starts with mongodb
 */
function cleanMongoUri(raw) {
  if (!raw || typeof raw !== "string") return null;
  // remove BOM and trim whitespace/newlines
  let s = raw.replace(/^\uFEFF/, "").trim();

  // strip surrounding quotes if present
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }

  // If it's JSON-like, try to parse and extract common keys
  if (s.startsWith("{") && s.endsWith("}")) {
    try {
      const obj = JSON.parse(s);
      // common fields that might hold URI
      const candidates = ["MONGO_URI", "mongo_uri", "uri", "connectionString", "connection_string"];
      for (const k of candidates) {
        if (obj[k]) return String(obj[k]).trim();
      }
      // also try to find any string value that contains mongodb
      for (const key of Object.keys(obj)) {
        const v = obj[key];
        if (typeof v === "string" && v.includes("mongodb")) return v.trim();
      }
    } catch (e) {
      // not JSON parseable - continue
    }
  }

  // if something else, attempt to locate the first mongodb... substring
  const idx = s.indexOf("mongodb://");
  const idx2 = s.indexOf("mongodb+srv://");
  if (idx >= 0 || idx2 >= 0) {
    const start = idx2 >= 0 ? idx2 : idx;
    // take up to the end of the line (strip trailing whitespace)
    const rest = s.slice(start).split(/\s+/)[0].trim();
    return rest;
  }

  return s || null;
}

/**
 * getMongoUri()
 * - Reads process.env.MONGO_URI at call time (important for Secret Manager use).
 * - In dev, if missing, tries to load .env and re-read.
 * - Returns null if still not present.
 */
function getMongoUri() {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;

  // attempt local .env fallback only when not in production
  if (process.env.NODE_ENV !== "production") {
    loadDotenvIfNeeded();
  }

  if (process.env.MONGO_URI) return process.env.MONGO_URI;

  // allow an explicit local fallback var (useful for urgent local test)
  if (process.env.LOCAL_MONGO_URI) return process.env.LOCAL_MONGO_URI;

  return null;
}

// Keep a local flag to avoid reconnect attempts, but prefer mongoose.readyState checks
let _isConnectingOrConnected = false;

/**
 * connectDB()
 * - Connects to MongoDB using MONGO_URI from environment (populated by Secret Manager in prod).
 * - Reuses mongoose connection if already connected/connecting to prevent multiple connections.
 * - Throws with helpful instructions if MONGO_URI is missing.
 */
export async function connectDB() {
  const rawUri = getMongoUri();

  if (!rawUri) {
    const msg = [
      "MONGO_URI is not set in environment.",
      "Local dev: create a .env at project root with MONGO_URI=your_mongo_uri or set LOCAL_MONGO_URI in your shell.",
      "Production: ensure you stored the secret in Secret Manager (name: MONGO_URI) and that your Cloud Function binds and can access it.",
      "For Firebase Functions (v2) you should bind the secret in your function and use defineSecret/ensureSecrets as in index.js.",
    ].join(" ");
    throw new Error(msg);
  }

  // Clean the value to remove accidental wrappers/quotes/JSON
  const uri = cleanMongoUri(rawUri);

  // SAFE MASKED CHECK — prints only a masked preview and length (do NOT log full URI)
  const preview = uri ? (uri.slice(0, 16).replace(/[A-Za-z0-9]/g, "X") + "...") : "(empty)";
  console.log("MONGO_URI preview:", preview, "length=", uri ? uri.length : 0);

  // Quick validation that fails fast with a clear message
  if (!uri || !(uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))) {
    console.error(
      "FATAL: MONGO_URI invalid or missing. Preview (masked) above. Ensure the secret contains the raw connection string starting with mongodb:// or mongodb+srv://"
    );
    // Throwing here avoids the opaque MongoParseError later and gives clearer logs
    throw new Error("MONGO_URI invalid or missing (see logs for masked preview).");
  }

  // If mongoose already connected, return the existing connection promise
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  // If mongoose is currently connecting, avoid duplicate connect attempts
  if (mongoose.connection.readyState === 2 || _isConnectingOrConnected) {
    // Wait for existing connection to resolve
    return mongoose.connection.asPromise();
  }

  _isConnectingOrConnected = true;
  try {
    // Use sensible defaults; adjust options if you need to (authSource, replicaSet, tls, etc)
    await mongoose.connect(uri, {
      // options can be left out for mongoose v6+, but you can add them if needed.
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log("connectDB: MongoDB connected");
    return mongoose.connection.asPromise();
  } catch (err) {
    console.error("connectDB: Failed to connect to MongoDB:", err && err.message ? err.message : err);
    _isConnectingOrConnected = false;
    throw err;
  }
}

/**
 * ensureDbConnected (alias)
 * - Some callers may import ensureDbConnected from app.js — export this alias to be safe.
 */
export async function ensureDbConnected() {
  return connectDB();
}
 
