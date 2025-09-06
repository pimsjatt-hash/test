 import mongoose from "mongoose";

/**
 * Certificate Template Schema
 */
// const CertificateTemplateSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // creator (SuperAdmin / University)
//   logoUrl: { type: String },        // optional logo path or CDN
//   backgroundUrl: { type: String },  // optional background image
//   signatories: [
//     {
//       name: { type: String, required: true },
//       title: { type: String, default: "" },
//       signatureUrl: { type: String, default: "" }
//     }
//   ],
//   fields: [
//     {
//       name: { type: String, required: true },
//       rolesAllowed: [
//         {
//           type: String,
//           enum: ["superadmin", "teacher", "university"],
//           required: true
//         }
//       ]
//     }
//   ],
//   layout: { type: Object, default: {} }, // positions, fonts, colors
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

/**
 * Issued Certificate Schema
 */
const IssuedCertificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true }, // <-- add this
  studentEmail: { type: String, required: true },
  studentName: { type: String, required: true },
   courseuniqueId: { type: String, required: true },  // manually entered by teacher
  courseTitle: { type: String, required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "CertificateTemplate" },
  score: { type: Number, required: true },
  issuedAt: { type: Date, default: Date.now },
  pdfUrl: { type: String, default: "" },
  qrUrl: { type: String, default: "" },
  validated: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});


// export const CertificateTemplate = mongoose.model("CertificateTemplate", CertificateTemplateSchema);
export const IssuedCertificate = mongoose.model("IssuedCertificate", IssuedCertificateSchema);
