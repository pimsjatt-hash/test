 // routes/roleManager.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";
import {
  createDynamicSubAdmin,
  updateDynamicSubAdmin,
  getDynamicSubAdmins,
  deleteDynamicSubAdmin     
} from "../controllers/rolemanagercontroller.js";

const router = express.Router();

// Role Manager can create roles
router.post("/roles", authMiddleware, allowRoles("rolemanager"), createDynamicSubAdmin);

// Role Manager or Superadmin can update roles
router.put("/roles/:roleId", authMiddleware, allowRoles("rolemanager", "superadmin"), updateDynamicSubAdmin);

// Role Manager or Superadmin can delete roles
router.delete("/roles/:roleId", authMiddleware, allowRoles("rolemanager", "superadmin"), deleteDynamicSubAdmin);

// Anyone authenticated can fetch roles
router.get("/roles", authMiddleware, getDynamicSubAdmins);

export default router;
