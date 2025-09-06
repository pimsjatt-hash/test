 import React, { useState } from "react";
import {
  Home,
  Users,
  GraduationCap,
  User,
  Building2,
  UserPlus,
  Shield,
  BookOpen,
  Bell,
  DollarSign,
  ChevronDown,
  Sun,
  Globe,
  Rss,
  Landmark,
  Award,
  Notebook,
} from "lucide-react";

import SearchBar from "./SearchBar";
import DashboardCard from "./DashboardCard";
import CouponManager from "./dashboard components/CouponManager";
import ManageSubAdmins from "./dashboard components/ManageSubAdmins";
import UserManagement from "./UserManagement";
import CourseDashboard from "./dashboard components/CourseManagement";
import BlogManagerDashboard from "./dashboard components/BlogManagerDashboard";
import CertificateManagerDashboard from "./dashboard components/CertificateManagerDashboard.jsx";
import ReportsDashboard from "./dashboard components/ReportsDashboard.jsx";

// Sidebar menu structure
const menuItems = [
  { title: "Dashboard", icon: <Home size={18} /> },
  {
    title: "User Management",
    icon: <Users size={18} />,
    children: [
      { title: "Add User", icon: <UserPlus size={16} /> },
      { title: "Students", icon: <GraduationCap size={16} /> },
      { title: "Teachers", icon: <User size={16} /> },
      { title: "University", icon: <Building2 size={16} /> },
      { title: "Referral Partners", icon: <UserPlus size={16} /> },
      { title: "Sub-Admins", icon: <Shield size={16} /> },
    ],
  },
  { title: "Course Management", icon: <BookOpen size={18} /> },
  { title: "Notifications", icon: <Bell size={18} /> },
  { title: "Finance & Settlement", icon: <DollarSign size={18} /> },
  { title: "Certificate", icon: <Award size={18} /> },
  { title: "Report", icon: <Notebook size={18} /> },
  { title: "Blog", icon: <Rss size={18} /> },
  { title: "Governance", icon: <Landmark size={18} /> },
  { title: "doc uni", icon: <Landmark size={18} /> },
];

// Dashboard cards
const card = [
  { title: "45,892", subtitle: "Total Users", data: "12", icon: Users, colour: "red" },
  { title: "3,247", subtitle: "Total Courses", data: "8", icon: BookOpen, colour: "green" },
  { title: "$12.5M", subtitle: "Platform Revenue", data: "15", icon: DollarSign, colour: "orange" },
  { title: "8,945", subtitle: "Active Sessions", data: "5", icon: Globe, colour: "blue" },
];

export default function AdminDashboard() {
  const [openSections, setOpenSections] = useState({});
  const [activeItem, setActiveItem] = useState("Dashboard");

  const toggleSection = (title) =>
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));

  const handleItemClick = (item) => setActiveItem(item.title);

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 overflow-y-auto">
        <div className="text-2xl font-bold border-b-2 p-1 border-gray-600 mb-8">Larnik</div>
        {menuItems.map((item) => (
          <div key={item.title}>
            <div
              onClick={() =>
                item.children ? toggleSection(item.title) : handleItemClick(item)
              }
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                activeItem === item.title ? "bg-blue-50 text-blue-600" : "text-gray-700"
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.title}</span>
              {item.children && (
                <span className="text-xs">
                  {openSections[item.title] ? "▲" : "▼"}
                </span>
              )}
            </div>

            {item.children && openSections[item.title] && (
              <div className="ml-6 mt-1">
                {item.children.map((child) => (
                  <div
                    key={child.title}
                    onClick={() => handleItemClick(child)}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      activeItem === child.title
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {child.icon}
                    {child.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="flex flex-col overflow-y-auto w-full items-center">
        {/* Top bar */}
        <div className="bg-white w-full h-16 flex items-center justify-between px-7">
          <SearchBar />
          <div className="flex gap-7 items-center">
            <Sun className="hover:bg-green-600 w-12 h-12 rounded-xl p-3" size={32} />
            <Bell className="hover:bg-green-600 w-12 h-12 rounded-xl p-3" size={32} />
            <div className="flex gap-1 hover:bg-green-600 px-2 py-1 rounded-xl">
              <User />
              <span>Super Admin</span>
              <ChevronDown />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="w-full flex justify-center items-start bg-white mt-1 p-3 overflow-y-auto">
          {activeItem === "Dashboard" && (
            <div className="w-full flex flex-col gap-1 items-center">
              <div className="w-full flex items-center justify-center mt-2">
                <div className="bg-red-600 h-32 rounded-xl w-[98%] flex flex-col items-start justify-center p-5 text-white">
                  <span className="text-2xl font-bold">Admin Control Center 🛡️</span>
                  <span>Monitor and manage the entire platform</span>
                </div>
              </div>

              <span className="font-bold text-start w-full pl-4 mt-2 text-xl shadow-2xl">
                Quick Links
              </span>

              <div className="flex w-full px-5 gap-2 mt-2">
                {card.map((card, index) => (
                  <DashboardCard
                    key={index}
                    title={card.title}
                    icon={card.icon}
                    data={card.data}
                    colour={card.colour}
                  />
                ))}
              </div>

              <div className="w-full">
                <CouponManager />
              </div>
            </div>
          )}

          {/* User Management */}
          {["Students", "Teachers", "University", "Referral Partners", "Sub-Admins"].includes(
            activeItem
          ) && (
            <div className="w-full p-2">
              <UserManagement role={activeItem.toLowerCase()} />
            </div>
          )}

          {/* Course Management */}
          {activeItem === "Course Management" && <CourseDashboard />}

          {/* Certificate Management */}
          {activeItem === "Certificate" && (
            <div className="w-full flex flex-col gap-4 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Certificate Management</h2>
              </div>

              <div className="w-full bg-white rounded-xl shadow p-4">
                <CertificateManagerDashboard />
              </div>
            </div>
          )}

          {/* Reports */}
          {activeItem === "Report" && <ReportsDashboard />}

          {/* Add User */}
          {activeItem === "Add User" && <ManageSubAdmins />}

          {/* Blog */}
          {activeItem === "Blog" && <BlogManagerDashboard />}
        </div>
      </div>
    </div>
  );
}
