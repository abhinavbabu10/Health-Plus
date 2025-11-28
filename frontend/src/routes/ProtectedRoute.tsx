import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { ReactNode } from "react";
import { logout as userLogout } from "../features/auth/authSlice";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isBlocked) {
    dispatch(userLogout());
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
