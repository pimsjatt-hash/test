import React, { useEffect, useState } from "react";
import { Users, UserCheck, UserX, CalendarDays } from "lucide-react";
import { 
  getStudents, 
  getTeachers, 
  getUniversity, 
  getReferral, 
  getPartners, 
  getSubAdmins // ✅ fixed plural
} from "../../api/api"; 
import UserManagementCardDesign from "../UserManagementCardDesign";

export default function StudentDashboardCards({ role, refreshKey }) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        const normalizedRole = role?.toLowerCase(); // ✅ normalize

        if (normalizedRole === "student") {
          res = await getStudents();
        } else if (normalizedRole === "teacher" || normalizedRole === "teachers") {
          res = await getTeachers();
        } else if (normalizedRole === "university") {
          res = await getUniversity();
        } else if (normalizedRole === "referral") {
          res = await getReferral();
        } else if (normalizedRole === "partner" || normalizedRole === "partners") {
          res = await getPartners();
        } else if (normalizedRole === "subadmin" || normalizedRole === "sub-admin") {
          res = await getSubAdmins(); // ✅ fixed
        }

        const users = res?.data || [];
        console.log(`Fetched ${role}s:`, users);

        // ✅ Total count
        const total = users.length;

        // ✅ Status-based counts
        const activeCount = users.filter((u) => u.status === "Active").length;
        const pendingCount = users.filter((u) => u.status === "Pending").length;

        // ✅ Joined this month
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const thisMonthCount = users.filter((u) => {
          const createdAt = new Date(u.createdAt);
          return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear;
        }).length;

        setCards([
          {
            title: `Total ${role}s`,
            value: total,
            subTitle: `All registered ${normalizedRole}s`,
            icon: Users,
          },
          {
            title: `Active ${role}s`,
            value: activeCount,
            subTitle: "Currently active",
            icon: UserCheck,
          },
          {
            title: `Pending ${role}s`,
            value: pendingCount,
            subTitle: "Awaiting approval",
            icon: UserX,
          },
          {
            title: "New This Month",
            value: thisMonthCount,
            subTitle: "Joined this month",
            icon: CalendarDays,
          },
        ]);
      } catch (err) {
        console.error(`Failed to fetch ${role}s:`, err);
      }
    };

    fetchData();
  }, [role, refreshKey]); // 🔑 re-fetch if role changes or refreshKey increments

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-row gap-5 w-full p-5">
        {cards.map((card, index) => (
          <UserManagementCardDesign
            key={index}
            title={card.title}
            subTitle={card.subTitle}
            icon={card.icon}
            value={card.value}
          />
        ))}
      </div>
    </div>
  );
}
