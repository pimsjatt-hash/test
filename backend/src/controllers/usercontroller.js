import User from "../models/user.js";

// Utility for role-based filters
const filterByRole = async (role, res) => {
  try {
    const users = await User.find({ role });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getStudents = (req, res) => filterByRole("student", res);
export const getTeachers = (req, res) => filterByRole("teacher", res);
export const getUniversity = (req, res) => filterByRole("university", res);
export const getReferral = (req, res) => filterByRole("referral", res);
export const getPartners = (req, res) => filterByRole("partner", res); // if you support partners
export const getSubAdmins = (req, res) => filterByRole("sub-admin", res);

// UPDATE status
export const updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const approveUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE subRole(s)
export const updateSubRole = async (req, res) => {
  try {
    const { subAdminRole, dynamicSubRole } = req.body;
    const update = {};
    if (subAdminRole) update.subAdminRole = subAdminRole;
    if (dynamicSubRole) update.dynamicSubRole = dynamicSubRole;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// CREATE
export const addUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message || "Bad request" });
  }
};

// DELETE
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
