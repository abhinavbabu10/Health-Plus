import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  role: "admin" | "doctor" | "patient";
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const links = {
    admin: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Manage Users", path: "/admin/users" },
      { name: "Appointments", path: "/admin/appointments" },
    ],
    doctor: [
      { name: "Dashboard", path: "/doctor/dashboard" },
      { name: "My Appointments", path: "/doctor/appointments" },
      { name: "Prescriptions", path: "/doctor/prescriptions" },
    ],
    patient: [
      { name: "Dashboard", path: "/patient/dashboard" },
      { name: "Book Appointment", path: "/patient/book" },
      { name: "My Prescriptions", path: "/patient/prescriptions" },
    ],
  };

  return (
    <aside className="w-64 bg-indigo-600 text-white h-screen p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <nav className="flex flex-col space-y-2">
        {links[role].map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded hover:bg-indigo-500 ${
                isActive ? "bg-indigo-500 font-semibold" : ""
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
