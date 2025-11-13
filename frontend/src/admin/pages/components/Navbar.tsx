import React from "react";
import { Bell, UserCircle } from "lucide-react";

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-6">
        <button className="text-gray-600 hover:text-indigo-600 transition">
          <Bell size={22} />
        </button>
        <div className="flex items-center gap-2">
          <UserCircle size={28} className="text-gray-600" />
          <span className="text-gray-800 font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
