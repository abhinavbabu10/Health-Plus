// src/doctor/pages/components/ProtectedDoctorRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import type { RootState } from "../../app/store";

interface Props {
  children: React.ReactNode;
}

const ProtectedDoctorRoute = ({ children }: Props) => {
  const { doctorToken, doctor } = useAppSelector((state: RootState) => state.doctorAuth); 

  if (!doctorToken || !doctor) {
    return <Navigate to="/doctor/login" replace />;
  }

  if (doctor.role !== "doctor") {
    // safety: if not doctor, redirect to main login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedDoctorRoute;
