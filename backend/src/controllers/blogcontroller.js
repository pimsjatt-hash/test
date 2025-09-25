// src/controllers/blogController.js
import Blog from "../models/Blog.js";

// Create blog (blogmanager only)
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = new Blog({ title, content, createdBy: req.user.id });
    await blog.save();
    res.status(201).json({ message: "Blog created", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()//.populate("createdBy", "name role");
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
