import React from "react";
import AdminLayout from "../AdminLayout";

const Doctors: React.FC = () => {
  return (
    <AdminLayout title="Doctors Management">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Doctors List</h2>
      <p className="text-gray-600">Here you’ll manage all registered doctors.</p>
    </AdminLayout>
  );
};

export default Doctors;
