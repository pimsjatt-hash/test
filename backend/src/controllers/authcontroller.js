 // src/controllers/authController.js
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ---------------- SIGNUP ----------------
export const signup = async (req, res ,error) => {
  try {
    const { name, email, phone, password, roles, universityCode, referralCode } = req.body;

    if (!name || !email || !phone || !password || !roles) {
      // console.log(error.message,"my error");
      return res.status(400).json({ message: "Missing required fields or invalid roles" });
      
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = new User({
      name,
      email,
      phone,
      password, // hashed automatically by schema pre-save hook
      role: roles[0], // primary role
      universityCode: universityCode || undefined,
      referralCode: referralCode || undefined,
      status: "approved" // comment this line if you want pending approval flow
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- LOGIN WITH PASSWORD ----------------
export const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Optional: skip approval for testing
    // if (user.status !== "approved") {
    //   return res.status(403).json({ message: `Account status is "${user.status}". Access denied.` });
    // }

    const token = jwt.sign(
      { id: user._id, role: user.role, subAdminRole: user.subAdminRole, dynamicSubRole: user.dynamicSubRole },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- REQUEST OTP ----------------
export const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.emailOtp = {
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0
    };

    await user.save();

    // TODO: send OTP via email or SMS
    console.log(`OTP for ${email}: ${otpCode}`);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- LOGIN WITH OTP ----------------
export const loginWithOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.emailOtp || user.emailOtp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.emailOtp.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Clear OTP after successful login
    user.emailOtp = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, subAdminRole: user.subAdminRole, dynamicSubRole: user.dynamicSubRole },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
