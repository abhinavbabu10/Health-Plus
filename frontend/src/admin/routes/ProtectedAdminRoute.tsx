import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAdminAuth } from "../features/adminAuthSlice";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { adminToken, adminUser, loading } = useAppSelector(selectAdminAuth);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-indigo-600 font-semibold text-lg">
        Checking admin access...
      </div>
    );
  }

 
  if (!adminToken || !adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

 
  return <>{children}</>;
};

export default ProtectedAdminRoute;
