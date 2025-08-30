 // app.js
import express from "express";
import dotenv from "dotenv";
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
import governanceRoutes from "./src/routes/governance.js";
import certificateRoutes from "./src/routes/certificate.js";
import couponRoutes from "./src/routes/coupon.js";
import roleManagerRoutes from "./src/routes/rolemanager.js";
import userRoutes from "./src/routes/user.js";
import teacherRoutes from "./src/routes/teacher.js";
import studentRoutes from "./src/routes/student.js";


// load environment variables
dotenv.config();

// ES Modules __filename & __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173", // frontend dev URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // allow all
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests explicitly
// app.options("*", cors());

// -------------------
// Middlewares
// -------------------

// JSON parser
app.use(express.json({ limit: "2mb" }));

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"), // temp folder inside project
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // optional: 10MB max
  })
);

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

// -------------------
// Database connection
// -------------------
connectDB();

// -------------------
// Health check
// -------------------
app.get("/healthz", (req, res) => res.json({ ok: true }));

// -------------------
// Mount routes
// -------------------
app.use("/api/auth", authRoutes); //done
app.use("/api/superadmin", superAdminRoutes); //DONE
app.use("/api/courses", courseRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/governance", governanceRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/coupons", couponRoutes); // done
app.use("/api/rolemanager", roleManagerRoutes);
app.use("/api/users", userRoutes); // done
app.use("/api/student", studentRoutes); // done

// -------------------
// Fallback
// -------------------
app.use((req, res) => res.status(404).json({ message: "Not found test" }));

// -------------------
// Start server
// -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));