import React, { useState } from "react";
import { Home,  Users,  GraduationCap,  User,  Building2,  UserPlus,  Shield,  BookOpen,  Bell,  DollarSign,  ChevronDown,  Sun,  Globe,  UserCheck,  UserX,  Plus, Rss, Landmark,} from "lucide-react";
import SearchBar from "./SearchBar";
import DashboardCard from "./DashboardCard";
// import UserManagementCardDesign from "./UserManagementCardDesign";
// import UserManagementListDesign from "./UserManagementListDesign";
// import CourseManagement from "./dashboard components/CourseManagement";
// import NotificationManagement from "./dashboard components/NotificationManagement";
import CouponManager from "./dashboard components/CouponManager";
// import { Briefcase, CheckCircle, Handshake, PenTool } from "lucide-react";
// import SettlementTable from "./dashboard components/SettlementTable";
import { Award } from "lucide-react";
// import CertificateUpload from "./dashboard components/CertificateUpload";
import { Notebook } from "lucide-react";
import ManageSubAdmins from "./dashboard components/ManageSubAdmins";
// import ExportReports from "./dashboard components/ExportReports";
// import UserRoleAccess from "./dashboard components/UserRoleAccess";
// import BlogManagerDashboard from "./dashboard components/BlogManagerDashboard";
// import Governance from "./dashboard components/Governance";
import UserManagement from "./UserManagement";
import CourseDashboard from "./dashboard components/CourseManagement";
// import StudentDashboardCards from "./cards/StudentDashboardCards";
// import UploadUniversityDoc from "./university components/UploadUniversityDoc";

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
      // { title: "Partners", icon: <Handshake size={16} /> },
      // { title: "Career Cell", icon: <Briefcase size={16} /> },
      // { title: "Writers", icon: <PenTool size={16} /> },
      // { title: "Reviewers", icon: <CheckCircle size={16} /> },
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
]

const card = [
  {
    title: "45,892",
    subtitle: "Total Users",
    data: "12",
    icon: Users,
    colour : "red",
  },
  {
    title: "3,247",
    subtitle: "Total Courses",
    data: "8",
    icon: BookOpen,
    colour : "green",
  },
  {
    title: "$12.5M",
    subtitle: "Platrom Revenue",
    data: "15",
    icon: DollarSign,
    colour : "orange",
  },
  {
    title: "8,945",
    subtitle: "Active Sessions",
    data: "5",
    icon: Globe,
    colour : "blue",
  },
]

const alerts = [
  {
    title: "High Server Load",
    subtitle : "Server CPU is at 85%",
    data: "5 minutes",
    btn_name:"Warning",
    bgcolour: "yellow",
    ntmcolour: "yellow",

  },
  {
    title: "New Feature Deployed",
    subtitle : "Course analytics v2.0 is now live",
    data: "2 hours ago",
    btn_name:"info",
    bgcolour: "yellow",
    ntmcolour: "yellow",

  },
  {
    title: "Payment Gateway Issue",
    subtitle : "Some transactions are failing",
    data: "30 minutes ago",
    btn_name:"error",
    bgcolour: "yellow",
    ntmcolour: "yellow",

  },
  {
    title: "High Server Load",
    subtitle : "Server CPU is at 85%",
    data: "5 minutes",
    btn_name:"Warning",
    bgcolour: "yellow",
    ntmcolour: "yellow",

  },
  {
    title: "New Feature Deployed",
    subtitle : "Course analytics v2.0 is now live",
    data: "2 hours ago",
    btn_name:"info",
    bgcolour: "yellow",
    ntmcolour: "yellow",

  },
  {
    title: "Payment Gateway Issue",
    subtitle : "Some transactions are failing",
    data: "30 minutes ago",
    btn_name:"error",
    bgcolour: "yellow",
    ntmcolour: "yellow",

  },
]

const studentCards = [
  {
    title : "Total Students",
    icon : Users,
    subTitle : "+12% from last month",
    value : "2,380",
  },
  {
    title : "Active",
    icon : UserCheck,
    subTitle : "90.5% active rate",
    value : "2,156",
  },
  {
    title : "Pending",
    icon : UserX,
    subTitle : "Awaiting approval",
    value : "124",
  },
  {
    title : "This Month",
    icon : Plus,
    subTitle : "New registrations",
    value : "156",
  },
]

const userLists = [
  {
    name: "Alice Johnson",
    mail: "alice.johnson@mail.com",
    phone: "+91 9876543210",
    status: "alert",
    courses: "3",
    progress: 50,
    last_login: "24-08-2025",
    status_title: "Pending",
    status_colour: "red",
    progress_val: 50
  },
  {
    name: "Vikash Saini",
    mail: "vikash.saini@mail.com",
    phone: "+91 7231842488",
    status: "active",
    courses: "5",
    progress: 70,
    last_login: "12-08-2025",
    status_title: "Active",
    status_colour: "green",
    progress_val: 70
  },
  {
    name: "Sara Ali",
    mail: "sara.ali@mail.com",
    phone: "+91 8823445566",
    status: "active",
    courses: "6",
    progress: 85,
    last_login: "13-08-2025",
    status_title: "Active",
    status_colour: "green",
    progress_val: 85
  },
  {
    name: "Rohit Verma",
    mail: "rohit.verma@mail.com",
    phone: "+91 7744112233",
    status: "alert",
    courses: "1",
    progress: 15,
    last_login: "01-06-2025",
    status_title: "Pending",
    status_colour: "red",
    progress_val: 15
  },
  {
    name: "Emily Carter",
    mail: "emily.carter@mail.com",
    phone: "+91 9933221100",
    status: "active",
    courses: "7",
    progress: 95,
    last_login: "14-08-2025",
    status_title: "Active",
    status_colour: "green",
    progress_val: 95
  },
  {
    name: "Arjun Mehta",
    mail: "arjun.mehta@mail.com",
    phone: "+91 9102030405",
    status: "alert",
    courses: "2",
    progress: 35,
    last_login: "18-07-2025",
    status_title: "Pending",
    status_colour: "red",
    progress_val: 35
  }
]

export default function AdminDashboard () {
  // Track expanded sections
  const [openSections, setOpenSections] = useState({});
  // Track active menu item
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Toggle expand/collapse
  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Handle item click
  const handleItemClick = (item) => {
    setActiveItem(item.title);
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 overflow-y-auto">
        <div className="text-2xl font-bold border-b-2 p-1 border-gray-600 mb-8">
        <span>Larnik</span>
        </div>
        {menuItems.map((item) => (
          <div key={item.title}>
            {/* Main menu item */}
            <div
              onClick={() => {
                if (item.children) {
                  toggleSection(item.title);
                } else {
                  handleItemClick(item);
                }
              }}
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                activeItem === item.title ? "bg-blue-50 text-blue-600" : "text-gray-700"
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.title}</span>
              {item.children && (
                <span className="text-xs">{openSections[item.title] ? "▲" : "▼"}</span>
              )}
            </div>

            {/* Submenu items */}
            {item.children && openSections[item.title] && (
              <div className="ml-6 mt-1">
                {item.children.map((child) => (
                  <div
                    key={child.title}
                    onClick={() => handleItemClick(child)}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      activeItem === child.title ? "bg-blue-50 text-blue-600" : "text-gray-600"
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
      <div className="flex flex-col overflow-y-auto  w-full items-center">
        {/* dynamic top bar  */}
      <div className="bg-white w-full h-16 flex items-center justify-between px-7">
            <div>
              <SearchBar />
            </div>
            <div className="flex gap-7 items-center">
              <Sun className=" hover:bg-green-600 w-12 h-12 rounded-xl p-3" size={32}/>
              <Bell className=" hover:bg-green-600 w-12 h-12 rounded-xl p-3" size={32}/>
              <div className="flex gap-1 hover:bg-green-600 px-2 py-1 rounded-xl">
                <User />
                <span>Super Admin</span>
                <ChevronDown />
              </div>
            </div>
          </div>
        {/* dynamic top bar  */}



        {/* dynamic content area with nav  */}
        {/*debug colour */}
        <div className="w-full flex justify-center items-start bg-white mt-1 p-3 overflow-y-auto">
            {activeItem === "Dashboard" && (
            <div className="w-full flex flex-col gap-1 items-center">


              <div className="w-full flex items-center justify-center mt-2">
                <div className="bg-red-600 h-32 rounded-xl w-[98%] flex flex-col items-start justify-center p-5 text-white">
                 <span className="text-2xl font-bold">Admin Control Center 🛡️</span>
                 <span>Monitor and manage the entire platform</span>
                </div>
              </div>
                {/* quick links  */}
                <span className="font-bold text-start w-full pl-4 mt-2 text-xl shadow-2xl">Quick Links</span>
  
                   {menuItems.map((item) => (
            <div key={item.title} className="w-full">  
              {/* Submenu items */}
              {item.children && (
                <div className="flex"> {item.children.map((child) => (
                    <div key={child.title} onClick={() => handleItemClick(child)} className="flex items-center m-3 rounded-md cursor-pointer hover:bg-gray-100"
                    >
                    <div className="h-32 w-32 shadow-2xl rounded-xl bg-white flex items-center justify-center flex-col" >
                     {child.icon}
                     {child.title}
                   </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
  
                {/* quick links  */}

              <div className="flex  w-full px-5 gap-2 mt-2">
                {card.map((card, index) => (
                  <DashboardCard key={index} title={card.title} icon={card.icon} data={card.data} colour={card.colour}/>
                 ))}
              </div>

                  <div className="w-full">
                    <CouponManager />
                  </div>

            </div>
          )}
        
          {activeItem === "Students" && (
              <div className="flex w-full flex-col">
                <div className="flex flex-col gap-5 w-[98%]  bg-white p-5 rounded-2xl shadow-2xl">
                  <UserManagement role="Student"/>
              </div> 
              </div>
          )}
        
          {activeItem === "Teachers" && (
            <>
            <div className="w-full">
            <UserManagement role="Teachers"/>
            </div>
            </>
          )}
        
          {activeItem === "University" && (
            <div className="w-full">
              <UserManagement role="university"/>
            </div>
          )}
        
          {activeItem === "Referral Partners" && (
            <div className="w-full">
              <UserManagement role="referral"/>
            </div>
          )}
        
          {activeItem === "Sub-Admins" && (
            <div className="w-full">
              <UserManagement role="subadmin"/> 
            </div>
          )}
        
          {activeItem === "Course Management" && (
            <div className="flex w-full flex-col">
              {/* <h1 className="text-2xl font-bold mb-4">Course Management</h1>
              <p>Create, edit, and manage all courses.</p> */}
              {/* <CourseManagement /> */}
              <CourseDashboard />
            </div>
          )}
        
          {activeItem === "Course Monitoring" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Course Monitoring</h1>
              <p>Monitor course progress and completion rates.</p>
            </div>
          )}
        
          {activeItem === "Content Monitoring" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Content Monitoring</h1>
              <p>Review and approve course content.</p>
            </div>
          )}
        
          {activeItem === "Notifications" && (
            <div className="flex w-full flex-col">
              {/* <h1 className="text-2xl font-bold mb-4">Notifications</h1>
              <p>Manage system and user notifications.</p> */}
              {/* <NotificationManagement /> */}
            </div>
          )}
        
          {activeItem === "Finance & Settlement" && (
            <div className="w-full p-2">
              
              {/* <SettlementTable /> */}
            </div>
          )}
        
          {activeItem === "Certificate" && (
            <div className="w-full p-2">
              {/* <CertificateUpload /> */}
            </div>
          )}
        
          {activeItem === "Report" && (
            <div className="w-full p-2">
              {/* <ExportReports /> */}
            </div>
          )}
          {activeItem === "Add User" && (
            <div className="w-full p-2">
              {/* <UserRoleAccess /> */}
              <ManageSubAdmins />
            </div>
          )}
          {activeItem === "Blog" && (
            <div className="w-full p-2">
              {/* <BlogManagerDashboard /> */}
            </div>
          )}
          {activeItem === "Governance" && (
            <div className="w-full p-2">
              {/* <Governance /> */}
            </div>
          )}
          {activeItem === "doc uni" && (
            <div className="w-full p-2">
              {/* <UploadUniversityDoc /> */}
            </div>
          )}

        </div>
        {/* dynamic content area with nav  */}

      </div>

                


    </div>
  )
  
}

