// routes/referralPartnerRoutes.js
import express from "express";
import {
  getProfile,
  myReferrals,
  myEarnings,
  requestSettlement,
} from "../controllers/referralpartnercontroller.js";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";

const router = express.Router();

// All referral partner endpoints protected
router.get("/profile", authMiddleware, allowRoles("referralpartner"), getProfile);
router.get("/my-referrals", authMiddleware, allowRoles("referralpartner"), myReferrals);
router.get("/earnings", authMiddleware, allowRoles("referralpartner"), myEarnings);
router.post("/settlement", authMiddleware, allowRoles("referralpartner"), requestSettlement);

export default router;
