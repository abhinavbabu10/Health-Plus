import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  BarChart2,
  Settings,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { useAppDispatch } from "../../../app/hooks";
import { adminLogout } from "../../features/adminAuthSlice";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Doctors", path: "/admin/doctors", icon: <Stethoscope size={20} /> },
    { name: "Appointments", path: "/admin/appointments", icon: <Calendar size={20} /> },
    { name: "Reports", path: "/admin/reports", icon: <BarChart2 size={20} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-700 to-blue-800 text-white flex flex-col h-screen shadow-xl">
      <div className="p-6 font-bold text-2xl text-center border-b border-indigo-500">
        Health<span className="text-indigo-300">Plus</span> Admin
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/30">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-indigo-100 hover:bg-blue-500/40"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-3 text-sm border-t border-indigo-600 hover:bg-indigo-600 transition-all duration-200"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
