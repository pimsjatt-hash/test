// routes/couponRoutes.js
import express from "express";
import { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon } from "../controllers/couponcontroller.js";

const router = express.Router();

router.post("/", createCoupon);
router.get("/", getCoupons);
router.get("/:id", getCouponById);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
