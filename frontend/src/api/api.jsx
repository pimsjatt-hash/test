// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api", // change if deployed
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 🔑 Attach token automatically if present in localStorage
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });


// // ===================== AUTH APIs =====================

// // Signup user
// export const signup = async (userData) => {
//   // Ensure roles is always an array
//   if (userData.role && !userData.roles) {
    
//     userData.roles = [userData.role];
//   }
//   console.log(userData,"here");
//   return API.post("/auth/signup", userData);
// };

// // Login user
// export const login = async (credentials) => {
//   return API.post("/auth/login", credentials);
// };

// // ==================== Otp APIs ====================
// export const sendOtp=async(userEmail)=>{
//   return API.post("/auth/otp/send", userEmail);
// }
// export const verifyOtp=async(data)=>{
//   return API.post("/auth/otp/verify", data);
// }


// // ==================== Coupon APIs ====================

// // Create Coupon
// export const createCoupon = (couponData) => API.post("/coupons", couponData);

// // Get All Coupons
// export const getCoupons = () => API.get("/coupons");

// // Get Single Coupon by ID
// export const getCouponById = (id) => API.get(`/coupons/${id}`);

// // Update Coupon
// export const updateCoupon = (id, updatedData) =>
//   API.put(`/coupons/${id}`, updatedData);

// // Delete Coupon
// export const deleteCoupon = (id) => API.delete(`/coupons/${id}`);


// // ---------------- SUPERADMIN APIs ----------------

// // 1️⃣ Create Sub-Admin Manager
// export const createManager = (data) =>
//   API.post("/superadmin/create-manager", data);

// // 2️⃣ Fetch users by role
// export const getUsersByRole = (role, { page = 1, limit = 20, q = "" } = {}) =>
//   API.get(`/superadmin/users/${role}`, {
//     params: { page, limit, q },
//   });

// // 3️⃣ Approve/Reject User
// export const approveUser = (id, status, note = "") =>
//   API.patch(`/superadmin/approve/user/${id}`, { status, note });

// // 4️⃣ Approve/Reject Course
// export const approveCourse = (id, status, note = "") =>
//   API.patch(`/superadmin/approve/course/${id}`, { status, note });

// // 5️⃣ Approve/Reject University
// export const approveUniversity = (id, status, note = "") =>
//   API.patch(`/superadmin/approve/university/${id}`, { status, note });

// // ✅ Delete User (needs /superadmin/delete-user/:id in backend)
// export const deleteUser = (id) => API.delete(`/superadmin/delete-user/${id}`);

 
// export const updateSubRole = (id, subAdminRole) =>
//   API.put(`/superadmin/${id}/role`, { subAdminRole });


// /* ======================
//     USER MANAGEMENT APIS
//    ====================== */

// // Get all users
// export const getAllUsers = () => API.get("/users");

// // Filtered users
// export const getStudents = () => API.get("/users/students");
// export const getTeachers = () => API.get("/users/teachers");
// export const getUniversity = () => API.get("/users/university");
// export const getReferral = () => API.get("/users/referral");
// export const getPartners = () => API.get("/users/partners");
// export const getSubAdmins = () => API.get("/users/subadmin");

// // Update status
// export const updateUserStatus = (userId, status) =>
//   API.put("/users", { userId, status });

// // Approve status
// export const approveUserStatus = (userId, status) =>
//   API.put("/users/approve", { userId, status });

// // Update subRole (only role_manager sub-admins allowed)
// export const updateSubRoles = (id, data) =>
//   API.put(`/users/subrole/${id}`, data);

// // Add a new user (SuperAdmin only)
// export const addUser = (data) => API.post("/users/add", data);

// // Delete a user (SuperAdmin only)
// export const deleteUsers = (id) => API.delete(`/users/${id}`);


// /* ----------------------- COURSE APIs ----------------------- */

// // ✅ Create Course (teacher/university)
// // export const createCourse = (data) => API.post("/courses", data);

// // ✅ Get approved courses (public)
// export const getCourses = () => API.get("/courses/getCourses");
// export const getApproveCourses = () => API.get("/courses/getApproveCourses");

// // ✅ Approve Course (university/superadmin)
// export const approveCourses = (courseId, action) =>
//   API.patch(`/courses/${courseId}/approve`, { action });

// // ✅ Add Module
// export const addModule = (courseId, data) =>
//   API.post(`/courses/${courseId}/module`, data);

// // ✅ Add Video (multipart/form-data)
// export const addVideo = (courseId, moduleId, formData) =>
//   API.post(`/courses/${courseId}/module/${moduleId}/video`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// // ✅ Add Notes (multipart/form-data)
// export const addNotes = (courseId, moduleId, formData) =>
//   API.post(`/courses/${courseId}/module/${moduleId}/notes`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// // ✅ Add MCQs
// export const addMcqs = (courseId, moduleId, mcqs) =>
//   API.post(`/courses/${courseId}/module/${moduleId}/mcqs`, { mcqs });

// // ✅ Submit Exam (student only)
// export const submitExam = (courseId, data) =>
//   API.post(`/courses/${courseId}/exam`, data);

// // ✅ Delete Course
// export const deleteCourse = (courseId) =>
//   API.delete(`/courses/${courseId}`);


// //blog APIs
 

// // Create Blog (Blog Manager only)
// export const createBlog = (data) => API.post("/blogs", data);

// // Get All Blogs (Public)
// export const getBlogs = () => API.get("/blogs");

// //  Delete Blog (Blog Manager only)
// export const deleteBlog = (id) => API.delete(`/blogs/${id}`);



 

// /* ====================== CERTIFICATE APIs ====================== */

 

// /* ===================== CERTIFICATE APIS ===================== */

// // ✅ Update Certificate Template (Superadmin only)
// export const updateCertificateTemplate = (templateId, data) =>
//   API.put(`/certificates/templates/${templateId}`, data);

// // ✅ Issue Certificate (Teacher/University)
// export const issueCertificate = (data) =>
//   API.post("/certificates/issue", data);

// // ✅ Approve Certificate (University/Superadmin)
// export const approveCertificate = (certificateId) =>
//   API.patch(`/certificates/approve/${certificateId}`);

// // ✅ Reject Certificate (University/Superadmin)
// export const rejectCertificate = (certificateId) =>
//   API.patch(`/certificates/reject/${certificateId}`);

// // ✅ Get Certificates of logged-in Student
// export const getCertificates = () =>
//   API.get("/certificates/my");

// // ✅ Download a Certificate (student)
// export const downloadCertificate = (certificateId) =>
//   API.get(`/certificates/download/${certificateId}`, { responseType: "blob" });

// // ✅ Validate Certificate (Public access via uniqueId/QR)
// export const validateCertificate = (uniqueId) =>
//   API.get(`/certificates/validate/${uniqueId}`);

// // Optional: Get Certificate Template by ID (for teacher/university/superadmin)
// export const getCertificateTemplateById = (templateId) =>
//   API.get(`/certificates/templates/${templateId}`);
// export const getPendingCertificates = () => API.get("/certificates/pending");
// export const getDefaultTemplate = () => API.get("/certificates/default");




// // ===================== STUDENT APIs =====================// api/api.jsx
// export const getStudentProfile = () => API.get("/student/profile");
// export const updateStudentProfile = (data) => API.put("/student/profile", data);
// export const getAvailableCourses = () => API.get("/student/courses");
// export const enrollInCourse = (courseId) => API.post("/student/enroll", { courseId });
// export const getMyCourses = () => API.get("/student/my-courses");
// export const submitReview = (data) => API.post("/student/review", data);


 


 






// /* ====================== WALLET & FINANCE APIs ====================== */

  
// // //////////////////////////

// // // // Get teacher wallet details
// // //  export const getWallet = (ownerId, ownerType = "teacher") => {
// // //   return API.get(`/wallet/${ownerId}`, {
// // //     params: { ownerType },
// // //   });
// // // }
// // // ======================
// // // Settlement Requests
// // // ======================

// // // Teacher requests a payout/settlement
// // // For freelancer teacher or affiliated teacher (will go to university first)
// // export const requestSettlement = (teacherId) =>
// //   API.post("/wallet/request", { teacherId });

// // // University approves teacher settlement and decides teacher share
// // // body: { teacherId, transactionId, teacherShare }
// // export const universityApproveSettlement = (data) =>
// //   API.post("/wallet/university/approve", data);

// // // Finance Manager approves final payout (applies platform cut)
// // // body: { walletOwnerId, transactionId, platformShare }
// //  export const approveSettlement = ({ walletOwnerId, transactionId, split }) => {
// //   return API.post("/wallet/settlement/approve", {
// //     walletOwnerId,
// //     transactionId,
// //     split, // { teacher: 70, university: 20, platform: 10 }
// //   });
// // };

// //  export const rejectSettlement = ({ walletOwnerId, transactionId }) => {
// //   return API.post("/wallet/settlement/reject", {
// //     walletOwnerId,
// //     transactionId,
// //   });
// // };
 

// // ======================
// // Teacher settlement
// // ======================
// export const teacherRequestSettlement = (data) =>
//   API.post("/wallet/teacher/request", data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

// // ======================
// // University settlement
// // ======================
// export const universityRequestSettlement = (data) =>
//   API.post("/wallet/university/request", data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

// export const universityApproveSettlement = (data) =>
//   API.post("/wallet/university/approve", data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

// // ======================
// // Referral settlement
// // ======================
// export const referralRequestSettlement = (data) =>
//   API.post("/wallet/referral/request", data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

// // ======================
// // Finance Manager settlement
// // ======================
// export const financeApproveSettlement = (data) =>
//   API.post("/wallet/finance/approve", data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

// export const financeRejectSettlement = (data) =>
//   API.post("/wallet/finance/reject", data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

// // ======================
// // Common wallet route
// export const getWallet = (ownerType, ownerId) =>
//   API.get(`/wallet/${ownerType}/${ownerId}`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });



  


// // ✅ Reject a settlement request as university
// export const universityRejectSettlement = (data) =>
//   API.post("/wallet/university/reject", data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });


















// // ======================
// // Wallet Credit/Debit (Finance Manager only)
// // ======================

// // Credit a teacher wallet manually
// // body: { studentId, courseId, amount }
// export const creditWallet = (data) =>
//   API.post("/finance/credit", data);

// // Debit a teacher wallet manually
// // body: { teacherId, amount }
// export const debitWallet = (data) =>
//   API.post("/finance/debit", data);


// export const getPendingSettlements = () => {
//   return API.get("/finance/pending-settlements");
// };

// // api.jsx
// // export const getWallet = (ownerId, ownerType = "teacher") => {
// //   return API.get(`/wallet/${ownerId}?ownerType=${ownerType}`);
// // };




// //  career cell APIs
// export const addJob = (data) => API.post("/careercell/job", data);
// export const getJobs = () => API.get("/careercell/jobs");
// export const getJobsByMode = (mode) => API.get(`/careercell/jobs/mode/${mode}`);
// export const addWebinar = (data) => API.post("/careercell/webinar", data);
// export const getWebinars = () => API.get("/careercell/webinars");
// export const addGuide = (data) => API.post("/careercell/guide", data);
// export const getGuides = () => API.get("/careercell/guides");
// export const deletejobbyId = (id) => API.delete(`/careercell/job/${id}`);
// export const deleteguidebyId = (id) => API.delete(`/careercell/guide/${id}`);
// export const deletewebinarbyId = (id) => API.delete(`/careercell/webinar/${id}`);



// //governance and mou  APIs
// // MoU APIs
// export const uploadMouFile = (formData) =>
//   API.post("/mou/upload", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// export const downloadMouFile = (id) =>
//   API.get(`/mou/${id}/download`, { responseType: "blob" });

// export const approveMou = (id,data) =>
//   API.post(`/mou/${id}/approve`,data);

// export const rejectMou = (id,data) =>
//   API.post(`/mou/${id}/reject`,data);

// export const getMous = () =>
//   API.get("/mou");







// //report aPI 
// // ---------------- SUPERADMIN REPORTS API ----------------

// // Create a new report (Super Admin)
// export const createReport = (data) => API.post("/report", data);

// // Get all reports (Super Admin)
// export const getReports = () => API.get("/report");

// // Download a report by ID (Super Admin)
// export const downloadReport = (id) =>
//   API.get(`/report/${id}/download`, { responseType: "blob" });

// // Delete a report by ID (Super Admin)
// export const deleteReport = (id) => API.delete(`/report/${id}`);



// //university API
// // University Analytics API
//  // University Analytics API
// export const getUniversityAnalytics = () => API.get("/university/analytics");
// export const exportAnalyticsPDF = () =>
//   API.get("/university/analytics/export/pdf", { responseType: "blob" });

// export const exportAnalyticsExcel = () =>
//   API.get("/university/analytics/export/excel", { responseType: "blob" });

//  export const getAffiliatedTeachers = async () => {
//   try {
//     const { data } = await API.get("/university/affiliatedTeachers");
//     return data;
//   } catch (error) {
//     console.error("Error fetching affiliated teachers:", error);
//     throw error.response?.data || { message: "Server error" };
//   }
// };


// // ✅ Get live university earnings
// export const getUniversityEarnings = (universityId) =>
//   API.get(`/university/earnings/${universityId}`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });


//   export const getTeacherSettlementRequests = async () => {
//   const token = localStorage.getItem("token");
//   return API.get("/university/teacher-requests", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };


// //referral partner API
// // Referral Partner Dashboard APIs
//  // Referral Partner Dashboard APIs
// export const getReferralProfile = () => API.get("/referralpartner/profile");
// export const getMyReferrals = () => API.get("/referralpartner/my-referrals");
// export const getMyEarnings = () => API.get("/referralpartner/earnings");
// export const requestReferralSettlement = () => API.post("/referralpartner/settlement");
// export const updateReferralProfile = (data) =>
//   API.put("/referralpartner/profile", data);


 
// // export const getTeacherProfile = () => API.get("/profile");
// // export const updateTeacherProfile = (data) => API.put("/profile", data);

// // // ---------------- My Courses ----------------
// // export const getTeacherCourses = () => API.get("/my-courses");

// // // ---------------- Earnings ----------------
// // export const getTeacherEarnings = () => API.get("/earnings");

// // // ---------------- Reviews ----------------
// // export const getTeacherReviews = () => API.get("/teacher/reviews");

// // ===================== TEACHER APIs =====================
// export const getTeacherProfile = () => API.get("/teacher/profile");
// export const updateTeacherProfile = (data) => API.put("/teacher/profile", data);

// // My Courses
// export const getTeacherCourses = () => API.get("/teacher/my-courses");

// // Earnings
// export const getTeacherEarnings = () => API.get("/teacher/earnings");

// // Reviews
// export const getTeacherReviews = () => API.get("/teacher/reviews");

// // Create Course
// // src/api/api.js or wherever createCourse is
// // api.js
// export const createCourse = (data, file) => {
//   const formData = new FormData();

//   // Append all fields
//   formData.append("category", data.category);
//   formData.append("subCategory", data.subCategory);
//   formData.append("title", data.title);
//   formData.append("description", data.description);
//   formData.append("duration", data.duration);
//   formData.append("targetAudience", data.targetAudience);
//   formData.append("prerequisites", data.prerequisites);

//   // Tags: convert array → comma string
//   if (Array.isArray(data.tags)) {
//     formData.append("tags", data.tags.join(","));
//   } else if (typeof data.tags === "string") {
//     formData.append("tags", data.tags);
//   }

//   // Append file if present
//   if (file) {
//     formData.append("file", file); // 👈 multer .single("file")
//   }

//   return API.post("/teacher", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });
// };

 


// // contact APIs
// export const createContactApi = (formData) => API.post("/contacts", formData);

// // GET: all contacts (for admin dashboard)
// export const getContactsApi = () => API.get("/contacts"); 



import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const API = axios.create({
  baseURL,
  // Do NOT set a global Content-Type header — let browser/axios set it per-request.
  // headers: { "Content-Type": "application/json" },  <-- remove this
  withCredentials: false,
});

// Attach token automatically if present in localStorage
API.interceptors.request.use((req) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers = req.headers || {};
      req.headers.Authorization = `Bearer ${token}`;
    }
    // If the request has a body and is plain JSON, ensure header is set here:
    // (this avoids forcing header for FormData)
    if (req.data && !(req.data instanceof FormData)) {
      req.headers = req.headers || {};
      // Only set if not already set by caller
      if (!req.headers["Content-Type"] && !req.headers["content-type"]) {
        req.headers["Content-Type"] = "application/json";
      }
    }
  } catch (error) { /* ignore gracefully */ }
  return req;
});

// ---------- Auth ----------
export const signup = (userData) => {
  // ensure roles always an array
  if (userData.role && !userData.roles) userData.roles = [userData.role];
  return API.post("/auth/signup", userData);
};

export const login = (credentials) => API.post("/auth/login", credentials);

// OTP
export const sendOtp = (userEmail) => API.post("/auth/otp/send", userEmail);
export const verifyOtp = (data) => API.post("/auth/otp/verify", data);

// ---------- Coupons ----------
export const createCoupon = (couponData) => API.post("/coupons", couponData);
export const getCoupons = () => API.get("/coupons");
export const getCouponById = (id) => API.get(`/coupons/${id}`);
export const updateCoupon = (id, updatedData) => API.put(`/coupons/${id}`, updatedData);
export const deleteCoupon = (id) => API.delete(`/coupons/${id}`);

// ---------- Superadmin / Users ----------
export const createManager = (data) => API.post("/superadmin/create-manager", data);
export const getUsersByRole = (role, { page = 1, limit = 20, q = "" } = {}) =>
  API.get(`/superadmin/users/${role}`, { params: { page, limit, q } });
export const approveUser = (id, status, note = "") => API.patch(`/superadmin/approve/user/${id}`, { status, note });
export const approveCourse = (id, status, note = "") => API.patch(`/superadmin/approve/course/${id}`, { status, note });
export const approveUniversity = (id, status, note = "") => API.patch(`/superadmin/approve/university/${id}`, { status, note });
export const deleteUser = (id) => API.delete(`/superadmin/delete-user/${id}`);
export const updateSubRole = (id, subAdminRole) => API.put(`/superadmin/${id}/role`, { subAdminRole });

// ---------- Users ----------
export const getAllUsers = () => API.get("/users");
export const getStudents = () => API.get("/users/students");
export const getTeachers = () => API.get("/users/teachers");
export const getUniversity = () => API.get("/users/university");
export const getReferral = () => API.get("/users/referral");
export const getPartners = () => API.get("/users/partners");
export const getSubAdmins = () => API.get("/users/subadmin");
export const updateUserStatus = (userId, status) => API.put("/users", { userId, status });
export const approveUserStatus = (userId, status) => API.put("/users/approve", { userId, status });
export const updateSubRoles = (id, data) => API.put(`/users/subrole/${id}`, data);
export const addUser = (data) => API.post("/users/add", data);
export const deleteUsers = (id) => API.delete(`/users/${id}`);

// ---------- Courses ----------
export const getCourses = () => API.get("/courses/getCourses");
export const getApproveCourses = () => API.get("/courses/getApproveCourses");
export const approveCourses = (courseId, action) => API.patch(`/courses/${courseId}/approve`, { action });
export const addModule = (courseId, data) => API.post(`/courses/${courseId}/module`, data);

// For file uploads (videos/notes) don't set Content-Type manually — let the browser handle boundary
export const addVideo = (courseId, moduleId, formData) =>
  API.post(`/courses/${courseId}/module/${moduleId}/video`, formData);

export const addNotes = (courseId, moduleId, formData) =>
  API.post(`/courses/${courseId}/module/${moduleId}/notes`, formData);

export const addMcqs = (courseId, moduleId, mcqs) => API.post(`/courses/${courseId}/module/${moduleId}/mcqs`, { mcqs });
export const submitExam = (courseId, data) => API.post(`/courses/${courseId}/exam`, data);
export const deleteCourse = (courseId) => API.delete(`/courses/${courseId}`);

// ---------- Blogs ----------
export const createBlog = (data) => API.post("/blogs", data);
export const getBlogs = () => API.get("/blogs");
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

// ---------- Certificates ----------
export const updateCertificateTemplate = (templateId, data) => API.put(`/certificates/templates/${templateId}`, data);
export const issueCertificate = (data) => API.post("/certificates/issue", data);
export const approveCertificate = (certificateId) => API.patch(`/certificates/approve/${certificateId}`);
export const rejectCertificate = (certificateId) => API.patch(`/certificates/reject/${certificateId}`);
export const getCertificates = () => API.get("/certificates/my");
export const downloadCertificate = (certificateId) =>
  API.get(`/certificates/download/${certificateId}`, { responseType: "blob" });
export const validateCertificate = (uniqueId) => API.get(`/certificates/validate/${uniqueId}`);
export const getCertificateTemplateById = (templateId) => API.get(`/certificates/templates/${templateId}`);
export const getPendingCertificates = () => API.get("/certificates/pending");
export const getDefaultTemplate = () => API.get("/certificates/default");

// ---------- Student ----------
export const getStudentProfile = () => API.get("/student/profile");
export const updateStudentProfile = (data) => API.put("/student/profile", data);
export const getAvailableCourses = () => API.get("/student/courses");
export const enrollInCourse = (courseId) => API.post("/student/enroll", { courseId });
export const getMyCourses = () => API.get("/student/my-courses");
export const submitReview = (data) => API.post("/student/review", data);

// ---------- Wallet & Finance ----------
export const teacherRequestSettlement = (data) => API.post("/wallet/teacher/request", data);
export const universityRequestSettlement = (data) => API.post("/wallet/university/request", data);
export const universityApproveSettlement = (data) => API.post("/wallet/university/approve", data);
export const referralRequestSettlement = (data) => API.post("/wallet/referral/request", data);
export const financeApproveSettlement = (data) => API.post("/wallet/finance/approve", data);
export const financeRejectSettlement = (data) => API.post("/wallet/finance/reject", data);

export const getWallet = (ownerType, ownerId) => API.get(`/wallet/${ownerType}/${ownerId}`);

export const universityRejectSettlement = (data) => API.post("/wallet/university/reject", data);

export const creditWallet = (data) => API.post("/finance/credit", data);
export const debitWallet = (data) => API.post("/finance/debit", data);
export const getPendingSettlements = () => API.get("/finance/pending-settlements");

// ---------- Career Cell ----------
export const addJob = (data) => API.post("/careercell/job", data);
export const getJobs = () => API.get("/careercell/jobs");
export const getJobsByMode = (mode) => API.get(`/careercell/jobs/mode/${mode}`);
export const addWebinar = (data) => API.post("/careercell/webinar", data);
export const getWebinars = () => API.get("/careercell/webinars");
export const addGuide = (data) => API.post("/careercell/guide", data);
export const getGuides = () => API.get("/careercell/guides");
export const deletejobbyId = (id) => API.delete(`/careercell/job/${id}`);
export const deleteguidebyId = (id) => API.delete(`/careercell/guide/${id}`);
export const deletewebinarbyId = (id) => API.delete(`/careercell/webinar/${id}`);

// ---------- MoU ----------
export const uploadMouFile = (formData) => API.post("/mou/upload", formData);
export const downloadMouFile = (id) => API.get(`/mou/${id}/download`, { responseType: "blob" });
export const approveMou = (id, data) => API.post(`/mou/${id}/approve`, data);
export const rejectMou = (id, data) => API.post(`/mou/${id}/reject`, data);
export const getMous = () => API.get("/mou");

// ---------- Reports ----------
export const createReport = (data) => API.post("/report", data);
export const getReports = () => API.get("/report");
export const downloadReport = (id) => API.get(`/report/${id}/download`, { responseType: "blob" });
export const deleteReport = (id) => API.delete(`/report/${id}`);

// ---------- University ----------
export const getUniversityAnalytics = () => API.get("/university/analytics");
export const exportAnalyticsPDF = () => API.get("/university/analytics/export/pdf", { responseType: "blob" });
export const exportAnalyticsExcel = () => API.get("/university/analytics/export/excel", { responseType: "blob" });
export const getAffiliatedTeachers = async () => {
  try {
    const { data } = await API.get("/university/affiliatedTeachers");
    return data;
  } catch (error) {
    console.error("Error fetching affiliated teachers:", error);
    throw error.response?.data || { message: "Server error" };
  }
};
export const getUniversityEarnings = (universityId) =>
  API.get(`/university/earnings/${universityId}`);

// ---------- Teacher ----------
export const getTeacherSettlementRequests = () => API.get("/university/teacher-requests");
export const getReferralProfile = () => API.get("/referralpartner/profile");
export const getMyReferrals = () => API.get("/referralpartner/my-referrals");
export const getMyEarnings = () => API.get("/referralpartner/earnings");
export const requestReferralSettlement = () => API.post("/referralpartner/settlement");
export const updateReferralProfile = (data) => API.put("/referralpartner/profile", data);

export const getTeacherProfile = () => API.get("/teacher/profile");
export const updateTeacherProfile = (data) => API.put("/teacher/profile", data);
export const getTeacherCourses = () => API.get("/teacher/my-courses");
export const getTeacherEarnings = () => API.get("/teacher/earnings");
export const getTeacherReviews = () => API.get("/teacher/reviews");

// ---------- Create Course (with file) ----------
export const createCourse = (data, file) => {
  const formData = new FormData();
  // Append fields
  Object.entries(data).forEach(([k, v]) => {
    if (Array.isArray(v)) formData.append(k, v.join(","));
    else if (v !== undefined && v !== null) formData.append(k, v);
  });
  // Append file if present
  if (file) formData.append("file", file);
  return API.post("/teacher", formData);
};

// ---------- Contact ----------
export const createContactApi = (formData) => API.post("/contacts", formData);
export const getContactsApi = () => API.get("/contacts");

export default API;
