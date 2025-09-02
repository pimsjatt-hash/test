import express from "express";
import { approveSettlement, getRevenueReports, deleteFinanceLog } from "../controllers/financecontroller.js";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";

const router = express.Router();

router.post("/approve", authMiddleware, allowRoles("financemanager"), approveSettlement);
router.get("/reports", authMiddleware, allowRoles("financemanager"), getRevenueReports);
router.delete("/:id", authMiddleware, allowRoles("financemanager"), deleteFinanceLog);

export default router;
