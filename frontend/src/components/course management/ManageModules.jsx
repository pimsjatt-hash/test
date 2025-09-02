// src/components/ManageModules.jsx
import React, { useState } from "react";
import { addModule, addVideo, addNotes, addMcqs } from "../../api/api";

export default function ManageModules({ courseId }) {
  const [moduleTitle, setModuleTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [notes, setNotes] = useState(null);
  const [mcqs, setMcqs] = useState([{ question: "", options: [], correctAnswer: "" }]);

  // Add Module
  const handleAddModule = async () => {
    await addModule(courseId, { title: moduleTitle });
    setModuleTitle("");
  };

  // Add Video
  const handleAddVideo = async (moduleId) => {
    const formData = new FormData();
    formData.append("title", "Intro Video");
    formData.append("order", 1);
    formData.append("video", video);
    await addVideo(courseId, moduleId, formData);
  };

  // Add Notes
  const handleAddNotes = async (moduleId) => {
    const formData = new FormData();
    formData.append("notes", notes);
    await addNotes(courseId, moduleId, formData);
  };

  // Add MCQs
  const handleAddMcqs = async (moduleId) => {
    await addMcqs(courseId, moduleId, mcqs);
  };

  return (
    <div className="p-4 border rounded mt-4">
      <h2 className="text-lg font-semibold mb-2">Manage Modules</h2>

      {/* Add Module */}
      <div className="mb-4">
        <input
          placeholder="Module Title"
          value={moduleTitle}
          onChange={(e) => setModuleTitle(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={handleAddModule}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Module
        </button>
      </div>

      {/* Add Video */}
      <div className="mb-4">
        <input type="file" onChange={(e) => setVideo(e.target.files[0])} />
        <button
          onClick={() => handleAddVideo("<moduleId_here>")}
          className="bg-purple-500 text-white px-4 py-2 rounded ml-2"
        >
          Upload Video
        </button>
      </div>

      {/* Add Notes */}
      <div className="mb-4">
        <input type="file" onChange={(e) => setNotes(e.target.files[0])} />
        <button
          onClick={() => handleAddNotes("<moduleId_here>")}
          className="bg-orange-500 text-white px-4 py-2 rounded ml-2"
        >
          Upload Notes
        </button>
      </div>

      {/* Add MCQs */}
      <div>
        <button
          onClick={() => handleAddMcqs("<moduleId_here>")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add MCQs
        </button>
      </div>
    </div>
  );
}
