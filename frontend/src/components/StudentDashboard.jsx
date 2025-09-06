 // src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";

import { User, BookOpen, ClipboardList, Star } from "lucide-react";
import {
  getStudentProfile,
  updateStudentProfile,
  getAvailableCourses,
  enrollInCourse,
  getMyCourses,
  submitReview
} from "../api/api"; // ✅ corrected path
import StudentCertificate from "../pages/StudentCertificate";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [reviewCourse, setReviewCourse] = useState("");
  const [reviewText, setReviewText] = useState("");

  // ---------------- Profile ----------------
  const fetchProfile = async () => {
    try {
      const { data } = await getStudentProfile();
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async () => {
    try {
      await updateStudentProfile(profile);
      fetchProfile();
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  // ---------------- Courses ----------------
  const fetchAvailableCourses = async () => {
    try {
      const { data } = await getAvailableCourses();
      setAvailableCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const fetchMyCourses = async () => {
    try {
      const { data } = await getMyCourses();
      setMyCourses(data);
    } catch (err) {
      console.error("Failed to fetch my courses", err);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollInCourse(courseId);
      fetchMyCourses();
    } catch (err) {
      console.error("Enrollment failed", err);
    }
  };

  // ---------------- Reviews ----------------
  const handleReviewSubmit = async () => {
    if (!reviewCourse || !reviewText) return;
    try {
      await submitReview({ courseId: reviewCourse, review: reviewText });
      setReviewCourse("");
      setReviewText("");
    } catch (err) {
      console.error("Review submit failed", err);
    }
  };

  // ---------------- Effects ----------------
  useEffect(() => {
    if (activeTab === "profile") fetchProfile();
    if (activeTab === "courses") fetchAvailableCourses();
    if (activeTab === "mycourses") fetchMyCourses();
  }, [activeTab]);

  // ---------------- Render ----------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        {[
          { key: "profile", label: "Profile", icon: <User size={18} /> },
          { key: "courses", label: "Available Courses", icon: <BookOpen size={18} /> },
          { key: "mycourses", label: "My Courses", icon: <ClipboardList size={18} /> },
          { key: "reviews", label: "Reviews", icon: <Star size={18} /> },
          { key: "certificates", label: "Certificates", icon: <ClipboardList size={18} /> }, // ✅ new tab
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 ${
              activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white shadow rounded-xl p-6 space-y-3">
          <h2 className="font-semibold mb-4">My Profile</h2>
          <input
            type="text"
            name="name"
            value={profile.name}
            placeholder="Full Name"
            onChange={handleProfileChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={profile.email}
            placeholder="Email"
            onChange={handleProfileChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            value={profile.phone}
            placeholder="Phone"
            onChange={handleProfileChange}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={handleProfileSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Profile
          </button>
        </div>
      )}

      {/* Available Courses */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Available Courses</h2>
          {availableCourses.map((c) => (
            <div
              key={c._id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{c.title}</h3>
                <p>{c.description}</p>
                <p className="text-sm text-gray-600">Duration: {c.duration}</p>
              </div>
              <button
                onClick={() => handleEnroll(c._id)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Enroll
              </button>
            </div>
          ))}
        </div>
      )}

      {/* My Courses */}
      {activeTab === "mycourses" && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">My Courses</h2>
          {myCourses.map((c) => (
            <div key={c._id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{c.title}</h3>
              <p>{c.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reviews */}
      {activeTab === "reviews" && (
        <div className="bg-white shadow rounded-xl p-6 space-y-3">
          <h2 className="font-semibold">Leave a Review</h2>
          <select
            value={reviewCourse}
            onChange={(e) => setReviewCourse(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select a course</option>
            {myCourses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            className="w-full border p-2 rounded"
            rows="4"
          />
          <button
            onClick={handleReviewSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* Certificates */}
      {activeTab === "certificates" && (
        <div className="bg-red-500">
          <StudentCertificate />
        </div>
          )}
    </div>
  );
}
