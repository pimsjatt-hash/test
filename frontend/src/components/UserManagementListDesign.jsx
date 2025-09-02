// // // import React, { useState } from 'react';
// // // import StatusButton from './StatusButton';
// // // import { approveUserStatus, deleteUser } from '../api/api'; // ✅ import approveUserStatus

// // // export default function UserManagementListDesign({
// // //   userId,
// // //   name,
// // //   mail,
// // //   phone,
// // //   status_title,
// // //   status_colour,
// // //   onActionComplete, // parent refresh callback
// // // }) {
// // //   const [showConfirm, setShowConfirm] = useState(false);

// // //   const handleApprove = async () => {
// // //     try {
// // //       await approveUserStatus(userId, "Active"); // ✅ call approve API
// // //       onActionComplete?.(); // refresh parent list
// // //     } catch (err) {
// // //       console.error("Approve failed:", err);
// // //     }
// // //   };

// // //   const confirmDelete = async () => {
// // //     try {
// // //       await deleteUser(userId);
// // //       setShowConfirm(false);
// // //       onActionComplete?.();
// // //     } catch (err) {
// // //       console.error(err);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       <div className='flex bg-white justify-between p-2 items-center border-t-2 border-black'>
// // //         <div className='flex flex-col items-start w-1/4 truncate'>
// // //           <span className='font-bold'>{name}</span>
// // //           <span>{mail}</span>
// // //         </div>
// // //         <span className='w-1/6'>{phone}</span>
// // //         <div className='w-1/12'>
// // //           <StatusButton title={status_title} colour={status_colour} />
// // //         </div>
        
// // //         <div className='w-1/6 flex gap-2'>
// // //           <button
// // //             onClick={handleApprove}
// // //             className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
// // //           >
// // //             Approve
// // //           </button>
// // //           <button
// // //             onClick={() => setShowConfirm(true)}
// // //             className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
// // //           >
// // //             Delete
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {showConfirm && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
// // //           <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
// // //             <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
// // //             <p className="mb-6">
// // //               Do you really want to delete <b>{name}</b>? This action cannot be undone.
// // //             </p>
// // //             <div className="flex justify-center gap-4">
// // //               <button
// // //                 onClick={() => setShowConfirm(false)}
// // //                 className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 onClick={confirmDelete}
// // //                 className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
// // //               >
// // //                 Confirm Delete
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // }


// import React, { useState } from "react";
// import StatusButton from "./StatusButton";
// import { approveUserStatus, deleteUser } from "../api/api"; // ✅ approve API

// export default function UserManagementListDesign({
//   userId,
//   name,
//   mail,
//   phone,
//   status_title,
//   status_colour,
//   onActionComplete, // parent refresh callback
// }) {
//   const [showConfirm, setShowConfirm] = useState(false);

//   const handleToggleStatus = async () => {
//     try {
//       const newStatus = status_title === "Active" ? "Pending" : "Active"; // ✅ toggle
//       await approveUserStatus(userId, newStatus);
//       onActionComplete?.(); // refresh parent
//     } catch (err) {
//       console.error("Status update failed:", err);
//     }
//   };

//   const confirmDelete = async () => {
//     try {
//       await deleteUser(userId);
//       setShowConfirm(false);
//       onActionComplete?.();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       <div className="flex bg-white justify-between p-2 items-center border-t-2 border-black">
//         <div className="flex flex-col items-start w-1/4 truncate">
//           <span className="font-bold">{name}</span>
//           <span>{mail}</span>
//         </div>
//         <span className="w-1/6">{phone}</span>
//         <div className="w-1/12">
//           <StatusButton title={status_title} colour={status_colour} />
//         </div>

//         <div className="w-1/6 flex gap-2">
//           <button
//             onClick={handleToggleStatus}
//             className={`px-2 py-1 rounded text-white ${
//               status_title === "Active"
//                 ? "bg-yellow-500 hover:bg-yellow-600" // if Active → show Deactivate button
//                 : "bg-green-500 hover:bg-green-600" // if Pending → show Approve button
//             }`}
//           >
//             {status_title === "Active" ? "Set Pending" : "Approve"}
//           </button>

//           <button
//             onClick={() => setShowConfirm(true)}
//             className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Delete
//           </button>
//         </div>
//       </div>

//       {showConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
//             <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
//             <p className="mb-6">
//               Do you really want to delete <b>{name}</b>? This action cannot be
//               undone.
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => setShowConfirm(false)}
//                 className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 Confirm Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



import React, { useState } from "react";
import StatusButton from "./StatusButton";
import { approveUserStatus, deleteUsers } from "../api/api"; // ✅ fixed import

export default function UserManagementListDesign({
  userId,
  name,
  mail,
  phone,
  status_title,
  status_colour,
  onActionComplete, // parent refresh callback
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggleStatus = async () => {
    try {
      // ✅ Make sure case matches your DB ("Pending"/"Active")
      const newStatus = status_title === "Active" ? "Pending" : "Active";
      await approveUserStatus(userId, newStatus);
      onActionComplete?.(); // refresh parent list
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUsers(userId); // ✅ fixed API call
      setShowConfirm(false);
      onActionComplete?.();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <>
      <div className="flex bg-white justify-between p-2 items-center border-t-2 border-black">
        <div className="flex flex-col items-start w-1/4 truncate">
          <span className="font-bold">{name}</span>
          <span>{mail}</span>
        </div>
        <span className="w-1/6">{phone}</span>
        <div className="w-1/12">
          <StatusButton title={status_title} colour={status_colour} />
        </div>

        <div className="w-1/6 flex gap-2">
          <button
            onClick={handleToggleStatus}
            className={`px-2 py-1 rounded text-white ${
              status_title === "Active"
                ? "bg-yellow-500 hover:bg-yellow-600" // Active → Set Pending
                : "bg-green-500 hover:bg-green-600" // Pending → Approve
            }`}
          >
            {status_title === "Active" ? "Set Pending" : "Approve"}
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">
              Do you really want to delete <b>{name}</b>? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
