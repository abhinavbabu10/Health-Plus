import React from "react";
import AdminLayout from "../AdminLayout";
import { FileText, TrendingUp } from "lucide-react";

const Reports: React.FC = () => {
  return (
    <AdminLayout title="Reports & Analytics">
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="text-indigo-600" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">Reports Overview</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Generate and review performance reports, appointment summaries, and user statistics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <TrendingUp className="text-indigo-500" size={18} />
              System Growth
            </h3>
            <p className="text-sm text-gray-600">
              View platform growth over time including new users and appointment trends.
            </p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-gray-700 mb-2">Download Reports</h3>
            <p className="text-sm text-gray-600 mb-3">
              Export data in PDF, Excel, or CSV format for deeper analysis.
            </p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition">
              Download
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
