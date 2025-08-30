// src/certificate-management/CreateCertificateTemplate.jsx
import React, { useState } from "react";
import { createCertificateTemplate } from "../../api/api";

export default function CreateCertificateTemplate({ onCreated }) {
  const [name, setName] = useState("");
  const [signatoryName, setSignatoryName] = useState("");
  const [signatoryFile, setSignatoryFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("signatoryName", signatoryName);
    if (signatoryFile) formData.append("signatoryFile", signatoryFile);

    try {
      await createCertificateTemplate(formData);
      setName("");
      setSignatoryName("");
      setSignatoryFile(null);
      onCreated(); // refresh list
    } catch (err) {
      console.error("Error creating template:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">Create Certificate Template</h2>
      <input
        type="text"
        placeholder="Template Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full mb-2"
        required
      />
      <input
        type="text"
        placeholder="Signatory Name"
        value={signatoryName}
        onChange={(e) => setSignatoryName(e.target.value)}
        className="border p-2 rounded w-full mb-2"
        required
      />
      <input
        type="file"
        onChange={(e) => setSignatoryFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create
      </button>
    </form>
  );
}
