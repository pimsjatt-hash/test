 import React, { useEffect, useState } from "react";
import axios from "axios";
import CertificateItem from "./CertificateItem";

export default function CertificateList() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axios.get("/api/certificates");
        // ✅ Safely handle both array and object responses
        if (Array.isArray(res.data)) {
          setCertificates(res.data);
        } else if (Array.isArray(res.data.certificates)) {
          setCertificates(res.data.certificates);
        } else {
          setCertificates([]);
        }
      } catch (err) {
        console.error("Failed to fetch certificates", err);
        setCertificates([]);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {certificates.length === 0 ? (
        <p>No certificates found.</p>
      ) : (
        certificates.map((cert) => (
          <CertificateItem key={cert._id} certificate={cert} />
        ))
      )}
    </div>
  );
}
