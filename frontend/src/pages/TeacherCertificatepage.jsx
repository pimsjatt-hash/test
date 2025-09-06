import React, { useState, useEffect } from "react";
import { getCertificateTemplates, issueCertificate } from "../api/api.jsx";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label.jsx";
import { Button } from "../components/ui/button.jsx";
import { Dialog, DialogContent } from "../components/ui/dialog.jsx";

export default function TeacherCertificates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form, setForm] = useState({
    studentEmail: "",
    studentName: "",
    courseuniqueId: "",
    courseTitle: "",
    score: 0,
  });

  // Fetch available templates
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

  // Handle certificate issuing
  const handleIssue = async () => {
    if (!selectedTemplate) return alert("Please select a template");
    if (!form.studentEmail|| !form.studentName || !form.courseuniqueId || !form.courseTitle)
      return alert("Fill all required fields");

    try {
      const res = await issueCertificate({ ...form, templateId: selectedTemplate._id });

      if (res.data.certificate.status === "pending") {
        alert("Certificate request sent! Waiting for Super Admin approval.");
      } else {
        alert("Certificate issued successfully!");
      }

      setShowDialog(false);
      setForm({ studentEmail: "", studentName: "", courseuinqueId: "", courseTitle: "", score: 0 });
      setSelectedTemplate(null);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to issue certificate");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-black">Issue Certificates</h1>

      <Button onClick={() => setShowDialog(true)}>Issue New Certificate</Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <h3 className="text-lg font-semibold mb-4 text-black">Issue Certificate</h3>
          <div className="space-y-3">
            <Input
              placeholder="Student Email"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            />
            <Input
              placeholder="Student Name"
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
            />
            <Input
              placeholder="Courseunique ID"
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            />
            <Input
              placeholder="Course Title"
              value={form.courseTitle}
              onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Score"
              value={form.score}
              onChange={(e) => setForm({ ...form, score: Number(e.target.value) })}
            />

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

            <Button className="mt-4 w-full" onClick={handleIssue}>
              Confirm Issue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
