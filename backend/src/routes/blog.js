// import express from "express";
// import { createBlog, getBlogs, deleteBlog } from "../controllers/blogcontroller.js";
// import { authMiddleware } from "../middleware/auth.js";
// import { allowRoles } from "../middleware/rbac.js";

// const router = express.Router();
// router.post("/", protect, requireSubAdminRole("blog_manager"), createBlog);

// //router.post("/create", authMiddleware, allowRoles("blog_manager"), createBlog);
// router.get("/", getBlogs);
// router.delete("/:id", authMiddleware, allowRoles("blog_manager"), deleteBlog);
 

import express from "express";
import { authMiddleware } from "../middleware/auth.js";   // ✅ correct path & name
import { allowRoles, requireSubAdminRole } from "../middleware/rbac.js";
import { createBlog, getBlogs ,deleteBlog} from "../controllers/blogcontroller.js";

const router = express.Router();

// Blog manager (sub-admin) can create blogs
router.post(
  "/",
  authMiddleware,                      // ✅ replace protect with authMiddleware
  requireSubAdminRole("blog_manager"), // ✅ check sub-admin role
  createBlog
);

// Anyone can fetch blogs (students, etc.)
router.get("/", getBlogs);


router.delete(
  "/:id",
  authMiddleware,
  requireSubAdminRole("blog_manager"),
  deleteBlog
);

export default router;
