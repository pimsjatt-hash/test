// src/models/Blog.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
     createdBy: {
      type: mongoose.Schema.Types.ObjectId,
       ref: "User" ,//blogmanager 
       required: true,
     },
  },
//   { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
