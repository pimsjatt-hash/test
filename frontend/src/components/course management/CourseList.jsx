// src/components/CourseList.jsx
import React, { useEffect, useState } from "react";
import { getApproveCourses, deleteCourse } from "../../api/api";

export default function CourseList() {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const res = await getApproveCourses();
    setCourses(res.data);
    // console.log(res.data,"data");
    // console.log(res.data.courseuniqueId,"resdata");
    
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    await deleteCourse(id);
    fetchCourses();
  };

  // { console.log(courses,"courses");}
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Approved Courses</h2>
      {courses.map((c) => {
        // console.log(c,"courseee");
        return (
        <div key={c._id} className="border p-3 flex justify-between items-center rounded mb-2">
          <div>
            <h3 className="font-bold">{c.title}</h3>
            <p>{c.description}</p>
            <span className="text-sm text-gray-500">By: {c.createdBy?.name}</span>
            <section className="text-md text-gray-500">Course unique id : {c.courseuniqueId}</section>
          </div>
          <button
            onClick={() => handleDelete(c._id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
        );
})}
    </div>
  );




}
