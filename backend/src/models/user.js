// src/models/user.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const emailOtpSchema = new mongoose.Schema({
  code: { type: String },
  expiresAt: { type: Date },
  attempts: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },

    role: {
      type: String,
      enum: ["student", "teacher", "university", "referral", "superadmin", "sub-admin"],
      default: "student",
    },

    // Fixed sub-admin role (only for sub-admins)
    subAdminRole: {
      type: String,
      enum: ["blog_manager", "finance_manager", "governance", "role_manager"],
      default: null,
    },

    // Dynamic sub-role (only for sub-admins)
    dynamicSubRole: {
      type: String,
      enum: ["writer", "reviewer", "career_cell"],
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    emailOtp: emailOtpSchema,
    walletBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Pre-validate hook to enforce sub-admin rules
userSchema.pre("validate", function (next) {
  // Only sub-admins can have subAdminRole
  if (this.subAdminRole && this.role !== "sub-admin") {
    this.subAdminRole = null;
  }

  // Only sub-admins can have dynamicSubRole
  if (this.dynamicSubRole && this.role !== "sub-admin") {
    this.dynamicSubRole = null;
  }

  next();
});

// Pre-save password hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes for efficient querying
userSchema.index({ role: 1, subAdminRole: 1, dynamicSubRole: 1 });
userSchema.index({ status: 1 });

export default mongoose.model("User", userSchema);
