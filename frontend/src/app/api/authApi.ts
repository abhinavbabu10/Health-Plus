import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export const signupUser = async (userData: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: string;
  dob: string;
  address: string;
  role: string;
}) => {
  const response = await axios.post(`${API_URL}/api/auth/signup`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};


export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await axios.post(`${API_URL}/api/auth/verify-otp`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};


export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, credentials, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};
