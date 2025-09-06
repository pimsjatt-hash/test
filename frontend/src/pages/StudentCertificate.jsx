 import React, { useEffect, useState } from "react";
import { getCertificates } from "../api/api"; // adjust path if needed
import { Card, CardContent } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";

const StudentCertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

const downloadCertificate = async (id) => {
  try {
    const token = localStorage.getItem("token"); // your stored JWT

    if (!token) {
  alert("You are not logged in");
  return;
} 

    const res = await fetch(`http://localhost:5000/api/certificates/my/download/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text(); // for debugging
      throw new Error(text || "Download failed");
    }

    // convert response to blob
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    // create temporary link and click it
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}.pdf`; // set filename
    document.body.appendChild(a);
    a.click();
    a.remove();

    // free memory
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Certificate download error:", err);
    alert("Failed to download certificate. Check console.");
  }
};



  useEffect(() => {
    async function fetchCertificates() {
      try {
        const res = await getCertificates();
        console.log(res.data.certificates,"certificates");
        
        setCertificates(res.data.certificates); // assumes backend returns array
        console.log(certificates,"all here");
        
      } catch (err) {
        console.error("Error fetching certificates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCertificates();
  }, []);

  if (loading) return <p>Loading certificates...</p>;

  if (certificates.length === 0) return <p>No certificates available.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {certificates.map((cert) => (
        <Card key={cert._id}>
          <CardContent>
            <h3 className="text-lg font-bold">{cert.courseTitle}</h3>
            <p>Student: {cert.studentName}</p>
            <p>Status: {cert.status}</p>
            {cert.pdfUrl && (
              // <Button
              //   // onClick={() => window.open(`http://localhost:5000/api/certificates/download/${cert._id}`, "_blank")}
              //   // onClick={() => window.open(`http://localhost:5000${cert.pdfUrl}`, "_blank")}
              //    onClick={() => window.open(`http://localhost:5000/api/certificates/my/download/${cert._id}`, "_blank")}
              // >
              //   Download Certificate
              // </Button>

              <Button onClick={() => downloadCertificate(cert._id)}>
  Download Certificate
</Button>


            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudentCertificate;
