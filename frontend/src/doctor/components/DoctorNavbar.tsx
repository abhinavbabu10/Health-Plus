// src/doctor/pages/components/DoctorNavbar.tsx
import React from "react";
import { Bell, UserCircle } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import type { RootState } from "../../app/store";

const DoctorNavbar: React.FC = () => {
  const { doctor } = useAppSelector((state: RootState) => state.doctorAuth);

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      <h1 className="text-lg font-semibold text-gray-800">Hello, {doctor?.name?.split(" ")[0] ?? "Doctor"}</h1>
      <div className="flex items-center gap-6">
        <button className="text-gray-600 hover:text-blue-600 transition"><Bell size={20} /></button>
        <div className="flex items-center gap-3">
          <UserCircle size={28} className="text-gray-600" />
          <span className="text-gray-800 font-medium">{doctor?.name ?? "Doctor"}</span>
        </div>
      </div>
    </header>
  ); 
};

export default DoctorNavbar;
