 import mongoose from "mongoose";

/**
 * Certificate Template Schema
 */
const certificateTemplateSchema = new mongoose.Schema(
  {
    signatories: [
      {
        name: { type: String, required: true },
        role: { type: String }, // optional: Dean, HOD, etc.
        imageUrl: { type: String }, // stored in /uploads/signatories
      },
    ],
    fields: [
      {
        name: { type: String, required: true },
        rolesAllowed: [
          {
            type: String,
            enum: ["superadmin", "teacher", "university"],
            required: true,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

/**
 * Issued Certificate Schema
 */
const issuedCertificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, unique: true, required: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CertificateTemplate",
      required: true,
    },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // university approver
    score: { type: Number, required: true },
    filledData: { type: Object }, // fields allowed by role
    status: { type: String, enum: ["pending", "issued"], default: "issued" },
    isValid: { type: Boolean, default: true },
    pdfUrl: { type: String }, // path of generated PDF certificate
    qrCodeUrl: { type: String, default: "" }, // optional future QR code
  },
  { timestamps: true }
);

export const CertificateTemplate = mongoose.model(
  "CertificateTemplate",
  certificateTemplateSchema
);
export const IssuedCertificate = mongoose.model(
  "IssuedCertificate",
  issuedCertificateSchema
);
