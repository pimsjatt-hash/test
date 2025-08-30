 // src/models/certificate.js
import mongoose from "mongoose";

/**
 * Certificate Template Schema
 */
  const certificateTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designUrl: { type: String, required: true }, // background design
    signatory: {
      name: { type: String, required: true },
      imageUrl: { type: String }, // stored in /uploads/signatories
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fields: [{ type: String }],
  },
  { timestamps: true }
);

/**
 * Issued Certificate Schema
 */
   const issuedCertificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, unique: true, required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    template: { type: mongoose.Schema.Types.ObjectId, ref: "CertificateTemplate", required: true },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
    qrCodeUrl: { type: String, default: "" },
    score: { type: Number, required: true },
    filledData: { type: Object },
    status: { type: String, enum: ["pending", "issued"], default: "issued" },
    isValid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CertificateTemplate = mongoose.model("CertificateTemplate", certificateTemplateSchema);
export const IssuedCertificate = mongoose.model("IssuedCertificate", issuedCertificateSchema);