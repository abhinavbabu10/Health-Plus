import React from "react";
import { Bell } from "lucide-react";

const Topbar: React.FC = () => {
  return (
    <header className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
      </div>
    </header>
  );
};

export default Topbar;
