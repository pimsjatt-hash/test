//  import React, { useState } from "react";
// import axios from "axios";

// export default function CertificateTemplateForm() {
//   const [signatoryName, setSignatoryName] = useState("");
//   const [fields, setFields] = useState([{ name: "", rolesAllowed: [] }]);

//   const handleAddField = () => setFields([...fields, { name: "", rolesAllowed: [] }]);
//   const handleFieldChange = (index, key, value) => {
//     const updated = [...fields];
//     updated[index][key] = value;
//     setFields(updated);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("signatoryName", signatoryName);
//       formData.append("fields", JSON.stringify(fields));
//       // optional: append file
//       const res = await axios.post("/api/certificates/templates", formData);
//       alert("Template created!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create template");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-5 rounded shadow">
//       <h2 className="text-xl font-bold">Create Certificate Template</h2>
//       <input
//         type="text"
//         placeholder="Signatory Name"
//         value={signatoryName}
//         onChange={(e) => setSignatoryName(e.target.value)}
//         className="border p-2 rounded"
//       />
//       {fields.map((f, i) => (
//         <div key={i} className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Field Name"
//             value={f.name}
//             onChange={(e) => handleFieldChange(i, "name", e.target.value)}
//             className="border p-2 rounded flex-1"
//           />
//           <select
//             multiple
//             value={f.rolesAllowed}
//             onChange={(e) =>
//               handleFieldChange(i, "rolesAllowed", [...e.target.selectedOptions].map((o) => o.value))
//             }
//             className="border p-2 rounded flex-1"
//           >
//             <option value="superadmin">SuperAdmin</option>
//             <option value="teacher">Teacher</option>
//             <option value="university">University</option>
//           </select>
//         </div>
//       ))}
//       <button type="button" onClick={handleAddField} className="px-4 py-2 bg-gray-300 rounded">Add Field</button>
//       <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create Template</button>
//     </form>
//   );
// }

import React, { useState } from "react";
import { Upload, Save } from "lucide-react";

export default function CertificateTemplateDashboard() {
  const [form, setForm] = useState({
    teacherName: "",
    courseName: "",
    studentName: "",
    score: "",
    issueDate: "",
    signatures: []
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignatureUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setForm({ ...form, signatures: files });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "signatures") {
        form.signatures.forEach((file) => {
          formData.append("signatures", file);
        });
      } else {
        formData.append(key, form[key]);
      }
    });

    try {
      const res = await fetch("http://localhost:5000/api/certificates/template", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error("Error saving template:", err);
    }
  };

  return (
    <div className="p-8 grid grid-cols-2 gap-6">
      {/* Left: Form */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Create Certificate Template</h2>
        <input
          type="text"
          name="teacherName"
          placeholder="Teacher Name"
          value={form.teacherName}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="courseName"
          placeholder="Course Name"
          value={form.courseName}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={form.studentName}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="score"
          placeholder="Score"
          value={form.score}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="issueDate"
          placeholder="Issue Date"
          value={form.issueDate}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
        />

        {/* Signature Upload */}
        <label className="block font-medium">Upload Signatures (max 5)</label>
        <input
          type="file"
          accept="image/png"
          multiple
          onChange={handleSignatureUpload}
          className="block"
        />

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Save size={18} /> Save Template
        </button>
      </div>

      {/* Right: Certificate Preview */}
      <div className="border-4 border-gray-400 bg-white p-6 shadow-lg text-center">
        <h1 className="text-2xl font-bold">Certificate of Completion</h1>
        <p className="mt-2">This certifies that</p>
        <p className="text-xl font-semibold">{form.studentName || "Student Name"}</p>
        <p className="mt-2">
          has completed <b>{form.courseName || "Course Name"}</b>
        </p>
        <p className="mt-2">with a score of {form.score || "Score"}</p>
        <p className="mt-2">Issued on {form.issueDate || "DD/MM/YYYY"}</p>
        <p className="mt-4 italic">Guided by {form.teacherName || "Teacher Name"}</p>

        {/* Signatures */}
        <div className="flex justify-center gap-6 mt-6">
          {form.signatures.length > 0 ? (
            form.signatures.map((file, i) => (
              <div key={i} className="text-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Signature"
                  className="h-16 object-contain"
                />
                <p className="text-sm">Sign {i + 1}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">[Signatures appear here]</p>
          )}
        </div>
      </div>
    </div>
  );
}
