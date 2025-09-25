import { deleteBlog } from "../../api/api";

export default function DeleteBlog({ blogId, onDeleted }) {
  const handleDelete = async () => {
    try {
      await deleteBlog(blogId);
      alert("Blog deleted successfully!");
      if (onDeleted) onDeleted(blogId);
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting blog");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-3 py-1 rounded"
    >
      Delete
    </button>
  );
}
