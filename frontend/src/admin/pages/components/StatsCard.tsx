import React from "react";
import { Users, Calendar, Activity } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: "users" | "appointments" | "activity";
}

const iconMap = {
  users: <Users size={24} className="text-indigo-600" />,
  appointments: <Calendar size={24} className="text-indigo-600" />,
  activity: <Activity size={24} className="text-indigo-600" />,
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon = "users" }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
        </div>
        <div className="bg-indigo-100 p-3 rounded-lg">{iconMap[icon]}</div>
      </div>
    </div>
  );
};

export default StatsCard;
