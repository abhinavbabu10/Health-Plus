import React from "react";
import { Navbar, Sidebar, Footer } from "./"
interface LayoutProps {
  role: "admin" | "doctor" | "patient";
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ role, children }) => {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={role} />
        <main className="flex-1 p-6 overflow-auto bg-gray-100">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
