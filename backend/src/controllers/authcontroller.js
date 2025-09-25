 import User from "../models/user.js";
import Otp from "../models/Otp.js";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/email.js";
import crypto from "crypto";

// ---------------- SIGNUP ----------------
  
// export const sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: "Email is required" });

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "Email already exists" });

//     const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

//     await Otp.deleteMany({ email }); // clear old OTPs

//     await Otp.create({ email, otp: generatedOtp, expiresAt });

//     await transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to: email,
//       subject: "Your Signup OTP",
//       html: `<p>Your OTP is <b>${generatedOtp}</b>. It expires in 10 minutes.</p>`,
//     });

//     res.status(200).json({ message: "OTP sent to your email" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

//     const record = await Otp.findOne({ email, otp });
//     if (!record) return res.status(400).json({ message: "Invalid OTP" });
//     if (record.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

//     await Otp.deleteOne({ _id: record._id }); // OTP one-time use
//     res.status(200).json({ message: "OTP verified" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists (you might want to allow existing users for different flows)
    const existingUser = await User.findOne({ email: normalizedEmail }).lean();
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // generate OTP and expiry
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // remove old OTPs for this email
    await Otp.deleteMany({ email: normalizedEmail });

    // create new OTP record
    await Otp.create({ email: normalizedEmail, otp: generatedOtp, expiresAt });

    // Build mail
    const from = process.env.SUPPORT_EMAIL || process.env.SMTP_USER || "no-reply@example.com";
    const mailOptions = {
      from,
      to: normalizedEmail,
      subject: "Your Signup OTP",
      html: `<p>Your OTP is <b>${generatedOtp}</b>. It expires in 10 minutes.</p>`,
      text: `Your OTP is ${generatedOtp}. It expires in 10 minutes.`,
    };

    // send email using safe helper
    const result = await sendEmailSafe(mailOptions);

    if (!result.ok) {
      // Mailer failed — respond with 502 Bad Gateway (upstream service failure)
      console.error("sendOtp: email send failed for", normalizedEmail, "reason:", result.error);
      return res.status(502).json({ message: "Failed to send OTP email", detail: result.error });
    }

    // success
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("sendOtp: unexpected error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ message: "Internal Server Error", detail: err && err.message });
  }
};

/**
 * POST /auth/otp/verify
 * Body: { email, otp }
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const otpCode = String(otp).trim();

    // find OTP record (use a proper index on email+otp for performance)
    const record = await Otp.findOne({ email: normalizedEmail, otp: otpCode });
    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      // expired: remove it and return error
      try {
        await Otp.deleteOne({ _id: record._id });
      } catch (e) {
        console.warn("verifyOtp: failed to delete expired OTP:", e && e.message ? e.message : e);
      }
      return res.status(400).json({ message: "OTP expired" });
    }

    // one-time use: delete OTP
    await Otp.deleteOne({ _id: record._id });

    // At this point you may create the user or mark verification
    // For example, create a new user doc or return success so frontend proceeds to signup
    return res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    console.error("verifyOtp: unexpected error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ message: "Internal Server Error", detail: err && err.message });
  }
};




 export const signup = async (req, res) => {
  try {
    const { name, email, phone, password, roles, universityCode, referralCode } = req.body;

    if (!name || !email || !phone || !password || !roles) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password,
      role: roles[0],
      status: "approved",
    });

    // Teacher affiliation
    if (roles[0] === "teacher" && universityCode) {
      const university = await User.findOne({ universityCode, role: "university" });
      if (!university) return res.status(400).json({ message: "Invalid university code" });
      newUser.affiliatedUniversity = university._id;
    }

    // Referral mapping
    if (referralCode) {
      const partner = await User.findOne({ referralCode, role: "referral" });
      if (partner) newUser.referredBy = partner._id;
    }

    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


 
 

// export const signup = async (req, res) => {
//   try {
//     const { name, email, phone, password, roles, universityCode, referralCode, otp } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // ========================
//     // Step 1: OTP verification
//     // ========================
//     if (otp) {
//       const record = await Otp.findOne({ email, otp });
//       if (!record) return res.status(400).json({ message: "Invalid OTP" });
//       if (record.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

//       const { tempUserData } = record;

//       // Delete OTP after verification
//       await Otp.deleteOne({ _id: record._id });

//       const newUser = new User({
//         name: tempUserData.name,
//         email: record.email,
//         phone: tempUserData.phone,
//         password: tempUserData.password,
//         role: tempUserData.roles[0],
//         status: "approved",
//       });

//       // Teacher affiliation
//       if (tempUserData.roles[0] === "teacher" && tempUserData.universityCode) {
//         const university = await User.findOne({ universityCode: tempUserData.universityCode, role: "university" });
//         if (!university) return res.status(400).json({ message: "Invalid university code" });
//         newUser.affiliatedUniversity = university._id;
//       }

//       // Referral mapping
//       if (tempUserData.referralCode) {
//         const partner = await User.findOne({ referralCode: tempUserData.referralCode, role: "referral" });
//         if (partner) newUser.referredBy = partner._id;
//       }

//       await newUser.save();
//       return res.status(201).json({ message: "User registered successfully", user: newUser });
//     }

//     // ========================
//     // Step 2: Generate & send OTP
//     // ========================
//     if (!name || !phone || !password || !roles) {
//       return res.status(400).json({ message: "Missing required fields or invalid roles" });
//     }

//     const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
//     const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

//     await Otp.create({
//       email,
//       otp: generatedOtp,
//       expiresAt,
//       tempUserData: { name, phone, password, roles, universityCode, referralCode }
//     });

//     await transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to: email,
//       subject: "Your Signup OTP",
//       html: `<p>Your OTP for signup is <b>${generatedOtp}</b>. It expires in 10 minutes.</p>`,
//     });

//     return res.status(200).json({ message: "OTP sent to your email" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };



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
      { expiresIn: "2d" }
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
   // await(email, otpCode);
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
