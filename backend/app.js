//  // app.js
// import express from "express";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import fileUpload from "express-fileupload";
// import cors from "cors";

// // load environment variables
// dotenv.config();

// import { connectDB } from "./src/config/db.js";

// // routes
// import authRoutes from "./src/routes/auth.js";
// import superAdminRoutes from "./src/Routes/superAdmin.js";
// import courseRoutes from "./src/Routes/course.js";
// import blogRoutes from "./src/Routes/blog.js";
// import financeRoutes from "./src/Routes/finance.js";
// import mouRoutes from "./src/Routes/mou.js";
// import certificateRoutes from "./src/Routes/certificate.js";
// import couponRoutes from "./src/Routes/coupon.js";
// import roleManagerRoutes from "./src/Routes/rolemanager.js";
// import userRoutes from "./src/Routes/user.js";
// import teacherRoutes from "./src/Routes/teacher.js";
// import studentRoutes from "./src/Routes/student.js";
// import walletRoutes from "./src/Routes/wallet.js";
// import careerCellRoutes from "./src/routes/careerCell.js";
//   import reportRoutes from "./src/Routes/reports.js";
// import univerityRoutes from "./src/Routes/university.js";
// import  referralPartnerRoutes  from "./src/Routes/referralpartner.js";
// import contactRoutes from "./src/routes/contactRoutes.js"; 
// import paymentRoutes from "./src/Routes/payment.js";





// // ES Modules __filename & __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();


// app.use(
//   cors({
//     origin: "http://localhost:5173", // frontend dev URL
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // allow all
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );


// // Handle preflight requests explicitly
// // app.options("*", cors());

// // -------------------
// // Middlewares
// // -------------------
//  // JSON parser first

// app.use("/api/mou", mouRoutes);
// app.use("/api/courses", courseRoutes);
//  app.use("/api/teacher", teacherRoutes);

// app.use(express.json({ limit: "2mb" }));

// // File upload middleware
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: path.join(__dirname, "tmp"),
//     createParentPath: true,
//     limits: { fileSize: 20 * 1024 * 1024 },
//   })
// );

// // Serve static uploads
// app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

// // -------------------
// // Database connection
// // -------------------
// connectDB();

// // -------------------
// // Health check
// // -------------------
// app.get("/healthz", (req, res) => res.json({ ok: true }));

// // -------------------
// // Mount routes
// // -------------------
// app.use("/api/auth", authRoutes); //done
// app.use("/api/superadmin", superAdminRoutes); //DONE
// //app.use("/api/courses", courseRoutes);
 
//  //app.use("/api/teacher", teacherRoutes);
// app.use("/api/blogs", blogRoutes);
// app.use("/api/finance", financeRoutes);
//  app.use("/api/mou", mouRoutes);
// // app.use("/api/certificates", certificateRoutes);
// app.use("/api/certificates", certificateRoutes);
// // serve static certificates
// app.use("/certificates", express.static(path.join(process.cwd(), "public", "certificates")));
//  //app.use("/api/teacher", teacherRoutes);

// app.use("/signatures", express.static(path.join(process.cwd(), "public", "signatures")));

// app.use("/api/coupons", couponRoutes); // done
// app.use("/api/rolemanager", roleManagerRoutes);
// app.use("/api/users", userRoutes); // done
// app.use("/api/student", studentRoutes); // done
 
// app.use("/api/wallet", walletRoutes);
// app.use("/api/careercell", careerCellRoutes);
//  app.use("/api", reportRoutes);
// app.use("/api/university", univerityRoutes);
// app.use("/api/referralpartner", referralPartnerRoutes);
// app.use("/api/contacts", contactRoutes); // new
// app.use("/api/payments", paymentRoutes); // new
// // -------------------
// // Fallback
// // -------------------
// app.use((req, res) => res.status(404).json({ message: "Not found test" }));

// // -------------------
// // Start server
// // -------------------
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// backend/app.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import cors from "cors";

import { connectDB } from "./src/config/db.js";

// routes
import authRoutes from "./src/routes/auth.js";
import superAdminRoutes from "./src/routes/superadmin.js";
import courseRoutes from "./src/routes/course.js";
import blogRoutes from "./src/routes/blog.js";
import financeRoutes from "./src/routes/finance.js";
import mouRoutes from "./src/routes/mou.js";
import certificateRoutes from "./src/routes/certificate.js";
import couponRoutes from "./src/routes/coupon.js";
import roleManagerRoutes from "./src/routes/rolemanager.js";
import userRoutes from "./src/routes/user.js";
import teacherRoutes from "./src/routes/teacher.js";
import studentRoutes from "./src/routes/student.js";
import walletRoutes from "./src/routes/wallet.js";
import careerCellRoutes from "./src/routes/careerCell.js";

import reportRoutes from "./src/routes/reports.js";
import universityRoutes from "./src/routes/university.js";
import referralPartnerRoutes from "./src/routes/referralpartner.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import paymentRoutes from "./src/routes/payment.js";

// ES Modules __filename & __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// -------------------
// Request logger (simple)
// -------------------
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} → ${req.method} ${req.originalUrl} (origin: ${req.get("origin") || "no-origin"})`);
  next();
});

// -------------------
// CORS — allow local dev + production by default.
// You can override allowed origins with CORS_ORIGIN env var (comma separated).
// For quick testing set CORS_ALLOW_ALL=true to allow any origin (temporary).
// -------------------
const allowAll = process.env.CORS_ALLOW_ALL === "true";

const defaultAllowed = [
  "http://localhost:5173",    // Vite default
  "http://127.0.0.1:5173",
  "http://localhost:3000",    // CRA
  "http://127.0.0.1:3000",
  "https://larnik-34c6c.web.app" // your production hosting URL
];

let allowedOrigins = defaultAllowed;

// If env provides a list, use that (comma separated)
if (process.env.CORS_ORIGIN) {
  allowedOrigins = process.env.CORS_ORIGIN.split(",").map(s => s.trim()).filter(Boolean);
}

// CORS middleware
if (allowAll) {
  console.warn("CORS: allowing all origins (CORS_ALLOW_ALL=true) — use only for development/testing");
  app.use(cors({ origin: true }));
} else {
  app.use(cors({
    origin: function (origin, callback) {
      // allow non-browser requests (curl, server-to-server) with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error("CORS policy: origin not allowed"), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
  }));
}

// -------------------
// Built-in parsers & file upload
// -------------------
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, "tmp"),
  createParentPath: true,
  limits: { fileSize: 20 * 1024 * 1024 },
}));

// -------------------
// Static serves
// -------------------
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));
app.use("/certificates", express.static(path.join(process.cwd(), "public", "certificates")));
app.use("/signatures", express.static(path.join(process.cwd(), "public", "signatures")));

// -------------------
// NOTE: Do NOT connect to DB at module import time. Serverless environments
// rely on secrets / env being available before connecting. Call ensureDbConnected()
// from your entrypoint (index.js) AFTER secrets have been loaded.
// -------------------

// Provide a helper to connect DB when caller is ready (e.g. index.js after ensureSecrets())
export async function ensureDbConnected() {
  try {
    await connectDB();
  } catch (err) {
    console.error("ensureDbConnected: Failed to connect to DB:", err);
    throw err;
  }
}

// -------------------
// Health check
// -------------------
app.get("/api/health", (req, res) => res.json({ ok: true }));

// -------------------
// Mount routes
// -------------------
app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/mou", mouRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/rolemanager", roleManagerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/careercell", careerCellRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/university", universityRoutes);
app.use("/api/referralpartner", referralPartnerRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/payments", paymentRoutes);

// -------------------
// Fallback 404
// -------------------
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});
// Export app for Cloud Functions
export default app;

/**
 * Robust local-run detection & startup
 * - Works cross-platform (Windows / macOS / Linux).
 * - Loads dotenv only when running this file directly (not in production).
 * - Attempts DB connect and logs success/failure so you can debug locally.
 *
 * Usage:
 *  - Run locally: `node backend/app.js` (or `node app.js` from backend folder)
 *  - To force local start even when paths don't match, set FORCE_LOCAL=true in env.
 */
 
async function startLocalServerIfDirectRun() {
  try {
    const scriptPath = process.argv && process.argv[1] ? path.resolve(process.argv[1]) : null;
    const thisFilePath = fileURLToPath(import.meta.url);
    const resolvedThis = path.resolve(thisFilePath);

    // If running this file directly (node app.js) the resolved paths will match.
    const isDirectRun = scriptPath && resolvedThis === scriptPath;

    // Allow an explicit override to force local start (handy in CI/odd shells)
    const forceLocal = process.env.FORCE_LOCAL === "true";

    if (!isDirectRun && !forceLocal) return;

    // TEMP DEBUG (remove if you don't want these logs)
    console.log("LOCAL START: scriptPath =", scriptPath);
    console.log("LOCAL START: thisFilePath =", resolvedThis);
    console.log("LOCAL START: NODE_ENV =", process.env.NODE_ENV || "(unset)");
    console.log("LOCAL START: MONGO_URI present?", !!process.env.MONGO_URI);

    // Load dotenv for local development if needed (quiet to reduce noise)
    if (process.env.NODE_ENV !== "production") {
      try {
        const dotenv = await import("dotenv");
        dotenv.config({ quiet: true });
        console.log("LOCAL START: attempted to load .env (quiet)");
      } catch (e) {
        // ignore
      }
    }

    // Attempt DB connect if exported from src/config/db.js
    try {
      const dbModule = await import("./src/config/db.js");
      const connector = dbModule.ensureDbConnected || dbModule.connectDB || null;
      if (typeof connector === "function") {
        console.log("LOCAL START: attempting DB connect...");
        await connector();
        console.log("LOCAL START: DB connected");
      } else {
        console.warn("LOCAL START: no DB connector exported (connectDB / ensureDbConnected missing)");
      }
    } catch (dbErr) {
      console.error("LOCAL START: DB connect failed:", dbErr && dbErr.message ? dbErr.message : dbErr);
      // Continue to start server so health endpoint is available for debugging
    }

    const PORT = process.env.SERVER_PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running locally on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("LOCAL START: startup error:", err && err.stack ? err.stack : err);
  }
}

// Start (non-blocking)
startLocalServerIfDirectRun();
