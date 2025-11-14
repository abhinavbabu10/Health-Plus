import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import StatsCard from "../../admin/pages/components/StatsCard";
import { getAdminDashboardSummary } from "../utils/api/adminApi";
import { useAppSelector } from "../../app/hooks";
import { selectAdminAuth } from "../features/adminAuthSlice";

const Dashboard: React.FC = () => {
  const { adminToken } = useAppSelector(selectAdminAuth);
  const [summary, setSummary] = useState({ doctors: 0, patients: 0, appointments: 0 });

  useEffect(() => {
    const fetchSummary = async () => {
      if (!adminToken) return;
      try {
        const data = await getAdminDashboardSummary(adminToken);
        setSummary(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, [adminToken]);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Doctors" value={summary.doctors} icon="users" />
        <StatsCard title="Patients" value={summary.patients} icon="activity" />
        <StatsCard title="Appointments" value={summary.appointments} icon="appointments" />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
