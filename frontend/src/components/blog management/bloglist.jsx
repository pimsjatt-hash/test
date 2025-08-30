import React, { useEffect, useState } from "react";
import { getBlogs } from "../../api/api";

export default function BlogList({ onDelete }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs", error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Blogs</h2>
      {blogs.map((blog) => (
        <div key={blog._id} className="border p-3 mb-3 rounded-lg shadow">
          <h3 className="font-semibold text-lg">{blog.title}</h3>
          <p>{blog.content}</p>
          {onDelete && (
            <button
              onClick={() => onDelete(blog._id)}
              className="bg-red-500 text-white px-3 py-1 rounded mt-2"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
