 // src/config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      // "mongodb://priyanshu:priyanshu005@localhost:27017/lms_medigrow?authSource=admin"
      process.env.MONGO_URI
    );

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // exit process if DB fails
  }
};
