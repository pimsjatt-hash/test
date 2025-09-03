 import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import CertificatePreview from "./CertificatePreview";

export default function IssueCertificateForm() {
  const [templates, setTemplates] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    templateId: "",
    score: "",
    filledData: {},
  });

  const [showPreview, setShowPreview] = useState(false);

  // 🔑 Decode role from JWT
  const getUserRole = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded.role || null;
    } catch {
      return null;
    }
  };
  const role = getUserRole();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [tplRes, studentRes, courseRes] = await Promise.all([
      axios.get("/api/certificates/templates"),
      axios.get("/api/users?role=student"),
      axios.get("/api/courses"),
    ]);
    setTemplates(tplRes.data);
    setStudents(studentRes.data);
    setCourses(courseRes.data);
  };

  const handleTemplateChange = (id) => {
    setForm({ ...form, templateId: id, filledData: {} });
    const tpl = templates.find((t) => t._id === id);
    setSelectedTemplate(tpl);
  };

  const handleFieldChange = (fieldName, value) => {
    setForm({
      ...form,
      filledData: { ...form.filledData, [fieldName]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/certificates/issue", {
        ...form,
        score: Number(form.score),
      });
      alert("Certificate issued!");
    } catch (err) {
      console.error(err);
      alert("Failed to issue certificate");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-5 rounded shadow">
        <h2 className="text-xl font-bold">Issue Certificate</h2>

        {/* Student */}
        <select
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Course */}
        <select
          value={form.courseId}
          onChange={(e) => setForm({ ...form, courseId: e.target.value })}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        {/* Template */}
        <select value={form.templateId} onChange={(e) => handleTemplateChange(e.target.value)}>
          <option value="">Select Template</option>
          {templates.map((t) => (
            <option key={t._id} value={t._id}>
              Template {t._id}
            </option>
          ))}
        </select>

        {/* Dynamic fields (filtered by role) */}
        {selectedTemplate &&
          selectedTemplate.fields
            .filter((f) => f.rolesAllowed.includes(role))
            .map((f) => (
              <input
                key={f.name}
                type="text"
                placeholder={f.name}
                value={form.filledData[f.name] || ""}
                onChange={(e) => handleFieldChange(f.name, e.target.value)}
                className="border p-2 rounded"
              />
            ))}

        {/* Score */}
        <input
          type="number"
          placeholder="Score"
          value={form.score}
          onChange={(e) => setForm({ ...form, score: e.target.value })}
          className="border p-2 rounded"
        />

        {/* Buttons */}
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Issue
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-gray-500 text-white rounded"
            disabled={!selectedTemplate}
          >
            Preview
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-5xl w-full relative">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-2 right-2 text-red-600"
            >
              ✖
            </button>
            <CertificatePreview
              student={students.find((s) => s._id === form.studentId)}
              course={courses.find((c) => c._id === form.courseId)}
              score={form.score}
              fields={form.filledData}
              signatories={selectedTemplate?.signatories || []}
            />
          </div>
        </div>
      )}
    </div>
  );
}
