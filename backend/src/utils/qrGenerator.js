// backend/src/utils/qrGenerator.js
import QRCode from "qrcode";

export async function generateQrDataUrl(text) {
  // returns a data URL (png) that can be embedded or saved
  return QRCode.toDataURL(text, { margin: 1, scale: 6 });
}

export async function generateQrBuffer(text) {
  // returns Buffer (png)
  const dataUrl = await generateQrDataUrl(text);
  const base64 = dataUrl.split(",")[1];
  return Buffer.from(base64, "base64");
}
