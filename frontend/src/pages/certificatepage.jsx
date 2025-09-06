 import React, { useEffect, useState } from "react";
import {
  createCertificateTemplate,
  uploadSignature,
  getCertificateTemplates,
  deleteCertificateTemplate,
  getCertificates,
  issueCertificate,
} from "../api/api.jsx";

import { Card, CardContent } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label.jsx";
import { Dialog, DialogContent } from "../components/ui/dialog.jsx";

/* ------------------------------------------------------------
   Template Preview Component
------------------------------------------------------------ */
function TemplatePreview({ templateDraft }) {
  const signatories = templateDraft.signatories || [];

  return (
    <div className="w-full max-w-3xl mx-auto bg-red-500">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="relative bg-white w-full h-[420px] border rounded shadow-sm">
            <div className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-2xl font-bold text-black">Certificate of Completion</h2>
                <p className="text-sm text-black">Issued by Larnik E-Learning</p>
              </div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-xl text-black">This certifies that</p>
              <h3 className="mt-2 text-3xl font-semibold text-black">
                {templateDraft.studentName || "[Student Name]"}
              </h3>
              <p className="mt-3 text-lg text-black">has successfully completed</p>
              <p className="mt-2 text-lg font-medium text-black">
                {templateDraft.courseTitle || "[Course Title]"}
              </p>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div className="flex gap-6 items-end">
                {signatories.length > 0 ? (
                  signatories.map((s, i) => (
                    <div key={i} className="flex flex-col items-center w-40">
                      {s.signaturePreview ? (
                        <img src={s.signaturePreview} alt={`sig-${i}`} className="h-16 object-contain" />
                      ) : (
                        <div className="h-16 w-40 bg-gray-100 flex items-center justify-center text-xs text-black">
                          signature
                        </div>
                      )}
                      <div className="text-sm mt-1 text-center font-medium text-black">{s.name || "Signatory"}</div>
                      <div className="text-xs text-black">{s.title || "Title"}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-black">No signatories yet</div>
                )}
              </div>
              <div className="text-right text-xs text-black">Certificate ID: {templateDraft.uniqueId || "—"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------
   Create Certificate Template Component
------------------------------------------------------------ */
export function CreateTemplate({ onCreated }) {
  const [name, setName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [signatories, setSignatories] = useState([]);
  const [loading, setLoading] = useState(false);

  const addSign = () => {
    if (signatories.length >= 5) return;
    setSignatories((s) => [...s, { name: "", title: "", signatureFile: null, signaturePreview: null }]);
  };

  const removeSign = (idx) => {
    setSignatories((s) => s.filter((_, i) => i !== idx));
  };

  const updateSign = (idx, patch) => {
    setSignatories((s) => s.map((sig, i) => (i === idx ? { ...sig, ...patch } : sig)));
  };

  const handleFile = (idx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updateSign(idx, { signatureFile: file, signaturePreview: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!name.trim()) return alert("Template name required");
    if (!studentName.trim()) return alert("Student name required");
    if (!courseTitle.trim()) return alert("Course title required");
    if (!uniqueId.trim()) return alert("Certificate ID required");

    setLoading(true);
    try {
      const res = await createCertificateTemplate({
        name,
        fields: [
          { name: "studentName", rolesAllowed: ["superadmin", "teacher", "university"] },
          { name: "courseTitle", rolesAllowed: ["superadmin", "teacher", "university"] },
          { name: "uniqueId", rolesAllowed: ["superadmin", "teacher", "university"] },
        ],
        layout: {},
        signatories: [],
      });

      const template = res.data.template;

      // Upload signatures separately using FormData
      for (let i = 0; i < signatories.length; i++) {
        const s = signatories[i];
        if (!s.signatureFile) continue;

        const fd = new FormData();
        fd.append("signature", s.signatureFile);
        fd.append("name", s.name || "");
        fd.append("title", s.title || "");

        try {
          await uploadSignature(template._id, fd);
        } catch (uploadErr) {
          console.error("Signature upload failed:", uploadErr.response?.data || uploadErr.message);
          alert(uploadErr.response?.data?.message || "Failed to upload signature");
        }
      }

      setLoading(false);
      onCreated?.();
      alert("Template created successfully");
    } catch (err) {
      console.error("Template creation failed:", err);
      setLoading(false);
      alert(err?.response?.data?.message || "Failed to create template");
    }
  };

  const templateDraft = {
    studentName: studentName || "John Doe",
    courseTitle: courseTitle || "Sample Course",
    uniqueId: uniqueId || "—",
    signatories,
  };

  return (
    <div className="space-y-4 bg-cyan-400">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Template Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mb-4" />

              <Label>Student Name</Label>
              <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} className="mb-4" />

              <Label>Course Title</Label>
              <Input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} className="mb-4" />

              <Label>Certificate ID</Label>
              <Input value={uniqueId} onChange={(e) => setUniqueId(e.target.value)} className="mb-4" />

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <Label>Signatories (max 5)</Label>
                  <Button size="sm" variant="outline" onClick={addSign} disabled={signatories.length >= 5}>
                    Add
                  </Button>
                </div>
                <div className="space-y-3 mt-3">
                  {signatories.map((s, i) => (
                    <div key={i} className="p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Input placeholder="Name" value={s.name} onChange={(e) => updateSign(i, { name: e.target.value })} />
                        <Input placeholder="Title" value={s.title} onChange={(e) => updateSign(i, { title: e.target.value })} />
                        <input type="file" accept="image/*" onChange={(e) => handleFile(i, e.target.files?.[0])} />
                        <Button size="sm" variant="ghost" onClick={() => removeSign(i)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button onClick={handleCreate} disabled={loading}>
                    {loading ? "Creating..." : "Create Template"}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label>Live Preview</Label>
              <div className="mt-2">
                <TemplatePreview templateDraft={templateDraft} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------
   Template List Component
------------------------------------------------------------ */
export function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  // const fetchTemplates = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await getCertificateTemplates();
  //     setTemplates(res.data.templates || []);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to load templates");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchTemplates();
  // }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete template?")) return;
    await deleteCertificateTemplate(id);
    // fetchTemplates();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Templates</h3>
        {/* <Button onClick={fetchTemplates}>Refresh</Button> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <Card key={t._id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-md font-medium text-black">{t.name}</h4>
                <p className="text-sm text-black">Created: {new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setSelected(t)}>
                  Preview
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(t._id)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl">
          {selected && (
            <div>
              <h3 className="text-lg font-semibold text-black">Preview: {selected.name}</h3>
              <div className="mt-4">
                <TemplatePreview
                  templateDraft={{
                    signatories: selected.signatories || [],
                    studentName: "Jane Doe",
                    courseTitle: "Sample Course",
                    uniqueId: "—",
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------
   Student Certificates Component
------------------------------------------------------------ */
export function StudentCertificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const res = await getCertificates();
      setCerts(res.data.certificates?.map(c => ({ ...c, pdfUrl: c.pdfUrl.startsWith('http') ? c.pdfUrl : `${import.meta.env.VITE_API_BASE_URL}${c.pdfUrl}` })) || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleDownload = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-black">My Certificates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map((c) => (
          <Card key={c._id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-md font-medium text-black">{c.courseTitle}</h4>
                <p className="text-sm text-black">Issued: {new Date(c.issuedAt).toLocaleDateString()}</p>
                <p className="text-xs text-black">Score: {c.score}%</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={() => handleDownload(c.pdfUrl)}>Download</Button>
                <a href={`/certificates/validate/${c.uniqueId}`} target="_blank" rel="noreferrer" className="text-xs text-black">
                  Validate
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Governance Certificates Component
------------------------------------------------------------ */
export function GovernanceCertificates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form, setForm] = useState({ studentId: "", studentName: "", courseuniqueId: "", courseTitle: "", score: 0 });

  // const fetchTemplates = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await getCertificateTemplates();
  //     setTemplates(res.data.templates || []);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to load templates");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchTemplates();
  // }, []);
 const handleIssue = async () => {
  if (!selectedTemplate) return alert("Select a template");
  if (!form.studentEmail || !form.studentName || !form.courseuniqueId || !form.courseTitle)
    return alert("Fill all required fields");

  try {
    const res = await issueCertificate({ ...form, templateId: selectedTemplate._id });

    if (res.data.certificate.status === "pending") {
      alert("Certificate request sent! Waiting for Super Admin approval.");
    } else {
      alert("Certificate issued successfully!");
    }

    setShowDialog(false);
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.message || "Failed to issue certificate");
  }
};

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-black">Governance Certificates (Issue)</h3>

      <Button onClick={() => setShowDialog(true)}>Issue New Certificate</Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <h3 className="text-lg font-semibold mb-4 text-black">Issue Certificate</h3>
          <div className="space-y-3">
            <Input placeholder="Student Email" value={form.studentEmail} onChange={(e) => setForm({ ...form, studentEmail: e.target.value })} />
            <Input placeholder="Student Name" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
            <Input placeholder="Courseunique ID" value={form.courseuniqueId} onChange={(e) => setForm({ ...form, courseuniqueId: e.target.value })} />
            <Input placeholder="Course Title" value={form.courseTitle} onChange={(e) => setForm({ ...form, courseTitle: e.target.value })} />
            <Input type="number" placeholder="Score" value={form.score} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} />

            <Label>Select Template</Label>
            <div className="grid grid-cols-1 gap-2">
              {templates.map((t) => (
                <Button
                  key={t._id}
                  variant={selectedTemplate?._id === t._id ? "default" : "outline"}
                  onClick={() => setSelectedTemplate(t)}
                >
                  {t.name}
                </Button>
              ))}
            </div>

            <Button className="mt-4 w-full" onClick={handleIssue}>Confirm Issue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------
   Export Certificate Manager Page
------------------------------------------------------------ */
export default function CertificateManagerPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className="p-6 space-y-8 bg-green-400">
      <h1 className="text-2xl font-bold text-black">Certificate Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CreateTemplate onCreated={() => setRefreshKey((k) => k + 1)} />
        </div>
        <div>
          <TemplateList key={refreshKey} />
        </div>
      </div>
      <div className="mt-8">
        <StudentCertificates />
      </div>
      <div className="mt-8">
        <GovernanceCertificates />
      </div>
    </div>
  );
}
``
