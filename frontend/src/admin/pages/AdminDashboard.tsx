import React, { useEffect, useState } from "react";
import Sidebar from "../pages/components/Sidebar";
import Navbar from "../pages/components/Navbar";
import StatsCard from "../pages/components/StatsCard";
import { useAppSelector } from "../../app/hooks";
import { selectAdminAuth } from "../features/adminAuthSlice";
import { getAdminDashboardSummary } from "../utils/api/adminApi";

const AdminDashboard: React.FC = () => {
  const { adminToken } = useAppSelector(selectAdminAuth);
  const [summary, setSummary] = useState({ doctors: 0, patients: 0, appointments: 0 });

  useEffect(() => {
    const fetchSummary = async () => {
      if (!adminToken) return;
      try {
        const data = await getAdminDashboardSummary(adminToken);
        setSummary(data);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    };
    fetchSummary();
  }, [adminToken]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar title="Admin Dashboard" />
        <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard title="Doctors" value={summary.doctors} icon="users" />
          <StatsCard title="Patients" value={summary.patients} icon="activity" />
          <StatsCard title="Appointments" value={summary.appointments} icon="appointments" />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
