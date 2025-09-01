// src/certificate-management/CertificateTemplateList.jsx
import React, { useEffect, useState } from "react";
import { getCertificateTemplates, deleteCertificateTemplate } from "../../api/api";

export default function CertificateTemplates({ refreshKey, onDelete }) {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplates();
  }, [refreshKey]);

  const fetchTemplates = async () => {
    try {
      const { data } = await getCertificateTemplates();
      setTemplates(data);
    } catch (err) {
      console.error("Error fetching templates:", err);
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">Certificate Templates</h2>
      <ul className="list-disc ml-6">
        {templates.map((tpl) => (
          <li key={tpl._id} className="flex justify-between items-center">
            <span>
              {tpl.name} (Signatory: {tpl.signatoryName})
            </span>
            <button
              className="ml-2 text-red-500"
              onClick={() => onDelete(tpl._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
