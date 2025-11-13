import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectAdminAuth } from "../../features/adminAuthSlice";

interface Props {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<Props> = ({ children }) => {
  const { adminToken } = useAppSelector(selectAdminAuth);
  return adminToken ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;
