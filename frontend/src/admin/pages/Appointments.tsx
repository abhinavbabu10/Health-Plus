import React from "react";
import AdminLayout from "../AdminLayout";

const Appointments: React.FC = () => {
  return (
    <AdminLayout title="Appointments">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">All Appointments</h2>
      <p className="text-gray-600">Track and manage all booked appointments here.</p>
    </AdminLayout>
  );
};

export default Appointments;
