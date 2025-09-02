// // // import React, { useState, useEffect } from "react";
// // // import { approveUserStatus, updateUniversityCode } from "../../api/api";
// // // import axios from "axios";

// // // export default function UploadUniversityDoc() {
// // //   const [university, setUniversity] = useState(null);
// // //   const [code, setCode] = useState(""); // ✅ for university code input
// // //   const [documents, setDocuments] = useState([
// // //     { label: "doc 1", key: "doc 1", file: null },
// // //     { label: "doc 2", key: "doc 2", file: null },
// // //     { label: "doc 3", key: "doc 3", file: null },
// // //     { label: "doc 4", key: "doc 4", file: null },
// // //   ]);

// // //   // ✅ Load university data from localStorage after login
// // //   useEffect(() => {
// // //     const storedUser = localStorage.getItem("user");
// // //     if (storedUser) {
// // //       const parsed = JSON.parse(storedUser);
// // //       setUniversity(parsed);
// // //       setCode(parsed.universityCode || ""); // preload existing code if any
// // //     }
// // //   }, []);

// // //   // Handle file choose
// // //   const handleFileChange = (index, file) => {
// // //     const updated = [...documents];
// // //     updated[index].file = file;
// // //     setDocuments(updated);
// // //   };

// // //   // Handle file upload (single)
// // //   const handleUpload = async (index) => {
// // //     if (!documents[index].file) return alert("Choose a file first!");
// // //     try {
// // //       const formData = new FormData();
// // //       formData.append("file", documents[index].file);
// // //       formData.append("docType", documents[index].key);

// // //       await axios.post("http://localhost:5000/api/university/upload", formData, {
// // //         headers: { 
// // //           "Content-Type": "multipart/form-data",
// // //           Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ pass token
// // //         },
// // //       });

// // //       alert(`${documents[index].label} uploaded successfully`);
// // //     } catch (err) {
// // //       console.error("Upload failed", err);
// // //       alert("Upload failed");
// // //     }
// // //   };

// // //   // ✅ Update University Code
// // //   const handleCodeUpdate = async () => {
// // //     if (!code) return alert("Enter a university code first!");
// // //     try {
// // //       const res = await updateUniversityCode(code);
// // //       alert(res.data.message); // "University code updated successfully"
// // //       setUniversity({ ...university, universityCode: res.data.universityCode });
// // //       // also update localStorage
// // //       localStorage.setItem(
// // //         "user",
// // //         JSON.stringify({ ...university, universityCode: res.data.universityCode })
// // //       );
// // //     } catch (err) {
// // //       alert(err.response?.data?.message || "Failed to update university code");
// // //     }
// // //   };

// // //   // Send for verification
// // //   const handleSendForVerification = async () => {
// // //     try {
// // //       await approveUserStatus(university.id, "Pending"); 
// // //       alert("Sent for verification!");
// // //     } catch (err) {
// // //       console.error("Verification failed", err);
// // //       alert("Verification failed");
// // //     }
// // //   };

// // //   if (!university) return <p>Loading...</p>;

// // //   return (
// // //     <div className="dashboard">
// // //       <h2>Status: {university.status || "Not submitted"}</h2>

// // //       <div className="university-info">
// // //         <p><b>Name:</b> {university.fullName}</p>
// // //         <p><b>Email:</b> {university.email}</p>
// // //         <p><b>Phone:</b> {university.phone}</p>
// // //         <p><b>Code:</b> {university.universityCode || "Not set"}</p>
// // //       </div>

// // //       {/* ✅ University Code Update Section */}
// // //       <div className="university-code">
// // //         <input
// // //           type="text"
// // //           placeholder="Enter university code"
// // //           value={code}
// // //           onChange={(e) => setCode(e.target.value)}
// // //         />
// // //         <button onClick={handleCodeUpdate}>Save Code</button>
// // //       </div>

// // //       <div className="documents">
// // //         {documents.map((doc, index) => (
// // //           <div key={doc.key} className="document-row">
// // //             <span><b>{doc.label}</b> (.jpg/.jpeg/.png/.pdf)</span>
// // //             <input 
// // //               type="file" 
// // //               accept=".jpg,.jpeg,.png,.pdf"
// // //               onChange={(e) => handleFileChange(index, e.target.files[0])}
// // //             />
// // //             <button onClick={() => handleUpload(index)}>Upload</button>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       <button onClick={handleSendForVerification} className="submit-btn">
// // //         Send for Verification
// // //       </button>
// // //     </div>
// // //   );
// // // }



// // import React, { useState, useEffect } from "react";
// // import {
// //   approveUserStatus,
// //   updateUniversityCode,
// //   uploadUniversityDocument,
// //   getMyDocuments,
// // } from "../../api/api";

// // export default function UploadUniversityDoc() {
// //   const [university, setUniversity] = useState(null);
// //   const [code, setCode] = useState(""); // university code input
// //   const [documents, setDocuments] = useState([
// //     { label: "Document 1", key: "Accreditation", file: null, status: "Pending" },
// //     { label: "Document 2", key: "License", file: null, status: "Pending" },
// //     { label: "Document 3", key: "Certificate", file: null, status: "Pending" },
// //     { label: "Document 4", key: "Other", file: null, status: "Pending" },
// //   ]);

// //   // Load university data from localStorage after login
// //   useEffect(() => {
// //     const storedUser = localStorage.getItem("user");
// //     if (storedUser) {
// //       const parsed = JSON.parse(storedUser);
// //       setUniversity(parsed);
// //       setCode(parsed.universityCode || "");
// //     }
// //     fetchDocuments(); // fetch existing docs on mount
// //   }, []);

// //   // Fetch documents from backend
// //   const fetchDocuments = async () => {
// //     try {
// //       const { data } = await getMyDocuments();
// //       // Merge fetched status into documents array
// //       setDocuments((prev) =>
// //         prev.map((doc) => {
// //           const fetched = data.find((d) => d.docType === doc.key);
// //           return fetched ? { ...doc, status: fetched.status } : doc;
// //         })
// //       );
// //     } catch (err) {
// //       console.error("Error fetching documents:", err);
// //     }
// //   };

// //   // Handle file choose
// //   const handleFileChange = (index, file) => {
// //     const updated = [...documents];
// //     updated[index].file = file;
// //     setDocuments(updated);
// //   };

// //   // Handle file upload (single)
// //   const handleUpload = async (index) => {
// //     if (!documents[index].file) return alert("Choose a file first!");
// //     try {
// //       await uploadUniversityDocument(documents[index].file, documents[index].key);
// //       alert(`${documents[index].label} uploaded successfully`);
// //       fetchDocuments(); // refresh document statuses
// //     } catch (err) {
// //       console.error("Upload failed", err);
// //       alert("Upload failed");
// //     }
// //   };

// //   // Update University Code
// //   const handleCodeUpdate = async () => {
// //     if (!code) return alert("Enter a university code first!");
// //     try {
// //       const res = await updateUniversityCode(code);
// //       alert(res.data.message);
// //       setUniversity({ ...university, universityCode: res.data.universityCode });
// //       localStorage.setItem(
// //         "user",
// //         JSON.stringify({ ...university, universityCode: res.data.universityCode })
// //       );
// //     } catch (err) {
// //       alert(err.response?.data?.message || "Failed to update university code");
// //     }
// //   };

// //   // Send for verification
// //   const handleSendForVerification = async () => {
// //     try {
// //       await approveUserStatus(university.id, "Pending");
// //       alert("Sent for verification!");
// //     } catch (err) {
// //       console.error("Verification failed", err);
// //       alert("Verification failed");
// //     }
// //   };

// //   if (!university) return <p>Loading...</p>;

// //   return (
// //     <div className="dashboard">
// //       <h2>Status: {university.status || "Not submitted"}</h2>

// //       <div className="university-info">
// //         <p><b>Name:</b> {university.fullName}</p>
// //         <p><b>Email:</b> {university.email}</p>
// //         <p><b>Phone:</b> {university.phone}</p>
// //         <p><b>Code:</b> {university.universityCode || "Not set"}</p>
// //       </div>

// //       {/* University Code Update */}
// //       <div className="university-code">
// //         <input
// //           type="text"
// //           placeholder="Enter university code"
// //           value={code}
// //           onChange={(e) => setCode(e.target.value)}
// //         />
// //         <button onClick={handleCodeUpdate}>Save Code</button>
// //       </div>

// //       {/* Document Uploads */}
// //       <div className="documents">
// //         {documents.map((doc, index) => (
// //           <div key={doc.key} className="document-row">
// //             <span>
// //               <b>{doc.label}</b> (.jpg/.jpeg/.png/.pdf) — Status: {doc.status}
// //             </span>
// //             <input
// //               type="file"
// //               accept=".jpg,.jpeg,.png,.pdf"
// //               onChange={(e) => handleFileChange(index, e.target.files[0])}
// //             />
// //             <button onClick={() => handleUpload(index)}>Upload</button>
// //           </div>
// //         ))}
// //       </div>

// //       <button onClick={handleSendForVerification} className="submit-btn">
// //         Send for Verification
// //       </button>
// //     </div>
// //   );
// // }


// import React, { useState, useEffect } from "react";
// import {
//   approveUserStatus,
//   updateUniversityCode,
//   uploadUniversityDocument,
//   getMyDocuments,
// } from "../../api/api";

// export default function UploadUniversityDoc() {
//   const [university, setUniversity] = useState(null);
//   const [code, setCode] = useState("");
//   const [documents, setDocuments] = useState([
//     { label: "Document 1", key: "Accreditation", file: null, status: "Pending" },
//     { label: "Document 2", key: "License", file: null, status: "Pending" },
//     { label: "Document 3", key: "Certificate", file: null, status: "Pending" },
//     { label: "Document 4", key: "Other", file: null, status: "Pending" },
//   ]);

//   // Load university data
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const parsed = JSON.parse(storedUser);
//       setUniversity(parsed);
//       setCode(parsed.universityCode || "");
//     }
//     fetchDocuments();
//   }, []);

//   const fetchDocuments = async () => {
//     try {
//       const { data } = await getMyDocuments();
//       setDocuments((prev) =>
//         prev.map((doc) => {
//           const fetched = data.find((d) => d.docType === doc.key);
//           return fetched ? { ...doc, status: fetched.status } : doc;
//         })
//       );
//     } catch (err) {
//       console.error("Error fetching documents:", err);
//     }
//   };

//   const handleFileChange = (index, file) => {
//     const updated = [...documents];
//     updated[index].file = file;
//     setDocuments(updated);
//   };

//   const handleUpload = async (index) => {
//     if (!documents[index].file) return alert("Choose a file first!");
//     try {
//       await uploadUniversityDocument(documents[index].file, documents[index].key);
//       alert(`${documents[index].label} uploaded successfully`);
//       fetchDocuments();
//     } catch (err) {
//       console.error("Upload failed", err);
//       alert("Upload failed");
//     }
//   };

//   const handleCodeUpdate = async () => {
//     if (!code) return alert("Enter a university code first!");
//     try {
//       const res = await updateUniversityCode(code);
//       alert(res.data.message);
//       setUniversity({ ...university, universityCode: res.data.universityCode });
//       localStorage.setItem(
//         "user",
//         JSON.stringify({ ...university, universityCode: res.data.universityCode })
//       );
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update university code");
//     }
//   };

//   const handleSendForVerification = async () => {
//     try {
//       await approveUserStatus(university.id, "Sent for verification!");
//       alert("Sent for verification!");
//     } catch (err) {
//       console.error("Verification failed", err);
//       alert("Verification failed");
//     }
//   };

//   if (!university) return <p>Loading...</p>;

//   return (
//     <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
//       {/* University Info Card */}
//       <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
//         <h2 className="text-xl font-bold mb-4">University Info</h2>
//         <p><b>Name:</b> {university.fullName}</p>
//         <p><b>Email:</b> {university.email}</p>
//         <p><b>Phone:</b> {university.phone}</p>
//         <p><b>Code:</b> {university.universityCode || "Not set"}</p>
//       </div>

//       {/* University Code Card */}
//       <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 flex items-center space-x-4">
//         <input
//           type="text"
//           placeholder="Enter university code"
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handleCodeUpdate}
//           className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           Save Code
//         </button>
//       </div>

//       {/* Document Upload Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {documents.map((doc, index) => (
//           <div
//             key={doc.key}
//             className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col space-y-3"
//           >
//             <div className="flex justify-between items-center">
//               <span className="font-semibold">{doc.label}</span>
//               <span
//                 className={`px-2 py-1 rounded-full text-sm font-medium ${
//                   doc.status === "Approved"
//                     ? "bg-green-200 text-green-800"
//                     : doc.status === "Reupload"
//                     ? "bg-yellow-200 text-yellow-800"
//                     :  doc.status === "Rejected"
//                     ? "bg-red-200 text-red-800" 
//                     : "bg-gray-200 text-gray-800"
//                 }`}
//               >
//                 {doc.status}
//               </span>
//             </div>
//             <input
//               type="file"
//               accept=".jpg,.jpeg,.png,.pdf"
//               onChange={(e) => handleFileChange(index, e.target.files[0])}
//               className="p-2 border rounded-lg"
//             />
//             <button
//               onClick={() => handleUpload(index)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//             >
//               Upload
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Send for Verification */}
//       <div className="flex justify-end">
//         <button
//           onClick={handleSendForVerification}
//           className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
//         >
//           Send for Verification
//         </button>
//       </div>
//     </div>
//   );
// }
