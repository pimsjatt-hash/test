import express from "express";
import { createBlog, getBlogs, deleteBlog } from "../controllers/blogcontroller.js";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/rbac.js";

const router = express.Router();

router.post("/create", authMiddleware, allowRoles("blogmanager"), createBlog);
router.get("/", getBlogs);
router.delete("/:id", authMiddleware, allowRoles("blogmanager"), deleteBlog);

export default router;
