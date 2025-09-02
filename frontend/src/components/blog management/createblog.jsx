import React, { useState } from "react";
import { createBlog } from "../../api/api"; // adjust path

export default function CreateBlog({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBlog({ title, content });
      alert("Blog created successfully!");
      setTitle("");
      setContent("");
      if (onCreated) onCreated();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating blog");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Blog</h2>
      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        className="border p-2 w-full mb-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Blog
      </button>
    </form>
  );
}
