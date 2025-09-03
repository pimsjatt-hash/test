 import React, { useState } from "react";
 import CertificateTemplateForm from "../Certificatemanagement/CertificateTemplateForm";
import IssueCertificateForm from "../Certificatemanagement/IssueCertificateForm";
import CertificateList from "../Certificatemanagement/CertificateList";
import { jwtDecode } from "jwt-decode";


 

// 🔑 Utility to decode role from JWT
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

export default function CertificateManagerDashboard() {
  const [tab, setTab] = useState("issued");
  const role = getUserRole();

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">Certificate Management</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        {/* Issued Certificates → visible to all roles */}
        <button
          onClick={() => setTab("issued")}
          className={`px-3 py-2 rounded ${
            tab === "issued" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Issued Certificates
        </button>

        {/* Issue Certificate → visible to teacher, university, superadmin */}
        {["teacher", "university", "superadmin"].includes(role) && (
          <button
            onClick={() => setTab("issue")}
            className={`px-3 py-2 rounded ${
              tab === "issue" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Issue Certificate
          </button>
        )}

        {/* Manage Templates → only superadmin */}
        {role === "superadmin" && (
          <button
            onClick={() => setTab("templates")}
            className={`px-3 py-2 rounded ${
              tab === "templates" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Manage Templates
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div>
        {tab === "issued" && (
          <div>
            <h3 className="text-xl font-semibold mb-3">All Issued Certificates</h3>
            <CertificateList />
          </div>
        )}

        {tab === "issue" && ["teacher", "university", "superadmin"].includes(role) && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Issue New Certificate</h3>
            <IssueCertificateForm />
          </div>
        )}

        {tab === "templates" && role === "superadmin" && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Create / Manage Templates</h3>
            <CertificateTemplateForm />
          </div>
        )}
      </div>
    </div>
  );
}
