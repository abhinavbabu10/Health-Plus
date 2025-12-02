import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Calendar, Users, FileText, Settings, LogOut } from "lucide-react";
import { useAppDispatch } from "../../app/hooks";
import { doctorLogout } from "../../doctor/features/doctorAuthSlice";

const DoctorSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const nav = [ 
    { name: "Dashboard", to: "/doctor/dashboard", icon: <Home size={18} /> },
    { name: "Appointments", to: "/doctor/appointments", icon: <Calendar size={18} /> },
    { name: "Patients", to: "/doctor/patients", icon: <Users size={18} /> },
    { name: "Records", to: "/doctor/records", icon: <FileText size={18} /> },
    { name: "Settings", to: "/doctor/settings", icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    dispatch(doctorLogout());
    navigate("/doctor/login");
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-700 to-indigo-700 text-white flex flex-col h-screen shadow-xl">
      <div className="p-6 font-bold text-lg text-center border-b border-blue-600">
        Doc<span className="text-blue-200">Portal</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive ? "bg-blue-600" : "hover:bg-blue-600/30"}`
            }
          >
            {n.icon}
            <span>{n.name}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-3 text-sm border-t border-blue-600 hover:bg-blue-600/30 transition"
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
};

export default DoctorSidebar;