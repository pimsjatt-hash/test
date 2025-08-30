// src/components/ApproveCourse.jsx
import React, { useState, useEffect } from "react";
import { getCourses, approveCourses } from "../../api/api";

export default function ApproveCourse() {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const res = await getCourses();
    setCourses(res.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleApprove = async (id, action) => {
    await approveCourses(id, action);
    fetchCourses();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Courses List</h2>
      {courses.map((c) => (
        <div key={c._id} className="border p-3 rounded mb-2">
          <h3 className="font-bold">{c.title}</h3>
          <p>{c.description}</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => handleApprove(c._id, "approved")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleApprove(c._id, "rejected")}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
