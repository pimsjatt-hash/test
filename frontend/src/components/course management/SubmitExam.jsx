// src/components/SubmitExam.jsx
import React, { useState } from "react";
import { submitExam } from "../../api/api";

export default function SubmitExam({ courseId }) {
  const [answers, setAnswers] = useState([]);
  const [templateId, setTemplateId] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const res = await submitExam(courseId, { templateId, answers });
    setResult(res.data);
  };

  return (
    <div className="p-4 border rounded mt-4">
      <h2 className="text-lg font-semibold mb-2">Submit Exam</h2>
      <input
        placeholder="Template ID"
        value={templateId}
        onChange={(e) => setTemplateId(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-indigo-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
      {result && (
        <div className="mt-3">
          <p>Score: {result.score}%</p>
          <p>Status: {result.passed ? "Passed ✅" : "Failed ❌"}</p>
          {result.certificateId && <p>Certificate: {result.certificateId}</p>}
        </div>
      )}
    </div>
  );
}
