import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // change if deployed
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Attach token automatically if present in localStorage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


// ===================== AUTH APIs =====================

// Signup user
export const signup = async (userData) => {
  // Ensure roles is always an array
  if (userData.role && !userData.roles) {
    
    userData.roles = [userData.role];
  }
  console.log(userData,"here");
  return API.post("/auth/signup", userData);
};

// Login user
export const login = async (credentials) => {
  return API.post("/auth/login", credentials);
};


// ==================== Coupon APIs ====================

// Create Coupon
export const createCoupon = (couponData) => API.post("/coupons", couponData);

// Get All Coupons
export const getCoupons = () => API.get("/coupons");

// Get Single Coupon by ID
export const getCouponById = (id) => API.get(`/coupons/${id}`);

// Update Coupon
export const updateCoupon = (id, updatedData) =>
  API.put(`/coupons/${id}`, updatedData);

// Delete Coupon
export const deleteCoupon = (id) => API.delete(`/coupons/${id}`);


// ---------------- SUPERADMIN APIs ----------------

// 1️⃣ Create Sub-Admin Manager
export const createManager = (data) =>
  API.post("/superadmin/create-manager", data);

// 2️⃣ Fetch users by role
export const getUsersByRole = (role, { page = 1, limit = 20, q = "" } = {}) =>
  API.get(`/superadmin/users/${role}`, {
    params: { page, limit, q },
  });

// 3️⃣ Approve/Reject User
export const approveUser = (id, status, note = "") =>
  API.patch(`/superadmin/approve/user/${id}`, { status, note });

// 4️⃣ Approve/Reject Course
export const approveCourse = (id, status, note = "") =>
  API.patch(`/superadmin/approve/course/${id}`, { status, note });

// 5️⃣ Approve/Reject University
export const approveUniversity = (id, status, note = "") =>
  API.patch(`/superadmin/approve/university/${id}`, { status, note });

// ✅ Delete User (needs /superadmin/delete-user/:id in backend)
export const deleteUser = (id) => API.delete(`/superadmin/delete-user/${id}`);

// ✅ Update Sub-Admin Role (needs /superadmin/update-role/:id in backend)
// export const updateSubRole = (id, subAdminRole) =>
//   // API.patch(`/superadmin/update-role/${id}`, { subAdminRole });
//   API.patch(`/superadmin/update-role/${id}`, { subAdminRole });
export const updateSubRole = (id, subAdminRole) =>
  API.put(`/superadmin/${id}/role`, { subAdminRole });


/* ======================
    USER MANAGEMENT APIS
   ====================== */

// Get all users
export const getAllUsers = () => API.get("/users");

// Filtered users
export const getStudents = () => API.get("/users/students");
export const getTeachers = () => API.get("/users/teachers");
export const getUniversity = () => API.get("/users/university");
export const getReferral = () => API.get("/users/referral");
export const getPartners = () => API.get("/users/partners");
export const getSubAdmins = () => API.get("/users/subadmin");

// Update status
export const updateUserStatus = (userId, status) =>
  API.put("/users", { userId, status });

// Approve status
export const approveUserStatus = (userId, status) =>
  API.put("/users/approve", { userId, status });

// Update subRole (only role_manager sub-admins allowed)
export const updateSubRoles = (id, data) =>
  API.put(`/users/subrole/${id}`, data);

// Add a new user (SuperAdmin only)
export const addUser = (data) => API.post("/users/add", data);

// Delete a user (SuperAdmin only)
export const deleteUsers = (id) => API.delete(`/users/${id}`);


/* ----------------------- COURSE APIs ----------------------- */

// ✅ Create Course (teacher/university)
export const createCourse = (data) => API.post("/courses", data);

// ✅ Get approved courses (public)
export const getCourses = () => API.get("/courses/getCourses");
export const getApproveCourses = () => API.get("/courses/getApproveCourses");

// ✅ Approve Course (university/superadmin)
export const approveCourses = (courseId, action) =>
  API.put(`/courses/approve/${courseId}`, { action });

// ✅ Add Module
export const addModule = (courseId, data) =>
  API.post(`/courses/${courseId}/module`, data);

// ✅ Add Video (multipart/form-data)
export const addVideo = (courseId, moduleId, formData) =>
  API.post(`/courses/${courseId}/module/${moduleId}/video`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ✅ Add Notes (multipart/form-data)
export const addNotes = (courseId, moduleId, formData) =>
  API.post(`/courses/${courseId}/module/${moduleId}/notes`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ✅ Add MCQs
export const addMcqs = (courseId, moduleId, mcqs) =>
  API.post(`/courses/${courseId}/module/${moduleId}/mcqs`, { mcqs });

// ✅ Submit Exam (student only)
export const submitExam = (courseId, data) =>
  API.post(`/courses/${courseId}/exam`, data);

// ✅ Delete Course
export const deleteCourse = (courseId) =>
  API.delete(`/courses/${courseId}`);