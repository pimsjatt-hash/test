// import React, { useState, useEffect } from "react";
// import { Upload, BookOpen, User, Wallet, Star, PlusCircle } from "lucide-react";

// export default function TeacherDashboard() {
//   const [activeTab, setActiveTab] = useState("profile");

//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     bank: "",
//     upi: "",
//     photo: null,
//   });

//   const [course, setCourse] = useState({
//     category: "",
//     subCategory: "",
//     title: "",
//     description: "",
//     duration: "",
//     thumbnail: null,
//   });

//   const [courses, setCourses] = useState([]);
//   const [moduleTitle, setModuleTitle] = useState("");

//   // ---------------- Profile Handlers ----------------
//   const handleProfileChange = (e) => {
//     const { name, value, files } = e.target;
//     setProfile((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleProfileSubmit = async () => {
//     const formData = new FormData();
//     Object.entries(profile).forEach(([k, v]) => {
//       if (v) formData.append(k, v);
//     });

//     const res = await fetch("/api/teacher/profile", {
//       method: "PUT",
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       body: formData,
//     });
//     const data = await res.json();
//     console.log("Profile updated:", data);
//   };

//   // ---------------- Course Handlers ----------------
//   const handleCourseChange = (e) => {
//     const { name, value, files } = e.target;
//     setCourse((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleCourseSubmit = async () => {
//     const formData = new FormData();
//     Object.entries(course).forEach(([k, v]) => {
//       if (v) formData.append(k, v);
//     });

//     const res = await fetch("/api/courses", {
//       method: "POST",
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       body: formData,
//     });
//     const data = await res.json();
//     console.log("Course created:", data);
//     fetchCourses();
//   };

//   const fetchCourses = async () => {
//     const res = await fetch("/api/teacher/my-courses", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     });
//     const data = await res.json();
//     setCourses(data);
//   };

//   useEffect(() => {
//     if (activeTab === "courses") {
//       fetchCourses();
//     }
//   }, [activeTab]);

//   // ---------------- Module Handlers ----------------
//   const handleAddModule = async (courseId) => {
//     const res = await fetch(`/api/courses/${courseId}/module`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({ title: moduleTitle }),
//     });
//     const data = await res.json();
//     console.log("Module added:", data);
//     fetchCourses();
//     setModuleTitle("");
//   };

//   const handleUploadVideo = async (courseId, moduleId, file) => {
//     const formData = new FormData();
//     formData.append("video", file);
//     formData.append("title", file.name);
//     formData.append("order", 1);

//     const res = await fetch(`/api/courses/${courseId}/module/${moduleId}/video`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       body: formData,
//     });
//     const data = await res.json();
//     console.log("Video uploaded:", data);
//     fetchCourses();
//   };

//   const handleUploadNotes = async (courseId, moduleId, file) => {
//     const formData = new FormData();
//     formData.append("notes", file);

//     const res = await fetch(`/api/courses/${courseId}/module/${moduleId}/notes`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       body: formData,
//     });
//     const data = await res.json();
//     console.log("Notes uploaded:", data);
//     fetchCourses();
//   };

//   const handleAddMcqs = async (courseId, moduleId) => {
//     const mcqs = [
//       {
//         question: "Sample Question?",
//         options: ["A", "B", "C", "D"],
//         correctAnswer: "A",
//       },
//     ];

//     const res = await fetch(`/api/courses/${courseId}/module/${moduleId}/mcqs`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({ mcqs }),
//     });
//     const data = await res.json();
//     console.log("MCQs added:", data);
//     fetchCourses();
//   };

//   // ---------------- Render ----------------
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

//       {/* Tabs */}
//       <div className="flex gap-4 border-b mb-6">
//         {["profile", "courses", "wallet", "feedback"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`flex items-center gap-2 px-4 py-2 ${
//               activeTab === tab
//                 ? "border-b-2 border-blue-600 text-blue-600"
//                 : "text-gray-600"
//             }`}
//           >
//             {tab === "profile" && <User size={18} />}
//             {tab === "courses" && <BookOpen size={18} />}
//             {tab === "wallet" && <Wallet size={18} />}
//             {tab === "feedback" && <Star size={18} />}
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Profile Tab */}
//       {activeTab === "profile" && (
//         <div className="bg-white shadow rounded-xl p-6">
//           <h2 className="font-semibold mb-4">Profile Setup</h2>
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             className="w-full border p-2 rounded mb-3"
//             onChange={handleProfileChange}
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             className="w-full border p-2 rounded mb-3"
//             onChange={handleProfileChange}
//           />
//           <input
//             type="text"
//             name="bank"
//             placeholder="Bank Account"
//             className="w-full border p-2 rounded mb-3"
//             onChange={handleProfileChange}
//           />
//           <input
//             type="text"
//             name="upi"
//             placeholder="UPI ID"
//             className="w-full border p-2 rounded mb-3"
//             onChange={handleProfileChange}
//           />
//           <input
//             type="file"
//             name="photo"
//             className="w-full border p-2 rounded mb-4"
//             onChange={handleProfileChange}
//           />
//           <button
//             onClick={handleProfileSubmit}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Save Profile
//           </button>
//         </div>
//       )}

//       {/* Courses Tab */}
//       {activeTab === "courses" && (
//         <div className="space-y-6">
//           {/* Upload New Course */}
//           <div className="bg-white shadow rounded-xl p-6">
//             <h2 className="font-semibold mb-4">Upload New Course</h2>
//             <input
//               type="text"
//               name="category"
//               placeholder="Category"
//               className="w-full border p-2 rounded mb-3"
//               onChange={handleCourseChange}
//             />
//             <input
//               type="text"
//               name="subCategory"
//               placeholder="Sub-Category"
//               className="w-full border p-2 rounded mb-3"
//               onChange={handleCourseChange}
//             />
//             <input
//               type="text"
//               name="title"
//               placeholder="Course Title"
//               className="w-full border p-2 rounded mb-3"
//               onChange={handleCourseChange}
//             />
//             <textarea
//               name="description"
//               placeholder="Description"
//               rows="4"
//               className="w-full border p-2 rounded mb-3"
//               onChange={handleCourseChange}
//             />
//             <input
//               type="text"
//               name="duration"
//               placeholder="Duration (e.g. 5h)"
//               className="w-full border p-2 rounded mb-3"
//               onChange={handleCourseChange}
//             />
//             <input
//               type="file"
//               name="thumbnail"
//               className="w-full border p-2 rounded mb-4"
//               onChange={handleCourseChange}
//             />
//             <button
//               onClick={handleCourseSubmit}
//               className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               <Upload size={18} /> Upload Course
//             </button>
//           </div>

//           {/* List My Courses */}
//           <div>
//             <h2 className="font-semibold mb-4">My Courses</h2>
//             {courses.length === 0 && <p>No courses found.</p>}
//             {courses.map((c) => (
//               <div key={c._id} className="bg-gray-50 border rounded-lg p-4 mb-4">
//                 <h3 className="font-semibold">{c.title}</h3>
//                 <p>{c.description}</p>
//                 <p className="text-sm text-gray-600">Duration: {c.duration}</p>

//                 {/* Add Module */}
//                 <div className="flex gap-2 mt-3">
//                   <input
//                     type="text"
//                     placeholder="Module Title"
//                     value={moduleTitle}
//                     onChange={(e) => setModuleTitle(e.target.value)}
//                     className="border p-2 rounded"
//                   />
//                   <button
//                     onClick={() => handleAddModule(c._id)}
//                     className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded"
//                   >
//                     <PlusCircle size={16} /> Add Module
//                   </button>
//                 </div>

//                 {/* List Modules */}
//                 {c.modules.map((m) => (
//                   <div key={m._id} className="mt-3 pl-3 border-l">
//                     <p className="font-semibold">📂 {m.title}</p>

//                     {/* Upload video */}
//                     <input
//                       type="file"
//                       onChange={(e) =>
//                         handleUploadVideo(c._id, m._id, e.target.files[0])
//                       }
//                       className="mt-2"
//                     />

//                     {/* Upload notes */}
//                     <input
//                       type="file"
//                       onChange={(e) =>
//                         handleUploadNotes(c._id, m._id, e.target.files[0])
//                       }
//                       className="mt-2"
//                     />

//                     {/* Add MCQ */}
//                     <button
//                       onClick={() => handleAddMcqs(c._id, m._id)}
//                       className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
//                     >
//                       Add Sample MCQ
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Wallet */}
//       {activeTab === "wallet" && (
//         <div className="bg-white shadow rounded-xl p-6">
//           <h2 className="font-semibold mb-4">Earnings & Settlements</h2>
//           <p className="text-gray-700">Your current balance: ₹0.00</p>
//           <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
//             Request Settlement
//           </button>
//         </div>
//       )}

//       {/* Feedback */}
//       {activeTab === "feedback" && (
//         <div className="bg-white shadow rounded-xl p-6">
//           <h2 className="font-semibold mb-4">Student Feedback</h2>
//           <p className="text-gray-500">No feedback available yet.</p>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  Upload,
  BookOpen,
  User,
  Wallet,
  Star,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateCourse from "./course management/CreateCourse";
import CourseList from "./course management/CourseList";
import ApproveCourse from "./course management/ApproveCourse";
import ManageModules from "./course management/ManageModules";
import SubmitExam from "./course management/SubmitExam";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bank: "",
    upi: "",
    photo: null,
  });

  const [course, setCourse] = useState({
    category: "",
    subCategory: "",
    title: "",
    description: "",
    duration: "",
    thumbnail: null,
  });

  const [courses, setCourses] = useState([]);
  const [moduleTitle, setModuleTitle] = useState("");

  // --- MCQ State ---
  const [mcqForm, setMcqForm] = useState({
    question: "",
    options: [""],
    correctAnswer: "",
  });
  const [pendingMcqs, setPendingMcqs] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  // ---------------- Profile Handlers ----------------
  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleProfileSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([k, v]) => {
        if (v) formData.append(k, v);
      });

      const res = await fetch("/api/teacher/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Server error updating profile");
    }
  };

  // ---------------- Course Handlers ----------------
  const handleCourseChange = (e) => {
    const { name, value, files } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCourseSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(course).forEach(([k, v]) => {
        if (v) formData.append(k, v);
      });

      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Course created successfully!");
        fetchCourses();
      } else {
        toast.error(data.message || "Failed to create course");
      }
    } catch (err) {
      toast.error("Server error creating course");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/teacher/my-courses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) setCourses(data);
      else toast.error(data.message || "Failed to fetch courses");
    } catch (err) {
      toast.error("Server error fetching courses");
    }
  };

  useEffect(() => {
    if (activeTab === "courses") {
      fetchCourses();
    }
  }, [activeTab]);

  // ---------------- Module Handlers ----------------
  const handleAddModule = async (courseId) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/module`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title: moduleTitle }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Module added!");
        fetchCourses();
        setModuleTitle("");
      } else {
        toast.error(data.message || "Failed to add module");
      }
    } catch (err) {
      toast.error("Server error adding module");
    }
  };

  const handleUploadVideo = async (courseId, moduleId, file) => {
    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", file.name);
      formData.append("order", 1);

      const res = await fetch(`/api/courses/${courseId}/module/${moduleId}/video`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Video uploaded!");
        fetchCourses();
      } else {
        toast.error(data.message || "Failed to upload video");
      }
    } catch (err) {
      toast.error("Server error uploading video");
    }
  };

  const handleUploadNotes = async (courseId, moduleId, file) => {
    try {
      const formData = new FormData();
      formData.append("notes", file);

      const res = await fetch(`/api/courses/${courseId}/module/${moduleId}/notes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Notes uploaded!");
        fetchCourses();
      } else {
        toast.error(data.message || "Failed to upload notes");
      }
    } catch (err) {
      toast.error("Server error uploading notes");
    }
  };

  // ---------------- MCQ Handlers ----------------
  const handleMcqChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === "options" && index !== null) {
      const newOptions = [...mcqForm.options];
      newOptions[index] = value;
      setMcqForm((prev) => ({ ...prev, options: newOptions }));
    } else {
      setMcqForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addOption = () => {
    setMcqForm((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index) => {
    const newOptions = mcqForm.options.filter((_, i) => i !== index);
    setMcqForm((prev) => ({ ...prev, options: newOptions }));
  };

  const addMcqToList = () => {
    if (!mcqForm.question || mcqForm.options.length < 2) {
      toast.error("Enter a question and at least 2 options");
      return;
    }
    setPendingMcqs((prev) => [...prev, mcqForm]);
    setMcqForm({ question: "", options: [""], correctAnswer: "" });
    toast.success("MCQ added to pending list!");
  };

  const handleSubmitMcqs = async (courseId, moduleId) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/module/${moduleId}/mcqs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ mcqs: pendingMcqs }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("MCQs submitted successfully!");
        fetchCourses();
        setPendingMcqs([]);
        setSelectedModule(null);
      } else {
        toast.error(data.message || "Failed to add MCQs");
      }
    } catch (err) {
      toast.error("Server error submitting MCQs");
    }
  };
    return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

      {/* Tabs */}
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex gap-4 border-b mb-6">
        {["profile", "courses", "wallet", "feedback"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab === "profile" && <User size={18} />}
            {tab === "courses" && <BookOpen size={18} />}
            {tab === "wallet" && <Wallet size={18} />}
            {tab === "feedback" && <Star size={18} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold mb-4">Profile Setup</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border p-2 rounded mb-3"
            onChange={handleProfileChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-2 rounded mb-3"
            onChange={handleProfileChange}
          />
          <input
            type="text"
            name="bank"
            placeholder="Bank Account"
            className="w-full border p-2 rounded mb-3"
            onChange={handleProfileChange}
          />
          <input
            type="text"
            name="upi"
            placeholder="UPI ID"
            className="w-full border p-2 rounded mb-3"
            onChange={handleProfileChange}
          />
          <input
            type="file"
            name="photo"
            className="w-full border p-2 rounded mb-4"
            onChange={handleProfileChange}
          />
          <button
            onClick={handleProfileSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Profile
          </button>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <div className="grid gap-6 p-6">
              <CreateCourse onCreated={() => window.location.reload()} />
              <CourseList />
              <ApproveCourse />
              <ManageModules courseId="<courseId_here>" />
              <SubmitExam courseId="<courseId_here>" />
            
            </div>
      )}

      {/* Wallet */}
      {activeTab === "wallet" && (
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold mb-4">Earnings & Settlements</h2>
          <p className="text-gray-700">Your current balance: ₹0.00</p>
          <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Request Settlement
          </button>
        </div>
      )}

      {/* Feedback */}
      {activeTab === "feedback" && (
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="font-semibold mb-4">Student Feedback</h2>
          <p className="text-gray-500">No feedback available yet.</p>
        </div>
      )}
    </div>
  );
}