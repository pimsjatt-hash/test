// // // import React, { useState } from "react";

// // // export default function Governance() {
// // //   // Sample MoU data
// // //   const [mouList, setMouList] = useState([
// // //     { id: 1, university: "XYZ University", docUrl: "/docs/mou-xyz.pdf", date: "2025-08-12", status: "Pending" },
// // //     { id: 2, university: "ABC Institute", docUrl: "/docs/mou-abc.pdf", date: "2025-08-05", status: "Approved" },
// // //     { id: 3, university: "LMN College", docUrl: "/docs/mou-lmn.pdf", date: "2025-08-01", status: "Rejected" },
// // //   ]);

// // //   // Selected tab: Pending | Approved | Rejected
// // //   const [tab, setTab] = useState("Pending");

// // //   // For viewing document in popup
// // //   const [viewDoc, setViewDoc] = useState(null);

// // //   // Approve or Reject function
// // //   const handleAction = (id, action) => {
// // //     setMouList(mouList.map((mou) =>
// // //       mou.id === id ? { ...mou, status: action } : mou
// // //     ));
// // //   };

// // //   // Filter list by tab
// // //   const filteredList = mouList.filter((mou) => mou.status === tab);

// // //   return (
// // //     <div className="w-full p-6">
// // //       {/* Tabs */}
// // //       <div className="flex gap-2 mb-4">
// // //         {["Pending", "Approved", "Rejected"].map((t) => (
// // //           <button
// // //             key={t}
// // //             onClick={() => setTab(t)}
// // //             className={`px-4 py-2 rounded ${
// // //               tab === t ? "bg-gray-900 text-white" : "bg-gray-100"
// // //             }`}
// // //           >
// // //             {t}
// // //           </button>
// // //         ))}
// // //       </div>

// // //       {/* Table */}
// // //       <table className="w-full border-collapse">
// // //         <thead>
// // //           <tr className="bg-gray-100 text-left">
// // //             <th className="p-3">University</th>
// // //             <th className="p-3">MoU Document</th>
// // //             <th className="p-3">Uploaded Date</th>
// // //             <th className="p-3">Status</th>
// // //             <th className="p-3">Actions</th>
// // //           </tr>
// // //         </thead>
// // //         <tbody>
// // //           {filteredList.length === 0 ? (
// // //             <tr>
// // //               <td colSpan={5} className="p-4 text-center text-gray-500">
// // //                 No {tab} MoUs
// // //               </td>
// // //             </tr>
// // //           ) : (
// // //             filteredList.map((mou) => (
// // //               <tr key={mou.id} className="border-b hover:bg-gray-50">
// // //                 <td className="p-3">{mou.university}</td>
// // //                 <td className="p-3">
// // //                   <button
// // //                     onClick={() => setViewDoc(mou)}
// // //                     className="text-blue-600 underline"
// // //                   >
// // //                     View
// // //                   </button>
// // //                 </td>
// // //                 <td className="p-3">{mou.date}</td>
// // //                 <td className="p-3">{mou.status}</td>
// // //                 <td className="p-3 space-x-2">
// // //                   {mou.status === "Pending" && (
// // //                     <>
// // //                       <button
// // //                         onClick={() => handleAction(mou.id, "Approved")}
// // //                         className="px-3 py-1 bg-green-500 text-white rounded"
// // //                       >
// // //                         Approve
// // //                       </button>
// // //                       <button
// // //                         onClick={() => handleAction(mou.id, "Rejected")}
// // //                         className="px-3 py-1 bg-red-500 text-white rounded"
// // //                       >
// // //                         Reject
// // //                       </button>
// // //                     </>
// // //                   )}
// // //                 </td>
// // //               </tr>
// // //             ))
// // //           )}
// // //         </tbody>
// // //       </table>

// // //       {/* Popup to view document */}
// // //       {viewDoc && (
// // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// // //           <div className="bg-white w-3/4 h-3/4 rounded-lg shadow-lg overflow-hidden">
// // //             <div className="flex justify-between items-center p-3 border-b">
// // //               <h3 className="font-bold">{viewDoc.university} - MoU</h3>
// // //               <button
// // //                 onClick={() => setViewDoc(null)}
// // //                 className="px-3 py-1 bg-gray-200 rounded"
// // //               >
// // //                 Close
// // //               </button>
// // //             </div>
// // //             <div className="p-3 h-full">
// // //               <iframe
// // //                 src={viewDoc.docUrl}
// // //                 title="MoU Document"
// // //                 className="w-full h-full rounded"
// // //               />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // import React, { useState, useEffect } from "react";
// // import {
// //   getUniversity,
// //   getUsers,
// //   updateUserStatus,
// // } from "../../api/api";

// // export default function Governance() {
// //   const [universities, setUniversities] = useState([]);
// //   const [tab, setTab] = useState("uploadDoc"); // filter by status if needed
// //   const [selectedUniversity, setSelectedUniversity] = useState(null);
// //   const [documents, setDocuments] = useState([]);

// //   // Fetch all universities
// //   useEffect(() => {
// //     const fetchUniversities = async () => {
// //       try {
// //         const res = await getUniversity(); // API returns all university users
// //         setUniversities(res.data);
// //       } catch (err) {
// //         console.error("Error fetching universities:", err);
// //       }
// //     };
// //     fetchUniversities();
// //   }, []);

// //   // Fetch documents of selected university
// //   const viewDocuments = async (univ) => {
// //     try {
// //       const res = await fetch(
// //         `http://localhost:5000/api/university-documents/by-university/${univ._id}`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );
// //       const data = await res.json();
// //       setDocuments(data.documents || []);
// //       setSelectedUniversity(univ);
// //     } catch (err) {
// //       console.error("Error fetching documents:", err);
// //       alert("Failed to load documents");
// //     }
// //   };

// //   // Change document status
// //   const changeDocStatus = async (docId, status) => {
// //     try {
// //       await fetch(
// //         `http://localhost:5000/api/university-documents/update-status/${docId}`,
// //         {
// //           method: "PUT",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //           body: JSON.stringify({ status }),
// //         }
// //       );
// //       // Update local state
// //       setDocuments((prev) =>
// //         prev.map((d) => (d._id === docId ? { ...d, status } : d))
// //       );
// //     } catch (err) {
// //       console.error("Error updating status:", err);
// //     }
// //   };

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4">Governance - Universities</h1>

// //       {/* University Table */}
// //       <table className="w-full border-collapse mb-6">
// //         <thead>
// //           <tr className="bg-gray-100 text-left">
// //             <th className="p-3">Name</th>
// //             <th className="p-3">Email</th>
// //             <th className="p-3">Phone</th>
// //             <th className="p-3">Status</th>
// //             <th className="p-3">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {universities.length === 0 ? (
// //             <tr>
// //               <td colSpan={5} className="p-4 text-center">
// //                 No universities found
// //               </td>
// //             </tr>
// //           ) : (
// //             universities.map((u) => (
// //               <tr key={u._id} className="border-b hover:bg-gray-50">
// //                 <td className="p-3">{u.fullName}</td>
// //                 <td className="p-3">{u.email}</td>
// //                 <td className="p-3">{u.phone}</td>
// //                 <td className="p-3">{u.status}</td>
// //                 <td className="p-3">
// //                   <button
// //                     onClick={() => viewDocuments(u)}
// //                     className="px-3 py-1 bg-blue-600 text-white rounded"
// //                   >
// //                     View Documents
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))
// //           )}
// //         </tbody>
// //       </table>

// //       {/* Document Popup */}
// //       {selectedUniversity && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// //           <div className="bg-white w-4/5 h-4/5 rounded-lg shadow-lg overflow-auto p-4">
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="font-bold text-xl">
// //                 {selectedUniversity.fullName} - Documents
// //               </h2>
// //               <button
// //                 onClick={() => setSelectedUniversity(null)}
// //                 className="px-3 py-1 bg-gray-300 rounded"
// //               >
// //                 Close
// //               </button>
// //             </div>

// //             {documents.length === 0 ? (
// //               <p>No documents uploaded yet.</p>
// //             ) : (
// //               <table className="w-full border-collapse">
// //                 <thead>
// //                   <tr className="bg-gray-100 text-left">
// //                     <th className="p-2">Document</th>
// //                     <th className="p-2">Type</th>
// //                     <th className="p-2">Status</th>
// //                     <th className="p-2">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {documents.map((doc) => (
// //                     <tr key={doc._id} className="border-b hover:bg-gray-50">
// //                       <td className="p-2">
// //                         <a
// //                           href={doc.fileUrl}
// //                           target="_blank"
// //                           rel="noopener noreferrer"
// //                           className="text-blue-600 underline"
// //                         >
// //                           View File
// //                         </a>
// //                       </td>
// //                       <td className="p-2">{doc.docType}</td>
// //                       <td className="p-2">{doc.status}</td>
// //                       <td className="p-2 space-x-2">
// //                         {doc.status !== "Approved" && (
// //                           <button
// //                             onClick={() => changeDocStatus(doc._id, "Approved")}
// //                             className="px-2 py-1 bg-green-500 text-white rounded"
// //                           >
// //                             Approve
// //                           </button>
// //                         )}
// //                         {doc.status !== "Rejected" && (
// //                           <button
// //                             onClick={() => changeDocStatus(doc._id, "Rejected")}
// //                             className="px-2 py-1 bg-red-500 text-white rounded"
// //                           >
// //                             Reject
// //                           </button>
// //                         )}
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// import React, { useState, useEffect } from "react";
// import { getUniversity } from "../../api/api";
// import { getDocumentsByUniversity, updateDocumentStatus } from "../../api/api";

// export default function Governance() {
//   const [universities, setUniversities] = useState([]);
//   const [selectedUniversity, setSelectedUniversity] = useState(null);
//   const [documents, setDocuments] = useState([]);
//   const [viewDoc, setViewDoc] = useState(null);

//   // Tabs for filtering universities by status (optional)
//   const [tab, setTab] = useState("All");

//   // Fetch all universities
//   useEffect(() => {
//     const fetchUniversities = async () => {
//       try {
//         const { data } = await getUniversity();
//         setUniversities(data);
//       } catch (err) {
//         console.error("Error fetching universities:", err);
//       }
//     };
//     fetchUniversities();
//   }, []);

//   // Fetch documents for a university when clicked
//   const handleViewDocuments = async (university) => {
//     setSelectedUniversity(university);
//     try {
//       const { data } = await getDocumentsByUniversity(university._id);
//       setDocuments(data);
//     } catch (err) {
//       console.error("Error fetching documents:", err);
//       alert("Failed to fetch documents");
//     }
//   };

//   // Update document status
//   const handleStatusUpdate = async (docId, status) => {
//     try {
//       await updateDocumentStatus(docId, status);
//       setDocuments((prev) =>
//         prev.map((doc) => (doc._id === docId ? { ...doc, status } : doc))
//       );
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Failed to update status");
//     }
//   };

//   return (
//     <div className="w-full p-6">
//       <h2 className="text-xl font-bold mb-4">University Documents Management</h2>

//       {/* Universities Table */}
//       <table className="w-full border-collapse mb-6">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-3">University</th>
//             <th className="p-3">Email</th>
//             <th className="p-3">Phone</th>
//             <th className="p-3">Status</th>
//             <th className="p-3">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {universities.length === 0 ? (
//             <tr>
//               <td colSpan={5} className="p-4 text-center text-gray-500">
//                 No universities found
//               </td>
//             </tr>
//           ) : (
//             universities.map((uni) => (
//               <tr key={uni._id} className="border-b hover:bg-gray-50">
//                 <td className="p-3">{uni.fullName}</td>
//                 <td className="p-3">{uni.email}</td>
//                 <td className="p-3">{uni.phone}</td>
//                 <td className="p-3">{uni.status}</td>
//                 <td className="p-3">
//                   <button
//                     onClick={() => handleViewDocuments(uni)}
//                     className="px-3 py-1 bg-blue-500 text-white rounded"
//                   >
//                     View Documents
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Popup for Documents */}
//       {selectedUniversity && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white w-3/4 max-h-[80vh] rounded-lg shadow-lg overflow-auto">
//             <div className="flex justify-between items-center p-3 border-b">
//               <h3 className="font-bold">
//                 {selectedUniversity.fullName} - Documents
//               </h3>
//               <button
//                 onClick={() => setSelectedUniversity(null)}
//                 className="px-3 py-1 bg-gray-200 rounded"
//               >
//                 Close
//               </button>
//             </div>

//             <div className="p-3">
//               {documents.length === 0 ? (
//                 <p>No documents uploaded yet.</p>
//               ) : (
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-100 text-left">
//                       <th className="p-2">Document Type</th>
//                       <th className="p-2">File</th>
//                       <th className="p-2">Status</th>
//                       <th className="p-2">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {documents.map((doc) => (
//                       <tr key={doc._id} className="border-b hover:bg-gray-50">
//                         <td className="p-2">{doc.docType}</td>
//                         <td className="p-2">
//                           <a
//                             href={doc.fileUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 underline"
//                           >
//                             View
//                           </a>
//                         </td>
//                         <td className="p-2">{doc.status}</td>
//                         <td className="p-2 space-x-2">
//                           {doc.status === "Pending" && (
//                             <>
//                               <button
//                                 onClick={() =>
//                                   handleStatusUpdate(doc._id, "Approved")
//                                 }
//                                 className="px-2 py-1 bg-green-500 text-white rounded"
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   handleStatusUpdate(doc._id, "Rejected")
//                                 }
//                                 className="px-2 py-1 bg-red-500 text-white rounded"
//                               >
//                                 Reject
//                               </button>
//                             </>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
