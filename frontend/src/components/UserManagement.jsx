// src/components/UserManagement.jsx
import React, { useEffect, useState } from "react";
import {
  getPartners,
  getReferral,
  getStudents,
  getSubAdmins, // ✅ corrected plural
  getTeachers,
  getUniversity,
} from "../api/api";
import UserManagementListDesign from "./UserManagementListDesign";
import StudentDashboardCards from "./cards/StudentDashboardCards";

export default function UserManagement(props) {
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let data = [];

      // ✅ normalize role (lowercase to avoid case mismatches)
      const role = props.role?.toLowerCase();

      if (role === "student") {
        const response = await getStudents();
        data = response.data;
      } else if (role === "teacher") {
        const response = await getTeachers();
        data = response.data;
      } else if (role === "university") {
        const response = await getUniversity();
        data = response.data;
      } else if (role === "referral") {
        const response = await getReferral();
        data = response.data;
      } else if (role === "partner" || role === "partners") {
        const response = await getPartners();
        data = response.data;
      } else if (role === "subadmin" || role === "sub-admin") {
        const response = await getSubAdmins(); // ✅ corrected function name
        data = response.data;
      }

      console.log(`${props.role}s from API:`, data);
      setUserLists(data);
    } catch (err) {
      console.error(`Failed to fetch ${props.role}s:`, err);
      setUserLists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [props.role]); // refetch if role changes

  if (loading) return <div className="p-4">Loading {props.role}s...</div>;
  if (!userLists.length) return <div className="p-4">No {props.role}s found</div>;

  return (
    <div>
      {/* Dashboard Cards */}
      <StudentDashboardCards role={props.role} />

      {/* Header */}
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col items-start m-6">
            <span className="font-bold">{props.role} List</span>
            <span>View and manage all {props.role} on your platform</span>
          </div>
        </div>
      </div>

      {/* Table header */}
      <div className="bg-gray-200 flex justify-between items-center text-start p-2 font-bold">
        <span className="w-1/4">Name</span>
        <span className="w-1/6">Phone</span>
        <span className="w-1/12">Status</span>
        <span className="w-1/12">Actions</span>
      </div>

      {/* Users list */}
      {userLists.map((user) => (
        <UserManagementListDesign
          key={user._id}
          userId={user._id}
          name={user.fullName || user.name || user.title || "Unnamed"}
          mail={user.email}
          phone={user.phone}
          status_title={user.status}
          status_colour={user.status === "Active" ? "green" : "yellow"}
          onActionComplete={fetchUsers} // ✅ refresh after action
        />
      ))}
    </div>
  );
}
