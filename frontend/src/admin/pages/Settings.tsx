import React, { useState } from "react";
import AdminLayout from "../AdminLayout";
import { Settings, Lock, User, Bell } from "lucide-react";

const SettingsPage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <AdminLayout title="Admin Settings">
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="text-indigo-600" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">System Preferences</h2>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              <User size={18} className="text-indigo-500" />
              Profile
            </h3>
            <p className="text-sm text-gray-600">Update your admin profile and email address.</p>
          </section>

          <section>
            <h3 className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              <Lock size={18} className="text-indigo-500" />
              Security
            </h3>
            <p className="text-sm text-gray-600 mb-2">Change your password and enable 2-factor authentication.</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition">
              Update Password
            </button>
          </section>

          <section>
            <h3 className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              <Bell size={18} className="text-indigo-500" />
              Notifications
            </h3>
            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-4 h-4 accent-indigo-600"
              />
              Enable Email Notifications
            </label>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
