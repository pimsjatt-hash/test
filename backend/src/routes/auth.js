 // src/routes/auth.js
import { Router } from "express";
import {
  signup,
  sendOtp,
  verifyOtp,
  loginWithPassword,
  requestOtp,
  loginWithOtp
} from "../controllers/authcontroller.js";

//import { authMiddleware } from "../middleware/auth.js"; // if needed for protected routes

const router = Router();

// ---------------- SIGNUP ----------------
router.post("/signup", signup);
router.post("/otp/send", sendOtp);
router.post("/otp/verify", verifyOtp);

// ---------------- LOGIN WITH PASSWORD ----------------
router.post("/login", loginWithPassword);

// ---------------- REQUEST OTP ----------------
router.post("/otp/request", requestOtp);

// ---------------- LOGIN WITH OTP ----------------
router.post("/otp/login", loginWithOtp);

export default router;
