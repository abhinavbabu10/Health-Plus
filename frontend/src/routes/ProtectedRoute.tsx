import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  
  if (!token) {
    return <Navigate to="/login" replace />;
  }


  if (user?.role === "admin") {
    return <Navigate to="/admin/login" replace />;
  }


  return <>{children}</>;
};

export default ProtectedRoute;