// backend/src/utils/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const SIGN_DIR = path.join(process.cwd(), "public", "signatures");

// ensure directory exists
if (!fs.existsSync(SIGN_DIR)) fs.mkdirSync(SIGN_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SIGN_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${unique}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  const allowed = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only PNG/JPEG signatures allowed"), false);
  }
  cb(null, true);
}

export const uploadSign = multer({ storage, fileFilter });
