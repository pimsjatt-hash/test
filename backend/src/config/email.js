// src/config/email.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (to, otp) => {
  await transporter.sendMail({
    from: `"Larnik Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  });
};
