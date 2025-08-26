import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  couponName: { type: String, required: true, unique: true, trim: true, uppercase: true },
  discountType: { type: String, enum: ["percentage", "amount"], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);
