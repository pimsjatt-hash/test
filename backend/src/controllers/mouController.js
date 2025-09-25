// // backend/src/controllers/mouController.js
// import Mou from "../models/mou.js";
// import path from "path";
// import fs from "fs";

// /**
//  * Document Officer uploads MoU
//  */
// export const uploadMouFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const filePath = `/public/mous/${req.file.filename}`;

//     const newMou = await Mou.create({
//       universityId: req.user.id, // or req.user.universityId if stored
//       createdBy: req.user.id,
//       fileUrl: filePath,
//       status: "submitted",
//     });

//     res.json({ success: true, message: "MoU submitted to governance", data: newMou });
//   } catch (err) {
//     console.error("Upload MoU error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * Governance Officer downloads MoU file
//  */
// export const downloadMouFile = async (req, res) => {
//   try {
//     const mou = await Mou.findById(req.params.id);
//     if (!mou) return res.status(404).json({ success: false, message: "MoU not found" });

//     const filePath = path.join(process.cwd(), mou.fileUrl);
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ success: false, message: "File not found" });
//     }

//     res.download(filePath);
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * Governance Officer approves MoU
//  */
// export const approveMou = async (req, res) => {
//   try {
//     const mou = await Mou.findById(req.params.id);
//     if (!mou) return res.status(404).json({ success: false, message: "MoU not found" });

//     mou.status = "approved";
//     mou.governanceOfficer = req.user.id;
//     mou.governanceComment = req.body.comment || "";
//     mou.timestamps.reviewedAt = new Date();

//     await mou.save();

//     res.json({ success: true, message: "MoU approved successfully", data: mou });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * Governance Officer rejects MoU
//  */
// export const rejectMou = async (req, res) => {
//   try {
//     const mou = await Mou.findById(req.params.id);
//     if (!mou) return res.status(404).json({ success: false, message: "MoU not found" });

//     mou.status = "rejected";
//     mou.governanceOfficer = req.user.id;
//     mou.governanceComment = req.body.comment || "";
//     mou.timestamps.reviewedAt = new Date();

//     await mou.save();

//     res.json({ success: true, message: "MoU rejected", data: mou });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };




// /**
//  * List MoUs (Document Officer sees own, Governance Officer sees all)
//  */
// export const getMous = async (req, res) => {
//   try {
//     let filter = {};
//     if (req.user.dynamicSubRole === "documentOfficer") {
//       // document officer sees only their own uploads
//       filter.createdBy = req.user.id;
//     }
//     const mous = await Mou.find(filter).populate("governanceOfficer", "name email");
//     res.json({ success: true, data: mous });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



// backend/src/controllers/mouController.js
import Mou from "../models/Mou.js";
import path from "path";
import fs from "fs";

/**
 * Document Officer uploads MoU
 */
export const uploadMouFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = `/public/mous/${req.file.filename}`;

    const newMou = await Mou.create({
      universityId: req.user.id, // or req.user.universityId if stored
      createdBy: req.user.id,
      fileUrl: filePath,
      status: "submitted",
    });

    res.json({ success: true, message: "MoU submitted to governance", data: newMou });
  } catch (err) {
    console.error("Upload MoU error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Governance Officer downloads MoU file
 */
export const downloadMouFile = async (req, res) => {
  try {
    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).json({ success: false, message: "MoU not found" });

    const filePath = path.join(process.cwd(), mou.fileUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Governance Officer approves MoU
 */
export const approveMou = async (req, res) => {
  try {
    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).json({ success: false, message: "MoU not found" });

    mou.status = "approved";
    mou.governanceOfficer = req.user.id;
    // mou.governanceComment = req.body.comment || "";
    mou.timestamps.reviewedAt = new Date();

    await mou.save();

    res.json({ success: true, message: "MoU approved successfully", data: mou });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Governance Officer rejects MoU
//  */
// export const rejectMou = async (req, res) => {
//   try {
//     const mou = await Mou.findById(req.params.id);
//     if (!mou) return res.status(404).json({ success: false, message: "MoU not found" });

//     mou.status = "rejected";
//     mou.governanceOfficer = req.user.id;
//     mou.governanceComment = req.body.comment || "";
//     mou.timestamps.reviewedAt = new Date();

//     await mou.save();

//     res.json({ success: true, message: "MoU rejected", data: mou });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


 export const rejectMou = async (req, res) => {
  try {
    const mou = await Mou.findById(req.params.id);
    if (!mou)
      return res.status(404).json({ success: false, message: "MoU not found" });

    mou.status = "rejected";
    mou.governanceOfficer = req.user.id;
    mou.governanceComment = req.body?.comment || "";

    if (!mou.timestamps) mou.timestamps = {};
    mou.timestamps.reviewedAt = new Date();

    await mou.save();

    res.json({ success: true, message: "MoU rejected", data: mou });
  } catch (err) {
    console.error("Error rejecting MoU:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};





/**
 * List MoUs (both roles see their data)
 */
export const getMous = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "university") {
      filter.createdBy = req.user.id; // university user sees only their uploads
    }
    const mous = await Mou.find(filter).populate("governanceOfficer", "name email");
    res.json({ success: true, data: mous });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
