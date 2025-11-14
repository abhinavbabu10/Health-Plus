import React from "react";
import Sidebar from "../admin/pages/components/Sidebar";
import Navbar from "../admin/pages/components/Navbar";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
     
      <Sidebar />

  
      <div className="flex flex-col flex-1">
        <Navbar title={title} />  
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
