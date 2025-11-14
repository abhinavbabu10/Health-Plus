import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import HomeLoggedIn from "../pages/HomeLoggedIn";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "../pages/Signup";
import Login from "../pages/Login";

// Admin Imports
import AdminLogin from "../admin/pages/AdminLogin";
import AdminDashboard from "../admin/pages/AdminDashboard";
import Doctors from "../admin/pages/Doctors";
import Patients from "../admin/pages/Patients";
import Appointments from "../admin/pages/Appointments";
import Reports from "../admin/pages/Reports";
import SettingsPage from "../admin/pages/Settings";
import AdminProtectedRoute from "../admin/routes/ProtectedAdminRoute";
import DoctorSignup from "../doctor/pages/DoctorSignup";
import DoctorLogin from "../doctor/pages/DoctorLogin"; 
import DoctorDashboard from "../doctor/components/DoctorDashboard";
import DoctorProtectedRoute from "../doctor/components/ProtectedDoctorRoute";

const AppRouter = () => {
  return (
    <Routes>
      {/* 🏠 User Routes */}
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
   
   <Route path="/doctor/signup" element={<DoctorSignup />} />

   <Route path="/doctor/login" element={<DoctorLogin />} />

  <Route
  path="/doctor/dashboard"
  element={
    <DoctorProtectedRoute>
      <DoctorDashboard />
    </DoctorProtectedRoute>
  }
/>



      {/* 🧑‍💼 Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 🔒 Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <AdminProtectedRoute>
            <Doctors />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/patients"
        element={
          <AdminProtectedRoute>
            <Patients />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <AdminProtectedRoute>
            <Appointments />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminProtectedRoute>
            <Reports />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminProtectedRoute>
            <SettingsPage />
          </AdminProtectedRoute>
        }
      />

      {/* 🚫 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
