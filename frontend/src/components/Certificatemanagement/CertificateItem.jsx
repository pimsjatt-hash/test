import React from "react";
import axios from "axios";

export default function CertificateItem({ certificate }) {
  const handleDownload = async () => {
    try {
      const res = await axios.get(`/api/certificates/download/${certificate.certificateId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${certificate.certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded shadow">
      <div>
        <p><strong>Student:</strong> {certificate.student.name}</p>
        <p><strong>Course:</strong> {certificate.course.title}</p>
        <p><strong>Status:</strong> {certificate.status}</p>
      </div>
      <button onClick={handleDownload} className="px-3 py-1 bg-blue-600 text-white rounded">
        Download
      </button>
    </div>
  );
}
