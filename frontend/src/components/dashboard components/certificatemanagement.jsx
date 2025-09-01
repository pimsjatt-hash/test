import React, { useState } from "react";
import CreateCertificateTemplate from "../Certificatemanagement/CreateCertificateTemplate";
import CertificateTemplates from "../Certificatemanagement/CertificateTemplates";
import { deleteCertificateTemplate } from "../../api/api";

export default function CertificateManagement() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => setRefreshKey((prev) => prev + 1);
  const handleDelete = async (id) => {
    await deleteCertificateTemplate(id);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="grid gap-6 p-6">
      <CreateCertificateTemplate onCreated={handleCreated} />
      <CertificateTemplates refreshKey={refreshKey} onDelete={handleDelete} />
    </div>
  );
}
