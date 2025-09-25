 import User from "../models/user.js";
import Course from "../models/course.js";
import University from "../models/user.js"; // if you have a separate model
import ApprovalLog from "../models/user.js";
import bcrypt from "bcryptjs";
 // optional, for audit

// -------------------- CREATE FIXED SUB-ADMIN --------------------
export const createManager = async (req, res) => {
  try {
    const { name, email,phone, password, subAdminRole } = req.body;

    if (!["blog_manager", "finance_manager", "governance", "role_manager" , "career_cell"].includes(subAdminRole)) {
      return res.status(400).json({ success: false, message: "Invalid sub-admin role" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "User already exists" });

    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password,
      role: "sub-admin",
      subAdminRole,
      status: "approved", // fixed sub-admins are approved by default
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "Sub-admin created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- FETCH USERS BY ROLE --------------------
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { page = 1, limit = 20, q } = req.query;

    let filter = {};
    if (role === "sub-admin") {
      filter.role = "sub-admin";
      if (q) filter.subAdminRole = { $regex: q, $options: "i" };
    } else {
      filter.role = role;
      if (q) filter.name = { $regex: q, $options: "i" };
    }

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({ success: true, data: users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- APPROVE / REJECT USERS --------------------
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.status = status;
    await user.save();

    if (ApprovalLog) {
      await ApprovalLog.create({
        entity: "User",
        entityId: id,
        approvedBy: req.user.id,
        status,
        note: note || "",
      });
    }

    res.json({ success: true, message: `User ${status} successfully`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- APPROVE / REJECT COURSES --------------------
// // src/controllers/courseController.js

export const approveCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body; // status: "approved" or "rejected"

    // ⚡ Fetch course without populating createdBy
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (status === "approved") {
      course.isApprovedBySuperAdmin = true;
      course.rejectionNote = null;
    } else if (status === "rejected") {
      course.isApprovedBySuperAdmin = false;
      course.rejectionNote = note || "Rejected by superadmin";
    } else {
      return res.status(400).json({ message: "Invalid status. Use 'approved' or 'rejected'." });
    }

    // Pre-save hook will automatically update isApproved
    await course.save(); // ⚡ No populate, so no validation error

    res.json({ message: `Course ${status} successfully`, course });
  } catch (error) {
    console.error("ApproveCourse Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// -------------------- APPROVE / REJECT UNIVERSITIES --------------------
export const approveUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const university = await University.findById(id);
    if (!university) return res.status(404).json({ success: false, message: "University not found" });

    university.status = status;
    await university.save();

    if (ApprovalLog) {
      await ApprovalLog.create({
        entity: "University",
        entityId: id,
        approvedBy: req.user.id,
        status,
        note: note || "",
      });
    }

    res.json({ success: true, message: `University ${status} successfully`, university });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

// ✅ Update SubAdmin Role
export const updateSubRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { subAdminRole } = req.body;

    if (!subAdminRole) {
      return res.status(400).json({ message: "subAdminRole is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { subAdminRole },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "SubAdmin role updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating subAdminRole", error: err.message });
  }
};




 
