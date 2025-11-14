// src/doctor/pages/DoctorDashboard.tsx
import React, { useEffect, useState } from "react";
import DoctorSidebar from "../../doctor/components/DoctorSidebar";
import DoctorNavbar from "../../doctor/components/DoctorNavbar";
import { useAppSelector } from "../../app/hooks";
import { selectDoctorAuth } from "../features/doctorAuthSlice";
import { 
  getDoctorDashboardSummary, 
  getDoctorRecentAppointments, 
  getDoctorPatients 
} from "../api/doctorApi";
import type { Appointment, Patient } from "../types/DoctorTypes";

const StatsCard: React.FC<{ title: string; value: number }> = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
  </div>
);

const DoctorDashboard: React.FC = () => {
  const { doctorToken } = useAppSelector(selectDoctorAuth);

  const [summary, setSummary] = useState({ appointments: 0, patients: 0, todays: 0 });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!doctorToken) return;

      setLoading(true);

      try {
        const s = await getDoctorDashboardSummary(doctorToken);

        setSummary({
          appointments: s.appointments ?? 0,
          patients: s.patients ?? 0,
          todays: s.todays ?? 0,
        });

        const apptsArray = await getDoctorRecentAppointments(doctorToken, 6);
        setAppointments(Array.isArray(apptsArray) ? apptsArray : []);

        const patsArray = await getDoctorPatients(doctorToken, 6);
        setPatients(Array.isArray(patsArray) ? patsArray : []);

      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [doctorToken]);

  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />

      <div className="flex-1 flex flex-col">
        <DoctorNavbar />

        <main className="p-6 overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatsCard title="Total Appointments" value={summary.appointments} />
            <StatsCard title="Patients" value={summary.patients} />
            <StatsCard title="Today's Appointments" value={summary.todays} />
          </section>

          {/* Data Lists */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Appointments */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold mb-3">Recent Appointments</h3>

              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : appointments.length === 0 ? (
                <p className="text-sm text-gray-500">No appointments found.</p>
              ) : (
                <ul className="space-y-2">
                  {appointments.map((a, idx) => (
                    <li key={a.id ?? idx} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="text-sm font-medium">
                          {a.patientName ?? a.patient?.name ?? "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(a.date).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">{a.status ?? "Scheduled"}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Recent Patients */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold mb-3">Recent Patients</h3>

              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : patients.length === 0 ? (
                <p className="text-sm text-gray-500">No patients found.</p>
              ) : (
                <ul className="space-y-2">
                  {patients.map((p, idx) => (
                    <li key={p.id ?? idx} className="flex items-center gap-3 p-2 border rounded">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{p.name ?? p.fullName ?? "Unnamed"}</div>
                        <div className="text-xs text-gray-500">{p.email ?? p.contact ?? "—"}</div>
                      </div>
                      <div className="text-xs text-gray-600">{p.age ? `${p.age} yrs` : ""}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </section>
        </main>

      </div>
    </div>
  );
};

export default DoctorDashboard;
