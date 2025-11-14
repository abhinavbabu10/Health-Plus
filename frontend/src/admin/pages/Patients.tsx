import React from "react";
import AdminLayout from "../AdminLayout";

const Patients: React.FC = () => {
  return (
    <AdminLayout title="Patients Management">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Patients List</h2>
      <p className="text-gray-600">Manage all patient data from here.</p>
    </AdminLayout>
  );
};

export default Patients;
