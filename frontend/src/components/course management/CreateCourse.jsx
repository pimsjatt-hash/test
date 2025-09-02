// // src/components/CreateCourse.jsx
// import React, { useState } from "react";
// import { createCourse } from "../../api/api";

// export default function CreateCourse({ onCreated }) {
//   const [form, setForm] = useState({
//     category: "",
//     subCategory: "",
//     title: "",
//     description: "",
//     duration: "",
//     targetAudience: "",
//     prerequisites: "",
//     tags: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = { ...form, tags: form.tags.split(",") };
//     await createCourse(data);
//     onCreated();
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 border rounded mb-4">
//       <h2 className="text-lg font-semibold mb-2">Create Course</h2>
//       <input
//         name="title"
//         placeholder="Course Title"
//         value={form.title}
//         onChange={handleChange}
//         className="border p-2 w-full mb-2"
//       />
//       <textarea
//         name="description"
//         placeholder="Description"
//         value={form.description}
//         onChange={handleChange}
//         className="border p-2 w-full mb-2"
//       />
//       <input
//         name="duration"
//         placeholder="Duration (e.g. 3 months)"
//         value={form.duration}
//         onChange={handleChange}
//         className="border p-2 w-full mb-2"
//       />
//       <input
//         name="tags"
//         placeholder="Tags (comma separated)"
//         value={form.tags}
//         onChange={handleChange}
//         className="border p-2 w-full mb-2"
//       />
//       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//         Create
//       </button>
//     </form>
//   );
// }


import React, { useState } from "react";
import { createCourse } from "../../api/api";
import ElevatedCard from "../ui/ElevatedCard";
import { Label, Input, Textarea, HelpText, ErrorText } from "../ui/Field";

export default function CreateCourse({ onCreated }) {
  const [form, setForm] = useState({
    category: "",
    subCategory: "",
    title: "",
    description: "",
    duration: "",
    targetAudience: "",
    prerequisites: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setOkMsg("");

    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      await createCourse(payload);

      setOkMsg("Course created successfully. Pending approval.");
      setForm({
        category: "",
        subCategory: "",
        title: "",
        description: "",
        duration: "",
        targetAudience: "",
        prerequisites: "",
        tags: "",
      });
      onCreated?.();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ElevatedCard
      title="Create a new course"
      subtitle="Fill the details below. University & SuperAdmin approval flow is applied automatically."
      rightSlot={
        <span className="text-xs px-2.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800">
          Draft ➜ Approval ➜ Live
        </span>
      }
    >
      <form onSubmit={handle} className="hidden" />
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid: Core Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              name="category"
              value={form.category}
              onChange={handle}
              placeholder="e.g., Programming"
              required
            />
          </div>

          <div>
            <Label htmlFor="subCategory">Sub Category *</Label>
            <Input
              id="subCategory"
              name="subCategory"
              value={form.subCategory}
              onChange={handle}
              placeholder="e.g., Web Development"
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handle}
              placeholder="e.g., Fullstack MERN from Zero to Pro"
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handle}
              placeholder="What will learners achieve? Who is this for? Outline the curriculum."
              required
            />
            <HelpText>Keep it concise and outcome-focused.</HelpText>
          </div>

          <div>
            <Label htmlFor="duration">Duration *</Label>
            <Input
              id="duration"
              name="duration"
              value={form.duration}
              onChange={handle}
              placeholder="e.g., 8 weeks"
              required
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              value={form.tags}
              onChange={handle}
              placeholder="mern, react, node (comma separated)"
            />
            <HelpText>Used for search & discovery.</HelpText>
          </div>
        </div>

        {/* Grid: Optional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              value={form.targetAudience}
              onChange={handle}
              placeholder="e.g., Beginners, working professionals"
            />
          </div>

          <div>
            <Label htmlFor="prerequisites">Prerequisites</Label>
            <Input
              id="prerequisites"
              name="prerequisites"
              value={form.prerequisites}
              onChange={handle}
              placeholder="e.g., Basic JavaScript"
            />
          </div>
        </div>

        {/* Messages */}
        <ErrorText>{err}</ErrorText>
        {okMsg && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            {okMsg}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                       bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/20
                       hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed
                       transition"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z" />
                </svg>
                Creating…
              </>
            ) : (
              "Create Course"
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setForm({
                category: "",
                subCategory: "",
                title: "",
                description: "",
                duration: "",
                targetAudience: "",
                prerequisites: "",
                tags: "",
              })
            }
            className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700
                       text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800
                       transition"
          >
            Reset
          </button>
        </div>
      </form>
    </ElevatedCard>
  );
}
