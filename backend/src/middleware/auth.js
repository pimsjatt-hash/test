 // src/middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token provided" });

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user from DB
    const user = await User.findById(decoded.id).select(
      "name email role subAdminRole dynamicSubRole status"
    );

    if (!user)
      return res.status(401).json({ message: "User not found" });

    req.user = user; // attach full user to request
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({ message: "Invalid token" });
  }
};
