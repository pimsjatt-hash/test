 import React, { useState } from "react";
import axios from "axios";

export default function CertificateTemplateForm() {
  const [signatoryName, setSignatoryName] = useState("");
  const [fields, setFields] = useState([{ name: "", rolesAllowed: [] }]);

  const handleAddField = () => setFields([...fields, { name: "", rolesAllowed: [] }]);
  const handleFieldChange = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("signatoryName", signatoryName);
      formData.append("fields", JSON.stringify(fields));
      // optional: append file
      const res = await axios.post("/api/certificates/templates", formData);
      alert("Template created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create template");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-5 rounded shadow">
      <h2 className="text-xl font-bold">Create Certificate Template</h2>
      <input
        type="text"
        placeholder="Signatory Name"
        value={signatoryName}
        onChange={(e) => setSignatoryName(e.target.value)}
        className="border p-2 rounded"
      />
      {fields.map((f, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            placeholder="Field Name"
            value={f.name}
            onChange={(e) => handleFieldChange(i, "name", e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <select
            multiple
            value={f.rolesAllowed}
            onChange={(e) =>
              handleFieldChange(i, "rolesAllowed", [...e.target.selectedOptions].map((o) => o.value))
            }
            className="border p-2 rounded flex-1"
          >
            <option value="superadmin">SuperAdmin</option>
            <option value="teacher">Teacher</option>
            <option value="university">University</option>
          </select>
        </div>
      ))}
      <button type="button" onClick={handleAddField} className="px-4 py-2 bg-gray-300 rounded">Add Field</button>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create Template</button>
    </form>
  );
}
