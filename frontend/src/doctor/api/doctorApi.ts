import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ----------------------
// Types
// ----------------------
export interface DoctorLoginDto {
  email: string;
  password: string;
}

export interface DoctorSignupDto {
  name: string;
  email: string;
  password: string;
  specialization: string;
  experience: number;
  fees: number;
  availableDays: string[];
}

export interface DoctorUser {
  id: string;
  name: string;
  email: string;
  role: "doctor";
}

export interface DashboardSummary {
  appointments: number;
  patients: number;
  todays: number;
}

export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  status: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  age?: number;
}

// ----------------------
// Doctor Auth API
// ----------------------
export const doctorLoginApi = async (credentials: DoctorLoginDto) => {
  const res = await axios.post(`${API_URL}/doctor/auth/login`, credentials);
  return res.data as { token: string; user: DoctorUser };
};

export const doctorSignupApi = async (data: DoctorSignupDto) => {
  const res = await axios.post(`${API_URL}/doctor/auth/register`, data);
  return res.data as { message: string };
};

// ----------------------
// Dashboard API
// ----------------------
export const getDoctorDashboardSummary = async (
  token: string
): Promise<DashboardSummary> => {
  const res = await axios.get(`${API_URL}/doctor/dashboard/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data as DashboardSummary;
};

export const getDoctorRecentAppointments = async (
  token: string,
  limit: number
): Promise<Appointment[]> => {
  const res = await axios.get(`${API_URL}/doctor/appointments/recent?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data as Appointment[];
};

export const getDoctorPatients = async (
  token: string,
  limit: number
): Promise<Patient[]> => {
  const res = await axios.get(`${API_URL}/doctor/patients/recent?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data as Patient[];
};
