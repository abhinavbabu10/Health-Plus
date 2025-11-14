import React from "react";
import {
  Users,
  Calendar,
  Activity,
  Stethoscope,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: "users" | "appointments" | "activity" | "doctors";
}

const iconMap = {
  users: <Users size={26} className="text-indigo-600" />,
  appointments: <Calendar size={26} className="text-indigo-600" />,
  activity: <Activity size={26} className="text-indigo-600" />,
  doctors: <Stethoscope size={26} className="text-indigo-600" />,
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon = "users",
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 border border-gray-100 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 tracking-wide">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-gray-800 mt-2 animate-fadeIn">
            {value}
          </h3>
        </div>

        <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-full">
          <div className="absolute inset-0 animate-pulse opacity-20 bg-indigo-300 rounded-full"></div>
          {iconMap[icon]}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
