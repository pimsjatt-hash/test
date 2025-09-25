 // src/controllers/roleManagerController.js
import e from "express";
import User from "../models/user.js";

// Create a dynamic sub-admin (only role_manager can create)
export const createDynamicSubAdmin = async (req, res) => {
  try {
    const { name, email, password, dynamicSubRole } = req.body;

    if (!["writer", "reviewer", "career_cell"].includes(dynamicSubRole)) {
      return res.status(400).json({ message: "Invalid dynamic sub-role" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({
      name,
      email,
      password, // hashed automatically
      role: "sub-admin",
      dynamicSubRole,
      status: "approved", // auto-approved by role manager
    });

    await user.save();
    res.status(201).json({ message: "Dynamic sub-admin created", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update dynamic sub-admin role or status (role_manager OR superadmin)
export const updateDynamicSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { dynamicSubRole, status } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (dynamicSubRole && !["writer", "reviewer", "career_cell"].includes(dynamicSubRole)) {
      return res.status(400).json({ message: "Invalid dynamic sub-role" });
    }

    if (dynamicSubRole) user.dynamicSubRole = dynamicSubRole;
    if (status) user.status = status;

    await user.save();
    res.json({ message: "Dynamic sub-admin updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all dynamic sub-admins (role_manager OR superadmin)
export const getDynamicSubAdmins = async (req, res) => {
  try {
    const users = await User.find({ role: "sub-admin", dynamicSubRole: { $ne: null } });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a dynamic sub-admin (role_manager OR superadmin)

export const deleteDynamicSubAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.json({ message: "Dynamic sub-admin deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
