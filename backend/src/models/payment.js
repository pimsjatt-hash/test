// src/models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
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

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },

    method: {
      type: String,
      enum: ["razorpay", "manual"], // for flexibility
      default: "razorpay",
    },

    // Razorpay fields (keep commented until client details provided)
    /*
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    */

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
