import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import HomeLoggedIn from "../pages/HomeLoggedIn";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "../pages/Signup";
import Login from "../pages/Login";


import AdminLogin from "../admin/pages/AdminLogin";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminProtectedRoute from "../admin/pages/components/ProtectedAdminRoute";

const AppRouter = () => {
  return (
    <Routes>
 
      <Route path="/" element={<Home />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomeLoggedIn />
          </ProtectedRoute>
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

 
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

    
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
